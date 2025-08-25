<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class OrderCreated implements ShouldBroadcast
{
    use SerializesModels;

    public function __construct(public Order $order) {}

    public function broadcastOn(): Channel
    {
        return new Channel('orders');
    }

    public function broadcastAs(): string
    {
        return 'order.created';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->order->id,
            'table' => $this->order->table?->name ?? 'Para llevar',
            'total' => $this->order->total,
            'resume' => $this->order->resume,
            'created_at' => $this->order->created_at->toISOString(),
        ];
    }
}
