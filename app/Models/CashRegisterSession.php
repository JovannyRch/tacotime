<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CashRegisterSession extends Model
{
    protected $fillable = [
        'user_id',
        'opened_at',
        'closed_at',
        'total_cash',
        'total_card',
        'total_transfer'
    ];

    protected $dates = ['opened_at', 'closed_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
