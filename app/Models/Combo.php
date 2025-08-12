<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Combo extends Model
{
    protected $fillable = ['name', 'price', 'description'];

    public function products()
    {
        return $this->belongsToMany(Product::class)->withPivot('quantity');
    }

    protected $appends = ['product_ids'];
    public function getProductIdsAttribute()
    {
        return $this->products->pluck('id')->toArray();
    }

    public function modifiers()
    {
        return $this->morphToMany(Modifier::class, 'assignable', 'modifier_assignables')->withTimestamps();
    }
}
