<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Product extends Model
{

    protected $table = 'products';

    protected $fillable = [
        'name',
        'price',
        'description',
        'is_available',
        'category_id',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function combos()
    {
        return $this->belongsToMany(Combo::class)->withPivot('quantity');
    }

    public function modifiers()
    {
        return $this->morphToMany(Modifier::class, 'assignable', 'modifier_assignables')->withTimestamps();
    }
}
