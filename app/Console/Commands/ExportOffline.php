<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ExportOffline extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'export:offline';

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
        //导出channel
        $this->call('export:channel');
        //导出章节索引
        $this->call('export:chapter.index');
        //导出译文
        $this->call('export:sentence');
        //导出原文
        $this->call('export:sentence',['channel'=>'28f2e33a-794f-11ed-9481-1395f6ece2de']);
        return 0;
    }
}