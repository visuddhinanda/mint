<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Api\Mq;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

use App\Http\Controllers\AuthController;
use App\Models\Sentence;
use App\Models\ModelLog;

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
            Log::debug('start', ['message' => $message]);
            //写入 model log
            $modelLog = new ModelLog();
            $modelLog->uid = Str::uuid();

            $param = [
                "model" => $message->model->model,
                "messages" => [
                    ["role" => "system", "content" => "你是翻译人工智能助手."],
                    ["role" => "user", "content" => $message->prompt],
                ],
                "temperature" => 0.7,
                "stream" => false
            ];
            $this->info('ai request' . $message->model->url);
            Log::debug('ai api request', [
                'url' => $message->model->url,
                'data' => $param
            ]);
            $modelLog->model_id = $message->model->uid;
            $modelLog->request_url = $message->model->url;
            $modelLog->request_at = now();
            $modelLog->request_data = json_encode($param, JSON_UNESCAPED_UNICODE);
            $response = Http::withToken($message->model->key)
                ->retry(1, 2000)
                ->post($message->model->url, $param);
            $modelLog->status = $response->status();
            $modelLog->response_data = json_encode($response->json(), JSON_UNESCAPED_UNICODE);
            if ($response->failed()) {
                $modelLog->success = false;
                $modelLog->save();
                $this->error('http response error' . $response->json('message'));
                Log::error('http response error', ['data' => $response->json()]);
                return 1;
            }
            $modelLog->save();
            $this->info('log saved');
            $aiData = $response->json();
            Log::debug('http response', ['data' => $response->json()]);
            $responseContent = $aiData['choices'][0]['message']['content'];
            $this->info('ai content' . $responseContent);

            //获取model token
            Log::debug('ai assistant token', ['user' => $message->model->uid]);
            $token = AuthController::getUserToken($message->model->uid);
            Log::debug('ai assistant token', ['token' => $token]);

            //写入句子库
            $url = config('app.url') . '/api/v2/sentence';
            $sentData = [];
            $message->sentence->content = $responseContent;
            $sentData[] = $message->sentence;
            $this->info("upload to {$url}");
            Log::debug('sentence update http request', ['data' => $sentData]);
            $response = Http::withToken($token)->post($url, [
                'sentences' => $sentData,
            ]);
            Log::debug('sentence update http response', ['data' => $response->json()]);
            if ($response->failed()) {
                $this->error('upload error' . $response->json('message'));
                Log::error('upload error', ['data' => $response->json()]);
            } else {
                $this->info('upload successful');
            }
            //写入discussion
            #获取句子id
            $sUid = Sentence::where('book_id', $message->sentence->book_id)
                ->where('paragraph', $message->sentence->paragraph)
                ->where('word_start', $message->sentence->word_start)
                ->where('word_end', $message->sentence->word_end)
                ->where('channel_uid', $message->sentence->channel_uid)
                ->value('uid');
            $url = config('app.url') . '/api/v2/discussion';
            $data = [
                'res_id' => $sUid,
                'res_type' => 'sentence',
                'title' => 'ai 译文',
                'content' => $responseContent,
                'content_type' => 'markdown',
                'type' => 'discussion',
            ];
            $response = Http::withToken($token)->post($url, $data);
            if ($response->failed()) {
                $this->error('discussion error' . $response->json('message'));
                Log::error('discussion error', ['data' => $response->json()]);
            } else {
                $this->info('discussion successful');
            }
            //修改task 完成度
            $taskProgress = $message->task->progress;
            $progress = (int)($taskProgress->current * 100 / $taskProgress->total);
            $url = config('app.url') . '/api/v2/task/' . $message->task->task_id;
            $data = [
                'progress' => $progress,
            ];
            Log::debug('task progress request', ['url' => $url, 'data' => $data]);
            $response = Http::withToken($token)->patch($url, $data);
            if ($response->failed()) {
                $this->error('task progress error' . $response->json('message'));
                Log::error('task progress error', ['data' => $response->json()]);
            } else {
                $this->info('task progress successful progress=' . $response->json()['data']['progress']);
            }

            //完成 修改状态
            if ($taskProgress->current === $taskProgress->total) {
                $url = config('app.url') . '/api/v2/task-status/' . $message->task->task_id;
                $data = [
                    'status' => 'done',
                ];
                Log::debug('task status request', ['url' => $url, 'data' => $data]);
                $response = Http::withToken($token)->patch($url, $data);
                //判断状态码
                if ($response->failed()) {
                    $this->error('task status error' . $response->json('message'));
                    Log::error('task status error', ['data' => $response->json()]);
                } else {
                    $this->info('task status successful ');
                }
            }


            sleep(2);
            return 0;
        });
        return 0;
    }
}
