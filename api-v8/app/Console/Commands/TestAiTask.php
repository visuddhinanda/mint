<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Api\AiTaskPrepare;
use App\Services\AiTranslateService;

class TestAiTask extends Command
{
    /**
     * The name and signature of the console command.
     * php artisan test:ai.task c77af42f-ffb5-48ae-af71-4c32e1c30dab
     * php artisan test:ai.task f42fa690-c590-400f-9de9-fbc81e838a5a
     * @var string
     */
    protected $signature = 'test:ai.task {id} {--test}';

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
    public function handle(AiTranslateService $ai)
    {
        $taskId = $this->argument('id');

        $params = $ai->makeByTask($taskId, !$this->option('test'));
        var_dump($params);
        var_dump($this->option('test'));
        $this->info('total:' . count($params));
        return 0;
    }
}
