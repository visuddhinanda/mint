<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Api\UserApi;
use App\Http\Api\StudioApi;
use App\Http\Api\TaskApi;
use App\Http\Api\ProjectApi;
use App\Http\Api\MdRender;
use App\Models\TaskAssignee;

use Illuminate\Support\Str;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        /*
  id: string;
  title: string;
  description?: string | null;
  assignees?: IUser[] | null;
  assignees_id?: string[] | null;
  parent?: ITaskData | null;
  parent_id?: string | null;
  roles?: string[] | null;
  executor?: IUser | null;
  executor_id?: string | null;
  executor_relation_task?: ITaskData | null;
  executor_relation_task_id?: string | null;
  pre_task?: ITaskData | null;
  pre_task_id?: string | null;
  is_milestone: boolean;
  project?: IProject|null;
  project_id?: string | null;
  owner?: IStudio;
  owner_id?: string | null;
  editor?: IUser;
  editor_id?: string | null;
  status?: TTaskStatus;
  created_at?: string;
  updated_at?: string;
  started_at?: string | null;
  finished_at?: string | null;
         */
        $htmlRender = new MdRender([
            'mode' => 'read',
            'format'=> 'react',
            'footnote' => true,
            'origin' => $request->get('origin',true),
            'paragraph' => $request->get('paragraph',false),
        ]);
        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'parent_id' => $this->parent_id,
            'parent' => TaskApi::getById($this->parent_id),
            'roles' => $this->roles,
            'executor_id' => $this->executor_id,
            'executor_relation_task_id' => $this->executor_relation_task_id,
            'executor_relation_task' => TaskApi::getById($this->executor_relation_task_id),
            'pre_task' => TaskApi::getPreTasks($this->id),
            'next_task' => TaskApi::getNextTasks($this->id),
            'is_milestone' => $this->is_milestone,
            'project_id' => $this->project_id,
            'project' => ProjectApi::getById($this->project_id),
            'owner_id' => $this->owner_id,
            "owner"=> StudioApi::getById($this->owner_id),
            'editor_id' => $this->editor_id,
            "editor"=> UserApi::getByUuid($this->editor_id),
            'order' => $this->order,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'started_at' => $this->started_at,
            'finished_at' => $this->finished_at,
        ];
        $assignees = TaskAssignee::where('task_id',$this->id)->select('assignee_id')->get();
        if(count($assignees)>0){
            $assignees_id = [];
            foreach ($assignees as $key => $value) {
                $assignees_id[] = $value->assignee_id;
            }
            $data['assignees_id'] = $assignees_id;
            $data['assignees'] = UserApi::getListByUuid($assignees_id);
        }
        if(!empty($this->description)){
            $data["html"] = $htmlRender->convert($this->description,[]);
        }

        if(Str::isUuid($this->executor_id)){
            $data["executor"] = UserApi::getByUuid($this->executor_id);
        }
        return $data;
    }
}
