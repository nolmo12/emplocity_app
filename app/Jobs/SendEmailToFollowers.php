<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\Video;
use Illuminate\Bus\Queueable;
use App\Mail\SendVideoNotification;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class SendEmailToFollowers implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected Video $video;

    /**
     * Create a new job instance.
     */
    public function __construct(Video $video)
    {
        $this->video = $video;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $user = $this->video->user;
        $followers = $user->followers;

        foreach($followers as $follower)
        {
            $hiddenAttributes = $follower->getAttributes();
            $followerEmail = $hiddenAttributes['email'];
            Mail::to($followerEmail)
            ->send(new SendVideoNotification($this->video));
        }
    }
}
