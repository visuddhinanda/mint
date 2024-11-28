<?php
namespace App\Http\Api;

use App\Models\Task;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\App;

class TaskApi{
    public static function getById($id){
        if(!$id){
            return null;
        };
        $task = Task::where('id',$id)->first();
        if($task){
            return [
                'id'=>$id,
                'title'=>$task->title,
                'description'=>$task->description,
            ];
        }else{
            return null;
        }
    }

    public static function getListByIds($ids){
        if(!$ids){
            return null;
        };
        $tasks = Task::whereIn('id',$ids)->get();
        $output = array();
        foreach ($ids as $key => $id) {
            foreach ($tasks as $task) {
                if($task->id === $id){
                    $output[] = [
                        'id'=>$id,
                        'title'=>$task->title,
                        'description'=>$task->description,
                    ];
                    continue;
                };
            }
        }
        return $output;
    }
}
