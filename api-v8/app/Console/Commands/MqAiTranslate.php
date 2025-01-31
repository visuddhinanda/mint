<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Api\Mq;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use App\Http\Api\UserApi;
use App\Http\Controllers\AuthController;


class MqAiTranslate extends Command
{
    /**
     * The name and signature of the console command.
     * php artisan mq:ai.translate
     * @var string
     */
    protected $signature = 'mq:ai.translate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        if (\App\Tools\Tools::isStop()) {
            return 0;
        }
        $exchange = 'router';
        $queue = 'ai_translate';
        $this->info(" [*] Waiting for {$queue}. To exit press CTRL+C");
        Log::debug("mq:progress start.");
        Mq::worker($exchange, $queue, function ($message) {

            $param = [
                "model" => $message->model->model,
                "messages" => [
                    ["role" => "system", "content" => "你是翻译人工智能助手.bhikkhu 为专有名词，不可翻译成其他语言。"],
                    ["role" => "user", "content" => $message->content],
                ],
                "temperature" => 0.3,
                "stream" => false
            ];
            $response = Http::withToken($message->model->token)
                ->retry(2, 1000)
                ->post($message->model->url, $param);
            if ($response->failed()) {
                $this->error('http response error' . $response->json('message'));
                Log::error('http response error', ['data' => $response->json()]);
                return 1;
            }
            $aiData = $response->json();
            Log::debug('http response', ['data' => $response->json()]);

            //获取ai帐号的用户token
            $user = UserApi::getByName(config('mint.ai.assistant'));
            $token = AuthController::getUserToken($user['id']);
            Log::debug('ai assistant token', [
                'user' => $user,
                'token' => $token
            ]);

            //写入句子库
            $url = '/v2/sentence';
            $sentData = [];
            $sentData[] = $message->sentence;
            $response = Http::withToken($token)->post($url, [
                'sentences' => $sentData,
            ]);
            Log::debug('sentence update http response', ['data' => $response->json()]);
            //写入task log
            //修改task 完成度

            return 0;
        });
        return 0;
    }
}
