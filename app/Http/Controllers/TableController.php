<?php

namespace App\Http\Controllers;

use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TableController extends Controller
{
    public function index()
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        $meta =  Table::orderBy('created_at', 'desc')->paginate(20);
        return Inertia::render('Admin/Tables/Index', [
            'meta' => $meta
        ]);
    }

    public function create()
    {
        return Inertia::render('Tables/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:50',
            'status' => 'required|in:disponible,ocupada',
        ]);

        Table::create($data);

        return redirect()->back()->with('success', 'Mesa creada correctamente.');
    }

    public function edit(Table $table)
    {
        return Inertia::render('Tables/Edit', [
            'table' => $table
        ]);
    }

    public function update(Request $request, Table $table)
    {
        $data = $request->validate([
            'name' => 'required|string|max:50',
            'status' => 'required|in:disponible,ocupada',
        ]);

        $table->update($data);

        return redirect()->back()->with('success', 'Mesa editada correctamente.');
    }

    public function destroy(Table $table)
    {
        $table->delete();
        return redirect()->back()->with('success', 'Mesa eliminada correctamente.');
    }
}
