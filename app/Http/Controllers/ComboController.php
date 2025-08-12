<?php

namespace App\Http\Controllers;

use App\Models\Combo;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ComboController extends Controller
{
    public function index()
    {

        if (Auth::user()->role === 'admin') {
            $meta = Combo::with('products')->orderBy('created_at', 'desc')->paginate(20);

            return Inertia::render('Admin/Combos/Index', [
                'meta' => $meta,
                'products' => Product::all()
            ]);
        }

        return Inertia::render('Combos/Index', [
            'combos' => Combo::with('products')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Combos/Create', [
            'products' => Product::all(),
        ]);
    }


    public function edit(Combo $combo)
    {
        $combo->load('products');

        return Inertia::render('Combos/Edit', [
            'combo' => [
                'id' => $combo->id,
                'name' => $combo->name,
                'price' => $combo->price,
                'description' => $combo->description,
                'products' => $combo->products->map(fn($p) => [
                    'id' => $p->id,
                    'quantity' => $p->pivot->quantity
                ])
            ],
            'products' => Product::all(),
        ]);
    }



    public function destroy(Combo $combo)
    {
        $combo->delete();
        return redirect()->route('combos.index');
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'products' => 'required|array',
            'products.*.id' => 'required',
            'products.*.quantity' => 'required|integer|min:1',
        ]);

        $combo = Combo::create($data);

        $syncData = collect($data['products'])->mapWithKeys(fn($p) => [
            $p['id'] => ['quantity' => $p['quantity']]
        ]);

        $combo->products()->sync($syncData);

        return redirect()->back()->with('success', 'Combo creado correctamente.');
    }

    //update
    public function update(Request $request, Combo $combo)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'price' => 'required|numeric',
                'description' => 'nullable|string',
                'products' => 'required|array',
                'products.*.id' => 'required',
                'products.*.quantity' => 'required|integer|min:1',
            ]);

            $combo->update($data);

            $syncData = collect($data['products'])->mapWithKeys(fn($p) => [
                $p['id'] => ['quantity' => $p['quantity']]
            ]);

            $combo->products()->sync($syncData);

            return redirect()->back()->with('success', 'Combo actualizado correctamente.');
        } catch (\Throwable $th) {
            dd($th);
            Log::error('Error updating combo: ' . $th->getMessage());
        }
    }
}
