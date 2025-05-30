<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPcdBookInFtsTexts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fts_texts', function (Blueprint $table) {
            //
            $table->integer('pcd_book_id')->index()->default(0);

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fts_texts', function (Blueprint $table) {
            $table->dropColumn('pcd_book_id');
        });
    }
}
