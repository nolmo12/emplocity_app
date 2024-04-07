<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('status', ['Warned', 'Suspended'])->nullable();
        });

        Schema::table('videos', function (Blueprint $table) {
            $table->enum('status', ['Public', 'Unlisted', 'Hidden', 'Marked', 'Removed', 'Uploading'])->nullable();
        });
        Schema::table('payments', function (Blueprint $table) {
            $table->enum('status', ['Processening', 'Error', 'Succesfull'])->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('videos', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn('status');
        });

    }
};
