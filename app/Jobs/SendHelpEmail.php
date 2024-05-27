<?php

namespace App\Jobs;

use App\Models\User;
use App\Mail\SendHelp;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class SendHelpEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $email;
    protected $content;
    protected $type;

    public function __construct($email, $content, $type)
    {
        $this->email = $email;
        $this->content = $content;
        $this->type = $type;
    }

    public function handle()
    {
        $admins = User::with('roles')->whereHas('roles', function($query){
            $query->where('name', 'admin');
        })->get();

        foreach($admins as $admin)
        {
            $hiddenAttributes = $admin->getAttributes();
            $adminEmail = $hiddenAttributes['email'];

            Mail::to($adminEmail)
                ->send(new SendHelp($this->email, $this->content, $this->type));
        }
    }
}
