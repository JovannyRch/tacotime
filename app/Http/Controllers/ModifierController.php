<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Combo;
use Illuminate\Http\Request;
use App\Models\Modifier;
use App\Models\Product;

class ModifierController extends Controller
{
    // Listar todos los modifiers
    public function index()
    {
        $meta = Modifier::with(['products', 'categories', 'combos'])->orderBy('created_at', 'desc')->paginate(20);

        return inertia('Admin/Modifiers/Index', [
            'meta' => $meta,
        ]);
    }

    // Crear un nuevo modifier
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:modifiers,name',
        ]);

        $modifier = Modifier::create($validated);

        return redirect()->route('admin.modifiers.show', $modifier->id);
    }

    // Mostrar un modifier
    public function show(Modifier $modifier)
    {
        $modifier = $modifier->load(['products', 'categories', 'combos']);

        $products = Product::all();
        $combos = Combo::all();
        $categories = Category::all();

        return inertia('Admin/Modifiers/Show', [
            'modifier' => $modifier,
            'products' => $products,
            'combos' => $combos,
            'categories' => $categories,
        ]);
    }

    // Actualizar un modifier
    public function update(Request $request, Modifier $modifier)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:modifiers,name,' . $modifier->id,
        ]);

        $modifier->update($validated);

        return back()->with('success', 'Modifier updated successfully')->with(['modifier' => $modifier]);
    }

    // Eliminar un modifier
    public function destroy(Modifier $modifier)
    {
        $modifier->delete();
        return back()->with('success', 'Modifier deleted successfully');
    }

    // Asignar un modifier a una entidad (product, category, combo)
    public function assign(Request $request, Modifier $modifier)
    {
        try {
            $validated = $request->validate([
                'assignable_type' => 'required|in:product,category,combo',
                'assignable_id' => 'required|integer',
            ]);

            $typeMap = [
                'product' => Product::class,
                'category' => Category::class,
                'combo' => Combo::class,
            ];

            $assignableClass = $typeMap[$validated['assignable_type']];

            $assignable = $assignableClass::findOrFail($validated['assignable_id']);

            $assignable->modifiers()->syncWithoutDetaching([$modifier->id]);

            return back()->with('success', 'Modifier assigned successfully')->with(['modifier' => $modifier]);
        } catch (\Throwable $th) {
            dd($th);
        }
    }

    // Desasignar un modifier de una entidad
    public function unassign(Request $request, Modifier $modifier)
    {
        $validated = $request->validate([
            'assignable_type' => 'required|in:product,category,combo',
            'assignable_id' => 'required|integer',
        ]);

        $typeMap = [
            'product' => \App\Models\Product::class,
            'category' => \App\Models\Category::class,
            'combo' => \App\Models\Combo::class,
        ];

        $assignableClass = $typeMap[$validated['assignable_type']];

        $assignable = $assignableClass::findOrFail($validated['assignable_id']);

        $assignable->modifiers()->detach($modifier->id);

        return back()->with('success', 'Modifier unassigned successfully')->with(['modifier' => $modifier]);
    }
}
