<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use App\Models\Status;
use App\Models\Language;
use App\Models\Comment;
use App\Models\Video;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::create('videos', function (Blueprint $table) {
            $table->id(); 
            $table->string('reference_code');
            $table->string('thumbnail')->nullable();
            $table->string('video')->nullable();
            $table->integer('views')->default(0);
            $table->string('visibility')->default('public');
            $table->foreignIdFor(User::class)->nullable()->constrained();
            $table->timestamps();
        });

        Schema::create('video_likes_dislikes', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->constrained();
            $table->foreignIdFor(Video::class)->constrained();
            $table->boolean('is_like');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
