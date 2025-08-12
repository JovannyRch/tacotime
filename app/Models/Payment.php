<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'order_id',
        'cash_register_session_id',
        'method',
        'amount',
        'received_amount',
        'change',
        'discount_type',
        'discount_value',
        'discount_amount',
        'discount_reason',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function session()
    {
        return $this->belongsTo(CashRegisterSession::class, 'cash_register_session_id');
    }
}
