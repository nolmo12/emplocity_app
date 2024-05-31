<?php

namespace App\Console\Commands;

use App\Models\Video;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Carbon;
use Illuminate\Console\Command;

class CleanOldVideos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:clean-old-videos';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cleans old videos that were uploaded by guest users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $daysToRemoveAfter = Carbon::now()->subDays(7);

        $videos = Video::whereNull('user_id')->where('created_at', '<', $daysToRemoveAfter)->get();
        foreach($videos as $video)
        {
            $video->tags()->detach();

            $video->histories()->delete();
    
            $video->languages()->detach();
    
            $video->likesDislikes()->delete();
    
            $video->comments()->delete();
    
            $video->views()->delete();
    
            $videoPath = public_path($video->video);
            $thumbnailPath = public_path($video->thumbnail);
    
            $video->delete();
    
            if(File::exists($videoPath))
                File::delete($videoPath);
    
            if(File::exists($thumbnailPath))
                File::delete($thumbnailPath);
        }
        $this->info('Old data cleaned successfully!');
    }
}
