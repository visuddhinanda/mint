<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskRelation;
use App\Models\TaskAssignee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\TaskResource;
use App\Http\Api\AuthApi;
use App\Http\Api\WatchApi;

class TaskStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, string $id)
    {
        //
        $task = Task::findOrFail($id);
        $user = AuthApi::current($request);
        if (!$user) {
            return $this->error(__('auth.failed'), 401, 401);
        }
        if (!$this->canEdit($user['user_uid'], $task)) {
            return $this->error(__('auth.failed'), 403, 403);
        }

        if (!$request->has('status')) {
            return $this->error('no status', 400, 400);
        }
        $doneTask = [];
        $publishTask = [];
        switch ($request->get('status')) {
            case 'publish':
                # code...
                break;
            case 'running':
                $task->started_at = now();
                $task->executor_id = $user['user_uid'];
                break;
            case 'done':
                $task->finished_at = now();
                $preTask = [$task->id];
                //开启父任务
                if ($task->parent_id) {
                    $notCompleted = Task::where('parent_id', $task->parent_id)
                        ->where('id', '!=', $task->id)
                        ->where('status', '!=', 'done')
                        ->count();
                    if ($notCompleted === 0) {
                        //父任务已经完成
                        Task::where('id', $task->parent_id)
                            ->update([
                                'status' => 'done',
                                'editor_id' => $user['user_uid'],
                                'updated_at' => now(),
                                'finished_at' => now()
                            ]);
                        $doneTask[] = $task->parent_id;
                        $preTask[] = $task->parent_id;
                    }
                }
                //开启后置任务
                $nextTasks = TaskRelation::whereIn('task_id', $preTask)
                    ->select('next_task_id')->get();
                foreach ($nextTasks as $key => $value) {
                    $publishTask[] = $value->next_task_id;
                }
                //开启后置任务的子任务
                $nextTasksChildren = Task::whereIn('parent_id', $publishTask)
                    ->select('id')->get();
                foreach ($nextTasksChildren as $child) {
                    $publishTask[] = $child->id;
                }
                Task::whereIn('id', $publishTask)
                    ->where('status', 'pending')
                    ->update([
                        'status' => 'published',
                        'editor_id' => $user['user_uid'],
                        'updated_at' => now()
                    ]);
                break;
        }
        $task->status = $request->get('status');
        //发送站内信
        $doneTask[] = $task->id;
        $doneSend = WatchApi::change(
            resId: $doneTask,
            from: $user['user_uid'],
            message: "任务状态变为 已经完成",
        );

        $pubSend = WatchApi::change(
            resId: $publishTask,
            from: $user['user_uid'],
            message: "任务状态变为 已经发布",
        );
        Log::debug('watch message', ['done' => $doneSend, 'published' => $pubSend]);

        $task->editor_id = $user['user_uid'];
        $task->save();

        $result = Task::whereIn('id', array_merge($doneTask, $publishTask))
            ->get();
        return $this->ok(
            [
                "rows" => TaskResource::collection(resource: $result),
                "count" => count($result),
            ]
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function destroy(Task $task)
    {
        //
    }

    public  function canEdit(string $user_uid, Task $task)
    {
        if ($user_uid === $task->owner_id || $user_uid === $task->executor_id) {
            return true;
        }
        $has = TaskAssignee::where('task_id', $task->id)
            ->where('assignee_id', $user_uid)->exists();
        if ($has) {
            return true;
        }
        return false;
    }
}