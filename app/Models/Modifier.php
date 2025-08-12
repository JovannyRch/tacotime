<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Modifier extends Model
{
    protected $fillable = ['name'];


    public function products()
    {
        return $this->morphedByMany(Product::class, 'assignable', 'modifier_assignables')->withTimestamps();
    }

    public function categories()
    {
        return $this->morphedByMany(Category::class, 'assignable', 'modifier_assignables')->withTimestamps();
    }

    public function combos()
    {
        return $this->morphedByMany(Combo::class, 'assignable', 'modifier_assignables')->withTimestamps();
    }
}
