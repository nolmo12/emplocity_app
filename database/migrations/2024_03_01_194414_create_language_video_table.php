<?php

use App\Models\Video;
use App\Models\Language;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('language_video', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Language::class)->constrained();
            $table->foreignIdFor(Video::class)->nullable()->constrained();
            $table->string('title')->nullable();
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('languange_video');
    }
};
