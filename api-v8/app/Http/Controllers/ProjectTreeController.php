<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use App\Http\Api\AuthApi;
use Illuminate\Support\Str;
use App\Http\Api\StudioApi;
use Illuminate\Support\Facades\Log;

class ProjectTreeController extends Controller
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
            Log::error('notification auth failed {request}', ['request' => $request]);
            return $this->error(__('auth.failed'), 401, 401);
        }
        $studioId = StudioApi::getIdByName($request->get('studio_name'));
        if (!ProjectController::canEdit($user['user_uid'], $studioId)) {
            return $this->error(__('auth.failed'), 403, 403);
        }
        $newData = [];
        foreach ($request->get('data') as $key => $value) {
            $newData[] = [
                'id' => Str::uuid(),
                'old_id' => $value['id'],
                'title' => $value['title'],
                'type' => 'normal',
                'parent_id' => $value['parent_id'],
                'path' => null,
                'owner_id' => $studioId,
                'editor_id' => $user['user_uid'],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        foreach ($newData as $key => $value) {
            if ($value['parent_id']) {
                $found = array_filter($newData, function ($element) use ($value) {
                    return $element['old_id'] == $value['parent_id'];
                });
                if (count($found) > 0) {
                    $newData[$key]['parent_id'] = $found[0]['id'];
                    $parentPath = $found[0]['path'] ? json_decode($found[0]['path']) : [];
                    $newData[$key]['path'] = json_encode([...$parentPath, $found[0]['id']], JSON_UNESCAPED_UNICODE);
                } else {
                    $newData[$key]['parent_id'] = null;
                }
            }
        }
        foreach ($newData as $key => $value) {
            unset($newData[$key]['old_id']);
        }
        $leafs = [];
        foreach ($newData as $key => $value) {
            $children = array_filter($newData, function ($element) use ($value) {
                return $element['parent_id'] === $value['id'];
            });
            if (count($children) === 0) {
                $leafs[] = $value['id'];
            }
        }
        $ok = Project::insert($newData);
        if ($ok) {
            return $this->ok(['leafs' => $leafs]);
        } else {
            return $this->error('error', 200, 200);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function show(Project $project)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Project $project)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function destroy(Project $project)
    {
        //
    }
}
