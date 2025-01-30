<?php

namespace App\Http\Api;

use App\Models\Task;
use App\Models\PaliText;
use App\Models\PaliSentence;

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
                $param = explode('=', $row);
                $params[$param[0]] = $param[1];
            }
        }
        if (!isset($param['type']) || !isset($param['book']) || !isset($param['para'])) {
            return false;
        }

        //get sentences in article
        $sentences = array();
        $totalLen = 0;
        switch ($param['type']) {
            case 'sentence':
                $sentences[] = explode('-', $param['id']);
                break;
            case 'paragraph':
                $sent = PaliSentence::where('book', $param['book'])
                    ->where('paragraph', $param['para'])->orderBy('word_begin')->get();
                foreach ($sent as $key => $value) {
                    $sentences[] = [$param['book'], $param['para'], $value->word_begin, $value->word_end];
                }
                break;
            case 'chapter':
                $chapterLen = PaliText::where('book', $param['book'])
                    ->where('paragraph', $param['para'])->value('chapter_len');
                $sent = PaliSentence::where('book', $param['book'])
                    ->whereBetween('paragraph', [$param['para'], $param['para'] + $chapterLen - 1])
                    ->orderBy('paragraph')
                    ->orderBy('word_begin')->get();
                foreach ($sent as $key => $value) {
                    $sentences[] = [$param['book'], $param['para'], $value->word_begin, $value->word_end];
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

        $params = [];
        foreach ($sentences as $key => $sentence) {
            $sid = implode('-', $sentence);
            $data['pali'] = '{{' . $sid . '}}';
            if (isset($param['nissaya'])) {
                $data['nissaya'] = '{{' . $sid . '@' . $param['nissaya'] . '}}';
            }
            $content = $m->render($description, $data);
            $prompt = $mdRender->convert($content, []);
            $params[] = $prompt;
            //gen mq
        }

        return $params;
    }
}
