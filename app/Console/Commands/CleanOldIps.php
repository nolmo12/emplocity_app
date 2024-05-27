<?php

namespace App\Console\Commands;

use App\Models\VideoView;
use Illuminate\Support\Carbon;
use Illuminate\Console\Command;

class CleanOldIps extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:clean-old-ips';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cleans old ips';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $daysToRemoveAfter = Carbon::now()->subDays(1);

        VideoView::where('created_at', '<', $daysToRemoveAfter)->delete();

        $this->info('Old data cleaned successfully!');
    }
}
