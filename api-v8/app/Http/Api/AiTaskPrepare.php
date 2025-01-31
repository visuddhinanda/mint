<?php

namespace App\Http\Api;

use App\Models\Task;
use App\Models\PaliText;
use App\Models\PaliSentence;
use App\Models\AiModel;
use App\Http\Api\Mq;

use Illuminate\Support\Facades\Log;

class AiTaskPrepare
{
    public static function translate(string $taskId)
    {
        $task = Task::findOrFail($taskId);
        $description = $task->description;
        $rows = explode("\n", $description);
        $params = [];
        foreach ($rows as $key => $row) {
            if (strpos($row, '=') !== false) {
                $param = explode('=', trim($row, '|'));
                $params[$param[0]] = $param[1];
            }
        }
        if (!isset($params['type']) || !isset($params['book']) || !isset($params['para'])) {
            return false;
        }

        //get sentences in article
        $sentences = array();
        $totalLen = 0;
        switch ($params['type']) {
            case 'sentence':
                $sentences[] = explode('-', $params['id']);
                break;
            case 'paragraph':
                $sent = PaliSentence::where('book', $params['book'])
                    ->where('paragraph', $params['para'])->orderBy('word_begin')->get();
                foreach ($sent as $key => $value) {
                    $sentences[] = [
                        $value->book,
                        $value->paragraph,
                        $value->word_begin,
                        $value->word_end,
                        $value->length
                    ];
                    $totalLen += $value->length;
                }
                break;
            case 'chapter':
                $chapterLen = PaliText::where('book', $params['book'])
                    ->where('paragraph', $params['para'])->value('chapter_len');
                $sent = PaliSentence::where('book', $params['book'])
                    ->whereBetween('paragraph', [$params['para'], $params['para'] + $chapterLen - 1])
                    ->orderBy('paragraph')
                    ->orderBy('word_begin')->get();
                foreach ($sent as $key => $value) {
                    $sentences[] = [
                        $value->book,
                        $value->paragraph,
                        $value->word_begin,
                        $value->word_end,
                        $value->length
                    ];
                    $totalLen += $value->length;
                }
                break;
            default:
                return false;
                break;
        }

        //render prompt
        $mdRender = new MdRender([
            'format' => 'prompt',
            'footnote' => false,
            'paragraph' => false,
        ]);
        $m = new \Mustache_Engine(array(
            'entity_flags' => ENT_QUOTES,
            'escape' => function ($value) {
                return $value;
            }
        ));

        # ai model
        if (!isset($params['{{ai|model'])) {
            return false;
        }
        $modelId = trim($params['{{ai|model'], '}');
        $aiModel = AiModel::findOne($modelId);
        $aiPrompts = [];
        $sumLen = 0;
        foreach ($sentences as $key => $sentence) {
            $sumLen += $sentence[4];
            $sid = implode('-', $sentence);
            Log::debug($sid);
            $data['pali'] = '{{' . $sid . '}}';
            if (isset($params['nissaya'])) {
                $data['nissaya'] = '{{' . $sid . '@' . $params['nissaya'] . '}}';
            }
            $content = $m->render($description, $data);
            $prompt = $mdRender->convert($content, []);
            $aiPrompts[] = $prompt;
            //gen mq
            $aiMqData = [
                'model' => $aiModel,
                'task' => [
                    'task_id' => $taskId,
                    'progress' => (int)($sumLen * 100 / $totalLen),
                ],
                'sentence' => [
                    'book_id' => $sentence[0],
                    'paragraph' => $sentence[1],
                    'word_start' => $sentence[2],
                    'word_end' => $sentence[3],
                    'channel_uid' => $params['channel'],
                    'content' => $prompt,
                    'content_type' => 'markdown',
                    'access_token' => $params['token'],
                ],
            ];
            Mq::publish('ai_translate', $aiMqData);
        }

        return $aiPrompts;
    }
}
