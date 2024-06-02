<?php

namespace App\Console;

use App\Console\Commands\ClearUrl;
use App\Console\Commands\CleanOldIps;
use App\Console\Commands\CleanOldVideos;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('app:clean-old-videos')->daily();
        $schedule->command('app:clean-old-ips')->daily();
        $schedule->command('app:clear-url')->daily();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');
        $this->commands = [
            CleanOldVideos::class,
            CleanOldIps::class,
            ClearUrl::class
        ];

        require base_path('routes/console.php');
    }
}
