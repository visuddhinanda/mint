<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Api\DictApi;
use App\Models\UserDict;
use App\Models\WordIndex;

class UpgradeDictSysPreference extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     * php artisan upgrade:dict.sys.preference
     */
    protected $signature = 'upgrade:dict.sys.preference';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'upgrade dict system preference';

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
        if(\App\Tools\Tools::isStop()){
            return 0;
        }
        $this->info("start");
        $dictList = [
            'community_extract',
            'robot_compound',
            'system_regular',
            'system_preference',
        ];
        $dict_id = array();
        foreach ($dictList as $key => $value) {
            $dict_id[$value] = DictApi::getSysDict($value);
            if(!$dict_id[$value]){
                $this->error("没有找到 {$value} 字典");
                return 1;
            }else{
                $this->info("{$value} :{$dict_id[$value]}");
            }
        }

        //搜索顺序
        $order = [
            '4d3a0d92-0adc-4052-80f5-512a2603d0e8',/* system irregular */
            $dict_id['community_extract'],/* 社区字典*/
            $dict_id['robot_compound'],
            $dict_id['system_regular'],
        ];
        $words = WordIndex::orderBy('count', 'desc')->cursor();
        $rows = 0;
        $found = 0;
        foreach ($words as $key => $word) {
            if (preg_match('/\d/', $word->word)) {
                continue;
            }
            $rows++;
            $preference = null;
            foreach ($order as $key => $dict) {
                $preference = UserDict::where('word', $word->word)
                                ->where('dict_id', $dict)
                                ->whereNotNull('factors')
                                ->where('factors','<>','')
                                ->orderBy('confidence', 'desc')
                                ->first();                # code...
                if($preference){
                    break;
                }
            }
            if($preference){
                $userDict = UserDict::firstOrNew([
                    'word'=>$word->word,
                    'dict_id'=>$dict_id['system_preference']
                ],
                [
                    'id' => app('snowflake')->id(),
                    'source' => '_ROBOT_',
                    'create_time'=>(int)(microtime(true)*1000)
                ]);
                $userDict->factors = $preference->factors;
                $userDict->parent = $preference->parent;
                $userDict->confidence = $preference->confidence;
                $userDict->language = 'cm';
                $userDict->creator_id = 1;
                $userDict->save();
                $found++;
            }
            if($rows % 100 == 0){
                $output = "[{$rows}] {$word->word} found:{$found}";
                $this->info($output);
                $found=0;
            }
        }
        return 0;
    }
}
