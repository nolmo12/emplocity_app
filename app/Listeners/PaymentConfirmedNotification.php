<?php

namespace App\Listeners;

use Payu\Events\PayuPaymentConfirmed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class PaymentConfirmedNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(PayuPaymentConfirmed $event): void
    {
        $order = $event->order;
        $user = $order->user;
        $orderable = $order->orderable;

        switch($orderable->type)
        {
            case 'App\Models\Border':
                if (!$user->borders->contains($orderable->id))
                {
                    $user->borders()->attach($orderable);
                }
                break;
        }  
    }
}
