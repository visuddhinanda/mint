<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Api\DictApi;

class ExportAiPaliWordToken extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'export:ai.pali.word.token';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'export ai pali word token';

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
        $this->info('export ai pali word token');
        $dict_id = DictApi::getSysDict('robot_compound');
        if(!$dict_id){
            $this->error('没有找到 robot_compound 字典');
            return 1;
        }
        return 0;
    }
}
