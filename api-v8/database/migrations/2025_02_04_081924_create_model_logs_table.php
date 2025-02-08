<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateModelLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('model_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->uuid('model_id')->index();
            $table->json('request_headers');
            $table->json('request_data');
            $table->json('response_headers')->nullable();
            $table->json('response_data')->nullable();
            $table->integer('status')->index();
            $table->boolean('success')->default(true);
            $table->timestamp('request_at')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('model_logs');
    }
}
