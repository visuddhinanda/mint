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
        Mq::worker($exchange, $queue, function ($message) use ($queue) {
            Log::debug('ai translate start', ['message' => $message]);
            //写入 model log
            $modelLog = new ModelLog();
            $modelLog->uid = Str::uuid();

            $param = [
                "model" => $message->model->model,
                "messages" => [
                    ["role" => "system", "content" => $message->model->system_prompt],
                    ["role" => "user", "content" => $message->prompt],
                ],
                'prompt' => $message->prompt,
                "temperature" => 0.7,
                "stream" => false
            ];
            Log::info($queue . ' ai request' . $message->model->url);
            Log::info($queue . ' model:' . $param['model']);
            Log::debug($queue . ' ai api request', [
                'url' => $message->model->url,
                'data' => $param
            ]);
            $modelLog->model_id = $message->model->uid;
            $modelLog->request_at = now();
            $modelLog->request_data = json_encode($param, JSON_UNESCAPED_UNICODE);

            $response = Http::withToken($message->model->key)
                ->retry(2, 120000)
                ->post($message->model->url, $param);
            $modelLog->request_headers = json_encode($response->handlerStats(), JSON_UNESCAPED_UNICODE);
            $modelLog->response_headers = json_encode($response->headers(), JSON_UNESCAPED_UNICODE);
            $modelLog->status = $response->status();
            $modelLog->response_data = json_encode($response->json(), JSON_UNESCAPED_UNICODE);
            if ($response->failed()) {
                $modelLog->success = false;
                $modelLog->save();
                Log::error($queue . ' http response error', ['data' => $response->json()]);
                return 1;
            }
            $modelLog->save();
            Log::debug($queue . ' log saved');
            $aiData = $response->json();
            Log::debug($queue . ' http response', ['data' => $response->json()]);
            $responseContent = $aiData['choices'][0]['message']['content'];
            if (isset($aiData['choices'][0]['message']['reasoning_content'])) {
                $reasoningContent = $aiData['choices'][0]['message']['reasoning_content'];
            }

            Log::debug($queue . ' ai content=' . $responseContent);
            if (empty($reasoningContent)) {
                Log::debug($queue . ' no reasoningContent');
            } else {
                Log::debug($queue . ' reasoning=' . $reasoningContent);
            }

            //获取model token
            Log::debug($queue . ' ai assistant token', ['user' => $message->model->uid]);
            $token = AuthController::getUserToken($message->model->uid);
            Log::debug($queue . ' ai assistant token', ['token' => $token]);

            if ($message->task->info->category === 'translate') {
                //写入句子库
                $url = config('app.url') . '/api/v2/sentence';
                $sentData = [];
                $message->sentence->content = $responseContent;
                $sentData[] = $message->sentence;
                Log::debug($queue . " upload to {$url}");
                Log::debug($queue . ' sentence update http request', ['data' => $sentData]);
                $response = Http::withToken($token)->post($url, [
                    'sentences' => $sentData,
                ]);
                Log::debug($queue . ' sentence update http response', ['data' => $response->json()]);
                if ($response->failed()) {
                    Log::error($queue . ' upload error', [
                        'data' => $response->json(),
                        'message' => $message
                    ]);
                    return 1;
                } else {
                    Log::info($queue . ' upload successful');
                }
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
                'title' => $message->task->info->title,
                'content' => $message->task->info->category,
                'content_type' => 'markdown',
                'type' => 'discussion',
            ];
            $response = Http::withToken($token)->post($url, $data);
            if ($response->failed()) {
                Log::error($queue . ' ai discussion error', ['data' => $response->json()]);
            } else {
                Log::info($queue . ' ai discussion topic successful');
            }
            $data['parent'] = $response->json()['data']['id'];
            unset($data['title']);
            $topicChildren = [];
            //提示词
            $topicChildren[] = $message->prompt;
            //任务结果
            $topicChildren[] = $responseContent;
            //推理过程写入discussion
            if (isset($reasoningContent) && !empty($reasoningContent)) {
                $topicChildren[] = $reasoningContent;
            }
            foreach ($topicChildren as  $content) {
                $data['content'] = $content;
                Log::debug($queue . ' discussion child request', ['url' => $url, 'data' => $data]);
                $response = Http::withToken($token)->post($url, $data);
                if ($response->failed()) {
                    Log::error($queue . ' discussion error', ['data' => $response->json()]);
                } else {
                    Log::info($queue . ' discussion child successful');
                }
            }

            //修改task 完成度
            $taskProgress = $message->task->progress;
            if ($taskProgress->total > 0) {
                $progress = (int)($taskProgress->current * 100 / $taskProgress->total);
            } else {
                $progress = 100;
                Log::error($queue . ' progress total is zero', ['task_id' => $message->task->info->id]);
            }
            $url = config('app.url') . '/api/v2/task/' . $message->task->info->id;
            $data = [
                'progress' => $progress,
            ];
            Log::debug($queue . ' task progress request', ['url' => $url, 'data' => $data]);
            $response = Http::withToken($token)->patch($url, $data);
            if ($response->failed()) {
                Log::error($queue . ' task progress error', ['data' => $response->json()]);
            } else {
                Log::info($queue . ' task progress successful progress=' . $response->json()['data']['progress']);
            }

            //任务完成 修改任务状态为 done
            if ($progress === 100) {
                $url = config('app.url') . '/api/v2/task-status/' . $message->task->info->id;
                $data = [
                    'status' => 'done',
                ];
                Log::debug($queue . ' task status request', ['url' => $url, 'data' => $data]);
                $response = Http::withToken($token)->patch($url, $data);
                //判断状态码
                if ($response->failed()) {
                    Log::error($queue . ' task status error', ['data' => $response->json()]);
                } else {
                    Log::info($queue . ' task status done');
                }
            }
            return 0;
        });
        return 0;
    }
}
