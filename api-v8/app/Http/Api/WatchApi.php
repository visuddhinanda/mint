<?php
namespace App\Http\Api;

use App\Models\Like;

class WatchApi{
    public static function change($resId,$from,$message){
        //发送站内信
        $watches = Like::where('type','watch')
                    ->where('target_id',$resId)
                    ->get();
        $notifications = [];
        foreach ($watches as $key => $watch) {
            $notifications[] = [
                'from' => $from,
                'to' => $watch->user_id,
                'url' => $row['url'],
                'content' => $message,
                'res_type' => $watch->res_type,
                'res_id' => $watch['res_id'],
            ];

        }
    }
}
