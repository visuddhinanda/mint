<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Api\AiTaskPrepare;

class TestAiTask extends Command
{
    /**
     * The name and signature of the console command.
     * php artisan test:ai.task c77af42f-ffb5-48ae-af71-4c32e1c30dab
     * php artisan test:ai.task 81bd0b28-c7ea-4fc5-902d-0b188ba79d35
     * @var string
     */
    protected $signature = 'test:ai.task {id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'test ai task';

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
        $taskId = $this->argument('id');
        $params = AiTaskPrepare::translate($taskId);
        var_dump($params);
        return 0;
    }
}
