<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CreateMyHanCrop extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:name';

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
        $csvFile = config("mint.path.dict_text") . '/zh/my-han/index.csv';
        if (($fp = fopen($csvFile, "r")) !== false) {
            $row = 0;
            $page = 0;
            while (($data = fgetcsv($fp, 0, ',')) !== false) {
                if ($row === 0) {
                    continue;
                }
                $page = $data[1];
                $word = $data[2];
                $row++;
            }
            fclose($fp);
        }
        return 0;
    }
}
