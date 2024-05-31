<?php

namespace App\Console\Commands;

use App\Models\Url;
use Illuminate\Support\Carbon;
use Illuminate\Console\Command;

class ClearUrl extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:clear-url';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Removes short URLS after a while';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $daysToRemoveAfter = Carbon::now()->subDays(7);

        Url::where('created_at', '<', $daysToRemoveAfter)->delete();

        $this->info('Old data cleaned successfully!');
    }
}
