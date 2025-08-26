<?php

namespace App\Events;

use App\Models\Table;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class UpdateTable implements ShouldBroadcastNow
{
    public function __construct(public Table $table) {}
    public function broadcastOn(): array
    {
        return [new Channel('tables')];
    }
    public function broadcastAs(): string
    {
        return 'update.table';
    }
    public function broadcastWith(): array
    {
        return [
            'id' => $this->table->id,
            'name' => $this->table->name,
            'status' => $this->table->status,
        ];
    }
}
