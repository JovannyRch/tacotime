<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;



class OrderCreated implements ShouldBroadcastNow
{
    public function __construct(public Order $order, public int $lastProductIndex, public int $lastComboIndex) {}
    public function broadcastOn(): array
    {
        return [new Channel('orders')];
    }
    public function broadcastAs(): string
    {
        return 'order.created';
    }
    public function broadcastWith(): array
    {
        return [
            'id' => $this->order->id,
            'table' => $this->order->table ?? 'Para llevar',
            'total' => $this->order->total,
            'resume' => $this->order->resume,
            'created_at' => $this->order->created_at->toISOString(),
            'lastProductIndex' => $this->lastProductIndex,
            'lastComboIndex' => $this->lastComboIndex,
        ];
    }
}
