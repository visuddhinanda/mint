<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Api\Mq;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Http\Client\RequestException;

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
        Log::debug("mq worker {$queue} start.");
        Mq::worker($exchange, $queue, function ($messages) use ($queue) {
            Log::debug('ai translate start', ['message' => count($messages)]);
            $this->info('ai translate task start task=' . count($messages));
            if (!is_array($messages) || count($messages) === 0) {
                Log::error('message is not array');
                return 1;
            }
            //获取model token
            $first = $messages[0];
            Log::debug($queue . ' ai assistant token', ['user' => $first->model->uid]);
            $modelToken = AuthController::getUserToken($first->model->uid);
            Log::debug($queue . ' ai assistant token', ['token' => $modelToken]);

            $this->setTaskStatus($first->task->info->id, 'running', $modelToken);

            $discussionUrl = config('app.url') . '/api/v2/discussion';
            $taskDiscussionData = [
                'res_id' => $first->task->info->id,
                'res_type' => 'task',
                'title' => $first->task->info->title,
                'content' => $first->task->info->category,
                'content_type' => 'markdown',
                'type' => 'discussion',
                'notification' => false,
            ];
            $response = Http::timeout(10)->withToken($modelToken)->post($discussionUrl, $taskDiscussionData);
            if ($response->failed()) {
                Log::error($queue . ' discussion create topic error', ['data' => $response->json()]);
            } else {
                if (isset($response->json()['data']['id'])) {
                    $taskDiscussionData['parent'] = $response->json()['data']['id'];
                }
            }


            foreach ($messages as $key => $message) {
                $taskDiscussionContent = [];
                //写入 model log
                $modelLog = new ModelLog();
                $modelLog->uid = Str::uuid();

                $param = [
                    "model" => $message->model->model,
                    "messages" => [
                        ["role" => "system", "content" => $message->model->system_prompt ?? ''],
                        ["role" => "user", "content" => $message->prompt],
                    ],
                    'prompt' => $message->prompt,
                    "temperature" => 0.7,
                    "stream" => false
                ];
                Log::info($queue . ' LLM request' . $message->model->url);
                Log::info($queue . ' model:' . $param['model']);
                Log::debug($queue . ' LLM api request', [
                    'url' => $message->model->url,
                    'data' => $param
                ]);
                $modelLog->model_id = $message->model->uid;
                $modelLog->request_at = now();
                $modelLog->request_data = json_encode($param, JSON_UNESCAPED_UNICODE);
                try {
                    $response = Http::withToken($message->model->key)
                        ->timeout(300)
                        ->post($message->model->url, $param);

                    $response->throw(); // 触发异常（如果请求失败）
                    $taskDiscussionContent[] = '- LLM request successful';
                    Log::info($queue . ' LLM request successful');
                    $modelLog->request_headers = json_encode($response->handlerStats(), JSON_UNESCAPED_UNICODE);
                    $modelLog->response_headers = json_encode($response->headers(), JSON_UNESCAPED_UNICODE);
                    $modelLog->status = $response->status();
                    $modelLog->response_data = json_encode($response->json(), JSON_UNESCAPED_UNICODE);
                    /*
                if ($response->failed()) {
                    $modelLog->success = false;
                    $modelLog->save();
                    Log::error($queue . ' http response error', ['data' => $response->json()]);
                    return 1;
                }*/
                } catch (RequestException $e) {
                    Log::error($queue . ' LLM request exception: ' . $e->getMessage());
                    $failResponse = $e->response;
                    $modelLog->request_headers = json_encode($failResponse->handlerStats(), JSON_UNESCAPED_UNICODE);
                    $modelLog->response_headers = json_encode($failResponse->headers(), JSON_UNESCAPED_UNICODE);
                    $modelLog->status = $failResponse->status();
                    $modelLog->response_data = $response->body();
                    $modelLog->success = false;
                    $modelLog->save();
                    continue;
                }


                $modelLog->save();
                Log::info($queue . ' model log saved');
                $aiData = $response->json();
                Log::debug($queue . ' LLM http response', ['data' => $response->json()]);
                $responseContent = $aiData['choices'][0]['message']['content'];
                if (isset($aiData['choices'][0]['message']['reasoning_content'])) {
                    $reasoningContent = $aiData['choices'][0]['message']['reasoning_content'];
                }

                Log::debug($queue . ' LLM response content=' . $responseContent);
                if (empty($reasoningContent)) {
                    Log::debug($queue . ' no reasoningContent');
                } else {
                    Log::debug($queue . ' reasoning=' . $reasoningContent);
                }



                if ($message->task->info->category === 'translate') {
                    //写入句子库
                    $url = config('app.url') . '/api/v2/sentence';
                    $sentData = [];
                    $message->sentence->content = $responseContent;
                    $sentData[] = $message->sentence;
                    Log::info($queue . " sentence update {$url}");
                    $response = Http::timeout(10)->withToken($modelToken)->post($url, [
                        'sentences' => $sentData,
                    ]);
                    if ($response->failed()) {
                        Log::error($queue . ' sentence update failed', [
                            'url' => $url,
                            'data' => $response->json(),
                        ]);
                        continue;
                    } else {
                        $count = $response->json()['data']['count'];
                        Log::info("{$queue} sentence update {$count} successful");
                    }
                }
                if ($message->task->info->category === 'suggest') {
                    //写入pr
                    $url = config('app.url') . '/api/v2/sentpr';
                    Log::info($queue . " sentence update {$url}");
                    $response = Http::timeout(10)->withToken($modelToken)->post($url, [
                        'book' => $message->sentence->book_id,
                        'para' => $message->sentence->paragraph,
                        'begin' => $message->sentence->word_start,
                        'end' => $message->sentence->word_end,
                        'channel' => $message->sentence->channel_uid,
                        'text' => $responseContent,
                        'notification' => false,
                        'webhook' => false,
                    ]);
                    if ($response->failed()) {
                        Log::error($queue . ' sentence update failed', [
                            'url' => $url,
                            'data' => $response->json(),
                        ]);
                        continue;
                    } else {
                        if ($response->json()['ok']) {
                            Log::info("{$queue} sentence suggest update successful");
                        } else {
                            Log::error("{$queue} sentence suggest update failed", [
                                'url' => $url,
                                'data' => $response->json(),
                            ]);
                        }
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
                    'notification' => false,
                ];
                $response = Http::timeout(10)->withToken($modelToken)->post($url, $data);
                if ($response->failed()) {
                    Log::error($queue . ' discussion create topic error', ['data' => $response->json()]);
                } else {
                    if (isset($response->json()['data']['id'])) {
                        Log::info($queue . ' discussion create topic successful');
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
                            $response = Http::timeout(10)->withToken($modelToken)->post($url, $data);
                            if ($response->failed()) {
                                Log::error($queue . ' discussion error', ['data' => $response->json()]);
                            } else {
                                Log::info($queue . ' discussion child successful');
                            }
                        }
                    } else {
                        Log::error($queue . ' discussion create topic response is null');
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
                $response = Http::timeout(10)->withToken($modelToken)->patch($url, $data);
                if ($response->failed()) {
                    Log::error($queue . ' task progress error', ['data' => $response->json()]);
                } else {
                    $taskDiscussionContent[] = "- progress=" . $response->json()['data']['progress'];
                    Log::info($queue . ' task progress successful progress=' . $response->json()['data']['progress']);
                }

                if (isset($taskDiscussionData['parent'])) {
                    unset($taskDiscussionData['title']);
                    $taskDiscussionData['content'] = implode('\n', $taskDiscussionContent);
                    Log::debug($queue . ' task discussion child request', ['url' => $discussionUrl, 'data' => $data]);
                    $response = Http::timeout(10)->withToken($modelToken)->post($discussionUrl, $taskDiscussionData);
                    if ($response->failed()) {
                        Log::error($queue . ' task discussion error', ['data' => $response->json()]);
                    } else {
                        Log::info($queue . ' task discussion child successful');
                    }
                } else {
                    Log::error('no task discussion root');
                }

                //任务完成 修改任务状态为 done
                if ($progress === 100) {
                    $this->setTaskStatus($message->task->info->id, 'done', $modelToken);
                }
            }
            $this->info('ai translate task complete');
            return 0;
        });
        return 0;
    }
    private function setTaskStatus($taskId, $status, $token)
    {
        $url = config('app.url') . '/api/v2/task-status/' . $taskId;
        $data = [
            'status' => 'done',
        ];
        Log::debug('ai_translate task status request', ['url' => $url, 'data' => $data]);
        $response = Http::timeout(10)->withToken($token)->patch($url, $data);
        //判断状态码
        if ($response->failed()) {
            Log::error('ai_translate task status error', ['data' => $response->json()]);
        } else {
            Log::info('ai_translate task status done');
        }
    }
}
