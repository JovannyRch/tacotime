<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{

    protected $fillable = [
        'table_id',
        'status',
        'total',
        'user_id',
        'is_delivery',
    ];

    public function table()
    {
        return $this->belongsTo(Table::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_product')
            ->withPivot('quantity', 'unit_price', 'complements', 'notes')
            ->withTimestamps();
    }

    public function combos()
    {
        return $this->belongsToMany(Combo::class, 'order_combo')
            ->withPivot('quantity', 'unit_price', 'complements', 'notes')
            ->withTimestamps();
    }

    //user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function getResumeAttribute()
    {
        $resume = [];
        foreach ($this->products as $product) {
            $resume[] = [
                'name' => $product->name,
                'quantity' => $product->pivot->quantity,
                'unit_price' => $product->pivot->unit_price,
            ];
        }

        foreach ($this->combos as $combo) {
            $resume[] = [
                'name' => $combo->name,
                'quantity' => $combo->pivot->quantity,
                'unit_price' => $combo->pivot->unit_price,
            ];
        }

        //resume string
        return collect($resume)->map(function ($item) {
            return "{$item['quantity']} x {$item['name']} | $" . number_format($item['unit_price'], 2);
        })->implode(', ');
    }
}
