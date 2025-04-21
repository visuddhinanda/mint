<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Http\Client\ConnectionException;

class ChatGPTService
{
    protected int $retries = 3;
    protected int $delayMs = 2000;
    protected string $model = 'gpt-4-1106-preview';
    protected string $apiUrl = 'https://api.openai.com/v1/chat/completions';
    protected string $apiKey;
    protected string $systemPrompt = '你是一个有帮助的助手。';
    protected float $temperature = 0.7;

    public static function withRetry(int $retries = 3, int $delayMs = 2000): static
    {
        return (new static())->setRetry($retries, $delayMs);
    }

    public function setRetry(int $retries, int $delayMs): static
    {
        $this->retries = $retries;
        $this->delayMs = $delayMs;
        return $this;
    }

    public function setModel(string $model): static
    {
        $this->model = $model;
        return $this;
    }

    public function setApiUrl(string $url): static
    {
        $this->apiUrl = $url;
        return $this;
    }

    public function setApiKey(string $key): static
    {
        $this->apiKey = $key;
        return $this;
    }

    public function setSystemPrompt(string $prompt): static
    {
        $this->systemPrompt = $prompt;
        return $this;
    }

    public function setTemperature(float $temperature): static
    {
        $this->temperature = $temperature;
        return $this;
    }

    public function ask(string $question): string|array
    {
        for ($attempt = 1; $attempt <= $this->retries; $attempt++) {
            try {
                $response = Http::withToken($this->apiKey)
                    ->timeout(300)
                    ->retry(3, 2000, function ($exception, $request) {
                        // 仅当是连接/响应超时才重试
                        return $exception instanceof ConnectionException;
                    })
                    ->post($this->apiUrl, [
                        'model' => $this->model,
                        'messages' => [
                            ['role' => 'system', 'content' => $this->systemPrompt],
                            ['role' => 'user', 'content' => $question],
                        ],
                        'temperature' => $this->temperature,
                    ]);

                $status = $response->status();
                $body = $response->json();

                // ✅ 判断 429 限流重试
                if ($status === 429) {
                    $retryAfter = $response->header('Retry-After') ?? 10;
                    Log::warning("第 {$attempt} 次请求被限流（429），等待 {$retryAfter} 秒后重试...");
                    sleep((int) $retryAfter);
                    continue;
                }

                // ✅ 判断是否 GPT 返回 timeout 错误
                $isTimeout = in_array($status, [408, 504]) ||
                    (isset($body['error']['message']) && Str::contains(strtolower($body['error']['message']), 'time'));

                if ($isTimeout) {
                    Log::warning("第 {$attempt} 次 GPT 响应超时，准备重试...");
                    usleep($this->delayMs * 1000);
                    continue;
                }

                if ($response->successful()) {
                    return $body['choices'][0]['message']['content'] ?? '无内容返回';
                }

                return [
                    'error' => $body['error']['message'] ?? '请求失败',
                    'status' => $status
                ];
            } catch (ConnectionException $e) {
                Log::warning("第 {$attempt} 次连接超时：{$e->getMessage()}，准备重试...");
                usleep($this->delayMs * 1000);
                continue;
            } catch (\Exception $e) {
                Log::error("GPT 请求异常：" . $e->getMessage());
                return [
                    'error' => $e->getMessage(),
                    'status' => 500
                ];
            }
        }

        return [
            'error' => '请求多次失败或超时，请稍后再试。',
            'status' => 504
        ];
    }
}

/**
 namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;

class ChatGPTController extends Controller
{
    public function ask(Request $request)
    {
        $question = $request->input('question', 'Hello, who are you?');

        try {
            $response = Http::withToken(env('OPENAI_API_KEY'))
                ->timeout(10) // 请求超时时间（秒）
                ->retry(3, 2000, function ($exception, $request) {
                    // 仅当是连接/响应超时才重试
                    return $exception instanceof ConnectionException;
                })
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => 'gpt-4-1106-preview',
                    'messages' => [
                        ['role' => 'system', 'content' => '你是一个有帮助的助手。'],
                        ['role' => 'user', 'content' => $question],
                    ],
                    'temperature' => 0.7,
                ]);

            $data = $response->json();

            return response()->json([
                'reply' => $data['choices'][0]['message']['content'] ?? '没有返回内容。',
            ]);

        } catch (ConnectionException $e) {
            // 所有重试都失败
            Log::error('请求超时：' . $e->getMessage());
            return response()->json(['error' => '请求超时，请稍后再试。'], 504);
        } catch (RequestException $e) {
            // 非超时类的请求异常（如 400/500）
            Log::error('请求失败：' . $e->getMessage());
            return response()->json(['error' => '请求失败：' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            // 其他异常
            Log::error('未知错误：' . $e->getMessage());
            return response()->json(['error' => '发生未知错误。'], 500);
        }
    }
}

 */
