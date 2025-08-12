<?php

namespace App\Http\Controllers;

use App\Models\Combo;
use App\Models\Order;
use App\Models\Product;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{

    public function index()
    {

        $meta = Order::with(['user', 'table'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/Orders/Index', [
            'meta' => $meta
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['user', 'table', 'products', 'combos', 'payment']);

        if (Auth::user()->role === 'admin') {
            return Inertia::render('Admin/Orders/Show', [
                'order' => $order
            ]);
        }

        return Inertia::render('Orders/Show', [
            'order' => $order
        ]);
    }


    public function create()
    {
        return Inertia::render('Orders/Create', [
            'products' => Product::where('is_available', true)->get(),
            'combos' => Combo::all(),
            'tables' => Table::all(),
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'table_id' => 'nullable|exists:tables,id',
                'products' => 'array',
                'products.*.id' => 'required|exists:products,id',
                'products.*.quantity' => 'required|integer|min:1',
                'products.*.price' => 'required|numeric|min:0',
                'products.*.complements' => 'nullable|string',
                'products.*.notes' => 'nullable|string',
                'combos' => 'array',
                'combos.*.id' => 'required|exists:combos,id',
                'combos.*.quantity' => 'required|integer|min:1',
                'combos.*.price' => 'required|numeric|min:0',
                'combos.*.complements' => 'nullable|string',
                'combos.*.notes' => 'nullable|string',
                'is_delivery' => 'nullable|boolean',
            ]);

            $user = Auth::user();

            // Calcular total
            $productTotal = collect($validated['products'] ?? [])->sum(fn($p) => $p['price'] * $p['quantity']);
            $comboTotal = collect($validated['combos'] ?? [])->sum(fn($c) => $c['price'] * $c['quantity']);
            $total = $productTotal + $comboTotal;


            // Crear orden
            $order = Order::create([
                'user_id' => $user->id,
                'table_id' => $validated['table_id'] ?? null,
                'status' => 'pendiente',
                'is_delivery' => $validated['is_delivery'] ?? false,
                'total' => $total,
            ]);

            // Asociar productos
            $productsToAttach = collect($validated['products'] ?? [])->mapWithKeys(fn($p) => [
                $p['id'] => [
                    'quantity' => $p['quantity'],
                    'unit_price' => $p['price'],
                    'complements' => $p['complements'] ?? null,
                    'notes' => $p['notes'] ?? null,
                ]
            ]);
            $order->products()->sync($productsToAttach);

            // Asociar combos
            $combosToAttach = collect($validated['combos'] ?? [])->mapWithKeys(fn($c) => [
                $c['id'] => [
                    'quantity' => $c['quantity'],
                    'unit_price' => $c['price'],
                    'complements' => $c['complements'] ?? null,
                    'notes' => $c['notes'] ?? null,
                ]
            ]);
            $order->combos()->sync($combosToAttach);

            if ($order->table) {
                $order->table->update(['status' => 'ocupada']);
            }

            if (Auth::user()->role === 'mesero') {
                return redirect()->route('mesero.dashboard')->with([
                    'success' => 'Orden creada exitosamente.',
                    'id' => $order->id
                ]);
            }
            if (Auth::user()->role === 'caja') {
                return redirect()->route('caja.dashboard')->with([
                    'success' => 'Orden creada exitosamente.',
                    'id' => $order->id
                ]);
            }
            return redirect()->route('orders.index')->with([
                'success' => 'Orden creada exitosamente.',
                'id' => $order->id
            ]);
        } catch (\Throwable $th) {

            $errorMessage = $th->getMessage();
            return response()->json([
                'message' => 'Error al crear la orden. Por favor, inténtalo de nuevo más tarde. ' . $errorMessage
            ], 500);
        }
    }

    public function updateStatus(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => 'required|in:pendiente,preparando,servido,pagado',
        ]);

        $order->update(['status' => $data['status']]);

        return redirect()->back()->with('success', 'Estado actualizado.');
    }

    public function ticket(Order $order)
    {
        $order->load(['products', 'combos', 'table', 'user']);
        $order->load('payment');

        return Inertia::render('Orders/Ticket', [
            'order' => $order
        ]);
    }

    public function comanda(Order $order)
    {
        $order->load(['products', 'combos', 'table', 'user']);
        $order->load('payment');

        return Inertia::render('Orders/Comanda', [
            'order' => $order
        ]);
    }
}
