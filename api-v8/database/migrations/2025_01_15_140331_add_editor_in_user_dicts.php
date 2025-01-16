<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddEditorInUserDicts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_dicts', function (Blueprint $table) {
            //
            $table->uuid('editor_id')->nullable()->index()->comment('此次编辑者');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_dicts', function (Blueprint $table) {
            //
            $table->dropColumn('editor_id');
        });
    }
}
