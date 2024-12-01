<?php
namespace App\Http\Api;

use App\Models\Project;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\App;

class ProjectApi{
    public static function getById($id){
        if(!$id){
            return null;
        };
        $project = Project::where('id',$id)->first();
        if($project){
            return [
                'id'=>$id,
                'title'=>$project->title,
                'type'=>$project->type,
                'description'=>$project->description,
            ];
        }else{
            return null;
        }
    }

    public static function getListByIds($ids){
        if(!$ids){
            return null;
        };
        $projects = Project::whereIn('id',$ids)->get();
        $output = array();
        foreach ($ids as $key => $id) {
            foreach ($projects as $project) {
                if($project->id === $id){
                    $output[] = [
                        'id'=>$id,
                        'title'=>$project->title,
                        'type'=>$project->type,
                        'description'=>$project->description,
                    ];
                    continue;
                };
            }
        }
        return $output;
    }
}
