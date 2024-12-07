<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

use App\Models\Task;
use App\Models\TaskAssignee;
use App\Models\Project;
use App\Http\Resources\TaskResource;

use App\Http\Api\AuthApi;
use App\Http\Api\StudioApi;
use App\Http\Api\TaskApi;
use App\Http\Api\WatchApi;


class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //
        Log::debug('task controller start');
        $user = AuthApi::current($request);
        if (!$user) {
            Log::error('notification auth failed {request}', ['request' => $request]);
            return $this->error(__('auth.failed'), 401, 401);
        }

        switch ($request->get('view')) {
            case 'all':
                $table = Task::whereNotNull('owner_id');
                break;
            case 'studio':
                $table = Task::where('owner_id', $user['user_uid']);
                break;
            case 'project':
                $projects = Project::where('id', $request->get('project_id'))
                    ->orWhereJsonContains('path', $request->get('project_id'))
                    ->select('id')
                    ->get();
                $table = Task::whereIn('project_id', $projects);
                break;
            default:
                # code...
                break;
        }
        if ($request->has('executor_id_includes')) {
            $table = $table->whereIn(
                'executor_id',
                explode(',', $request->get('executor_id_includes'))
            );
        }
        if ($request->has('executor_id_not-includes')) {
            $table = $table->whereNotIn(
                'executor_id',
                explode(',', $request->get('executor_id_not-includes'))
            );
        }
        if ($request->has('assignees_id_includes')) {
            $table = $table->whereJsonContains(
                'assignees_id',
                explode(',', $request->get('assignees_id_includes'))
            );
        }
        if ($request->has('assignees_id_not-includes')) {
            $table = $table->whereJsonDoesntContain(
                'assignees_id',
                explode(',', $request->get('assignees_id_not-includes'))
            );
        }
        if ($request->get('sign_up_equals') === 'true') {
            $table = $table->whereNull('assignees_id')
                ->whereNull('executor_id');
        }

        if ($request->has('participants_id_includes')) {
            $id = explode(',', $request->get('participants_id_includes'));
            $tasks_id = TaskAssignee::whereIn('assignee_id', $id)->select('task_id')->get();
            $table = $table->where(function ($query) use ($id, $tasks_id) {
                $query->whereIn('executor_id', $id)
                    ->orWhereIn('id', $tasks_id);
            });
        }

        if ($request->has('participants_id_not-includes')) {
            $id = explode(',', $request->get('participants_id_not-includes'));
            $table = $table->where(function ($query) use ($id) {
                $query->whereJsonDoesntContain('assignees_id', $id)
                    ->whereNotIn('executor_id', $id);
            });
        }

        if ($request->has('keyword')) {
            $table = $table->where('title', 'like', '%' . $request->get('keyword') . '%');
        }
        if ($request->has('status') && $request->get('status') !== 'all') {
            $table = $table->whereIn('status', explode(',', $request->get('status')));
        }
        $count = $table->count();

        $table = $table->orderBy(
            $request->get('order', 'created_at'),
            $request->get('dir', 'asc')
        );

        $table = $table->skip($request->get("offset", 0))
            ->take($request->get('limit', 1000));

        Log::debug('sql', ['sql' => $table->toSql()]);

        $result = $table->get();

        return $this->ok(
            [
                "rows" => TaskResource::collection(resource: $result),
                "count" => $count,
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        $user = AuthApi::current($request);
        if (!$user) {
            return $this->error(__('auth.failed'), 401, 401);
        }
        $studioId = StudioApi::getIdByName($request->get('studio_name'));

        if (!self::canEdit($user['user_uid'], $studioId)) {
            return $this->error(__('auth.failed'), 403, 403);
        }
        $new = Task::firstOrNew(
            [
                'id' => $request->get('id')
            ],
            [
                'owner_id' => $studioId,
                'project_id' => $request->get('project_id'),
            ],
        );
        if (Str::isUuid($request->get('id'))) {
            $new->id = $request->get('id');
        } else {
            $new->id =  Str::uuid();
        }
        $new->title = $request->get('title');
        $new->editor_id = $user['user_uid'];
        $new->parent_id = $request->get('parent_id');
        //处理任务顺序
        if ($request->get('parent_id')) {
            $maxOrder = Task::where('parent_id', $request->get('parent_id'))
                ->max('order');
        } else {
            $maxOrder = Task::where('project_id', $request->get('project_id'))
                ->max('order');
        }
        if ($maxOrder === null) {
            $new->order = 1;
        } else {
            $new->order = $maxOrder + 1;
        }
        $new->save();

        return $this->ok(new TaskResource($new));
    }

    /**
     * Display the specified resource.
     *
     * @param  Task  $task
     * @return \Illuminate\Http\Response
     */
    public function show(Task $task)
    {
        //
        return $this->ok(new TaskResource($task));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Task $task
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Task $task)
    {
        //
        $user = AuthApi::current($request);
        if (!$user) {
            return $this->error(__('auth.failed'), 401, 401);
        }
        if (!self::canEdit($user['user_uid'], $task->owner_id)) {
            return $this->error(__('auth.failed'), 403, 403);
        }
        if ($request->has('title')) {
            $task->title = $request->get('title');
        }
        if ($request->has('description')) {
            $task->description = $request->get('description');
        }
        if ($request->has('assignees_id')) {
            $delete = TaskAssignee::where('task_id', $task->id)->delete();
            $assigneesData = [];
            foreach ($request->get('assignees_id') as $key => $id) {
                $assigneesData[] = [
                    'id' => Str::uuid(),
                    'task_id' => $task->id,
                    'assignee_id' => $id,
                    'editor_id' => $user['user_uid'],
                ];
            }
            TaskAssignee::insert($assigneesData);
        }
        if ($request->has('roles')) {
            $task->roles = json_encode($request->get('roles'), JSON_UNESCAPED_UNICODE);
        }
        if ($request->has('executor_id')) {
            $task->executor_id = $request->get('executor_id');
        }
        if ($request->has('executor_relation_task_id')) {
            $task->executor_relation_task_id = $request->get('executor_relation_task_id');
        }
        if ($request->has('project_id')) {
            $task->project_id = $request->get('project_id');
        }
        if ($request->has('pre_task_id')) {
            TaskApi::setRelationTasks(
                $task->id,
                explode(',', $request->get('pre_task_id')),
                $user['user_uid'],
                'pre'
            );
        }
        if ($request->has('next_task_id')) {
            TaskApi::setRelationTasks(
                $task->id,
                explode(',', $request->get('next_task_id')),
                $user['user_uid'],
                'next'
            );
        }
        if ($request->has('is_milestone')) {
            $task->is_milestone = $request->get('is_milestone');
        }
        if ($request->has('order')) {
            $task->order = $request->get('order');
        }

        $task->editor_id = $user['user_uid'];
        $task->save();

        return $this->ok(new TaskResource($task));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Task  $task
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Task  $task)
    {
        //
        $user = AuthApi::current($request);
        if (!$user) {
            return $this->error(__('auth.failed'), 401, 401);
        }
        if (!self::canEdit($user['user_uid'], $task->owner)) {
            return $this->error(__('auth.failed'), 403, 403);
        }
        $task->delete();
        if ($task->trashed()) {
            return $this->ok('ok');
        } else {
            return $this->error('fail', 500, 500);
        }
    }

    public static function canEdit($user_uid, $owner_uid)
    {
        return $user_uid === $owner_uid;
    }
}
