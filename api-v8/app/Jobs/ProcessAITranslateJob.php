<?php

namespace App\Jobs;

use App\Services\AiTranslateService;
use Illuminate\Support\Facades\Log;

class ProcessAITranslateJob extends BaseRabbitMQJob
{
    protected function processMessage(array $messageData)
    {
        $startTime = microtime(true);
        try {
            $translateService = app(AiTranslateService::class);
            return $translateService->processTranslate($messageData);
        } catch (\Exception $e) {
            // 记录失败指标

            throw $e;
        } finally {
            // 记录处理时间
            $processingTime = microtime(true) - $startTime;
            Log::info('翻译处理耗时', ['time' => $processingTime]);
        }
    }

    protected function handleFinalFailure(array $messageData, \Exception $exception)
    {
        parent::handleFinalFailure($messageData, $exception);

        // 订单特定的失败处理
        $orderService = app(AiTranslateService::class);
        $orderService->handleFailedTranslate($messageData, $exception);
    }
}
