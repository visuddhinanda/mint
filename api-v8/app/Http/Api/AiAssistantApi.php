<?php

namespace App\Http\Api;

use App\Models\AiModel;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\App;

class AiAssistantApi
{
    public static function getByUuid($id)
    {
        $user = AiModel::where('uid', $id)->first();
        return self::userInfo($user);
    }
    public static function userInfo($user)
    {
        if (!$user) {
            Log::error('$user=null;');
            return [
                'id' => 0,
                'nickName' => 'unknown',
                'userName' => 'unknown',
                'realName' => 'unknown',
                'avatar' => '',
            ];
        }
        $data = [
            'id' => $user->uid,
            'nickName' => $user->name,
            'userName' => $user->real_name,
            'realName' => $user->real_name,
            'roles' => ['ai'],
            'sn' => 0,
        ];

        if ($user->avatar) {
            $img = str_replace('.jpg', '_s.jpg', $user->avatar);
            if (App::environment('local')) {
                $data['avatar'] = Storage::url($img);
            } else {
                $data['avatar'] = Storage::temporaryUrl($img, now()->addDays(6));
            }
        } else {
            $data['avatar'] = config('app.url') . '/assets/images/avatar/ai-assistant.png';
        }
        return $data;
    }
}
