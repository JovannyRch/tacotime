<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Combo;
use App\Models\Table;

class MeseroController extends Controller
{
    public function index()
    {
        $tables = Table::orderBy('name')->get();

        return inertia('Mesero/Dashboard', [
            'tables' => $tables,
        ]);
    }

    public function create($table_id)
    {
        $table = Table::findOrFail($table_id);

        $order = $table->currentOrder();

        $categories = Category::with([
            'products' => function ($query) {
                $query->where('is_available', true)->with('modifiers');
            },
            'modifiers',
        ])->get();

        $combos = Combo::with([
            'products.modifiers',
            'products.category.modifiers'
        ])->get();




        return inertia('Mesero/Orders/Create', [
            'table' => $table,
            'categories' => $categories,
            'combos' => $combos,
            'order' => $order,
        ]);
    }
}
