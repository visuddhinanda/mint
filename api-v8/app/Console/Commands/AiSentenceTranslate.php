<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Sentence;
use App\Models\PaliSentence;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class AiSentenceTranslate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = <<<command
    ai:sentence.translate 
    {--api=  : ai engin url} 
    {--model=  : ai model } 
    {--sid=  : 句子编号 } 
    {--nissaya=  : nissaya channel } 
    {--result=  : result channel } 
    command;

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '使用LLM 和nissaya数据翻译句子';

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
        //获取巴利句子
        $sid = explode('-', $this->option('sid'));
        $pali = PaliSentence::where('book', $sid[0])
            ->where('paragraph', $sid[1])
            ->where('word_begin', $sid[2])
            ->where('word_end', $sid[3])
            ->value('text');
        //获取nissaya
        $nissaya = Sentence::where('channel_uid', $this->option('nissaya'))
            ->where('book_id', $sid[0])
            ->where('paragraph', $sid[1])
            ->where('word_start', $sid[2])
            ->where('word_end', $sid[3])
            ->value('content');
        //获取ai结果
        $api = $this->getEngin($this->option('api'));
        if (!$api) {
            $this->error('ai translate no api');
            return 1;
        }
        $json = $this->fetch($api, $pali, $nissaya);
        $this->info('ai translate', ['json' => $json]);
        //写入
        return 0;
    }

    private function getEngin($engin)
    {
        $api = config('mint.ai.accounts');
        $selected = array_filter($api, function ($value) use ($engin) {
            return $value['name'] === $engin;
        });
        if (!is_array($selected) || count($selected) === 0) {
            return null;
        }
        return $selected[0];
    }

    private function fetch($api, $origin,  $nissaya = null)
    {
        $prompt = '翻译上面的巴利文为中文';
        if ($nissaya) {
            $prompt = '根据下面的解释，' . $prompt;
        }
        $message = "{$origin}\n\n{$prompt}\n\n{$nissaya}";

        $url = $api['api_url'];
        $param = [
            "model" => $api['model'],
            "messages" => [
                ["role" => "system", "content" => "你是翻译人工智能助手，bhikkhu 为专有名词，不可翻译成其他语言。"],
                ["role" => "user", "content" => $message],
            ],
            "temperature" => 0.3,
        ];
        $response = Http::withToken($api['token'])
            ->post($url, $param);
        if ($response->failed()) {
            $this->error('http request error' . $response->json('message'));
            Log::error('http request error', ['data' => $response->json()]);
            return null;
        } else {
            return $response->json();
        }
    }
}
