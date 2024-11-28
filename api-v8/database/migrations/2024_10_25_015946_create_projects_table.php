<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v1mc()'));
            $table->string('title',512)->index();
            $table->string('type',32)->index()->default('normal');
            $table->text('description')->nullable();
            $table->jsonb('executors_id')->index()->nullable();
            $table->uuid('parent_id')->index()->nullable();
            $table->jsonb('path')->index()->nullable();
            $table->jsonb('milestones')->index()->nullable();
            $table->uuid('owner_id')->index();
            $table->uuid('editor_id')->index();
            $table->jsonb('status')->index()->nullable();
            $table->timestamp('started_at')->nullable()->index();
            $table->timestamp('finished_at')->nullable()->index();
            $table->softDeletes();
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
        Schema::dropIfExists('projects');
    }
}
