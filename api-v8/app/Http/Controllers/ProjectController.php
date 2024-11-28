<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use App\Http\Api\AuthApi;
use App\Http\Api\StudioApi;
use App\Http\Resources\ProjectResource;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = AuthApi::current($request);
        if(!$user){
            Log::error('notification auth failed {request}',['request'=>$request]);
            return $this->error(__('auth.failed'),401,401);
        }
        switch ($request->get('view')) {
            case 'studio':
                $table = Project::where('owner_id',$user['user_uid'])
                            ->whereNull('parent_id');
                if($request->get('type','normal') !== 'all'){
                    $table = $table->where('type',$request->get('type','normal'));
                }
                break;
            case 'project-tree':
                $table = Project::where('id',$request->get('project_id'))
                                ->orWhereJsonContains('path',$request->get('project_id'));
                break;
            default:
                # code...
                break;
        }

        if($request->has('keyword')){
            $table = $table->where('title','like','%'.$request->get('keyword').'%');
        }
        if($request->has('status')){
            $table = $table->whereIn('status',explode(',',$request->get('status')) );
        }
        $count = $table->count();

        $sql = $table->toSql();
        Log::debug('sql',['sql'=>$sql]);

        $table = $table->orderBy($request->get('order','created_at'),$request->get('dir','desc'));

        $table = $table->skip($request->get("offset",0))
                    ->take($request->get('limit',10000));

        $result = $table->get();

        return $this->ok(
            [
            "rows" => ProjectResource::collection($result),
            "count" => $count,
            ]);
    }

    public function canEdit($user_uid,$studio_uid){
        return $user_uid == $studio_uid;
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
        if(!$user){
            return $this->error(__('auth.failed'),401,401);
        }
        $studioId = StudioApi::getIdByName($request->get('studio_name'));
        if(!$this->canEdit($user['user_uid'],$studioId)){
            return $this->error(__('auth.failed'),403,403);
        }
        $new = Project::firstOrNew(['id'=>$request->get('id')]);
        if(Str::isUuid($request->get('id'))){
            $new->id = $request->get('id');
        }else{
            $new->id =  Str::uuid();
        }
        $new->title = $request->get('title');
        $new->description = $request->get('description');
        $new->parent_id = $request->get('parent_id');
        $new->editor_id = $user['user_uid'];
        $new->owner_id = $studioId;
        $new->type = $request->get('type','normal');

        if(Str::isUuid($request->get('parent_id'))){
            $parentPath = Project::where('id',$request->get('parent_id'))->value('path');
            $parentPath = json_decode($parentPath);
            if(!is_array($parentPath)){
                $parentPath = array();
            }
            array_push($parentPath,$new->parent_id);
            $new->path = json_encode($parentPath,JSON_UNESCAPED_UNICODE);
        }
        $new->save();

        return $this->ok(new ProjectResource($new));
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
        return $this->ok(new ProjectResource($project));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function edit(Project $project)
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
