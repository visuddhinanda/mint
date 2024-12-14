<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Support\Facades\Log;

use Illuminate\Http\Request;
use App\Http\Api\AuthApi;

use Illuminate\Support\Str;

class TaskGroupController extends Controller
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

        $user = AuthApi::current($request);
        if (!$user) {
            return $this->error(__('auth.failed'), 401, 401);
        }
        $studioId = Project::where('id', $request->get('project_id'))
            ->value('owner_id');

        if (!TaskController::canEdit($user['user_uid'], $studioId)) {
            Log::error(__('auth.failed'), ['user' => $user['user_uid'], 'owner' => $studioId]);
            return $this->error(__('auth.failed'), 403, 403);
        }

        $input = $request->get(key: 'data');
        $data = [];
        foreach ($input as $key => $value) {
            $data[] = [
                'id' => Str::uuid(),
                'old_id' => $value['id'],
                'title' => $value['title'],
                'order' => $value['order'],
                'parent_id' => $value['parent_id'],
                'project_id' => $request->get('project_id'),
                'owner_id' => $studioId,
                'editor_id' => $user['user_uid'],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        foreach ($data as $key => $value) {
            if ($value['parent_id']) {
                $found = array_filter($data, function ($element) use ($value) {
                    return $element['old_id'] === $value['parent_id'];
                });
                if (count($found) > 0) {
                    $data[$key]['parent_id'] = $found[0]['id'];
                }
            }
        }
        foreach ($data as $key => $value) {
            unset($data[$key]['old_id']);
        }
        $ok = Task::insert($data);
        if ($ok) {
            return $this->ok('ok');
        } else {
            return $this->error('error', 200, 200);
        }
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
    public function update(Request $request, Task $task)
    {
        //
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
}
