<?php

namespace App\Http\Controllers;

use App\Events\OrderCreated;
use App\Models\Combo;
use App\Models\Order;
use App\Models\Product;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
            'combos.*.combo_modifiers' => 'nullable',
            'combos.*.notes' => 'nullable|string',
            'is_delivery' => 'nullable|boolean',
        ]);

        $user = Auth::user();

        $incomingProductsTotal = collect($validated['products'] ?? [])
            ->sum(fn($p) => $p['price'] * $p['quantity']);
        $incomingCombosTotal = collect($validated['combos'] ?? [])
            ->sum(fn($c) => $c['price'] * $c['quantity']);
        $incomingTotal = $incomingProductsTotal + $incomingCombosTotal;

        $lastProductIndex = 0;
        $lastComboIndex = 0;

        try {
            $order = DB::transaction(function () use ($validated, $user, $incomingTotal, &$lastProductIndex, &$lastComboIndex) {
                $tableId = $validated['table_id'] ?? null;
                $isDelivery = (bool) ($validated['is_delivery'] ?? false);


                $openStatuses = ['pendiente', 'preparando'];

                $order = null;
                if ($tableId && !$isDelivery) {
                    $order = \App\Models\Order::query()
                        ->where('table_id', $tableId)
                        ->whereIn('status', $openStatuses)
                        ->latest('id')
                        ->first();
                }

                if (!$order) {
                    $order = \App\Models\Order::create([
                        'user_id'     => $user->id,
                        'table_id'    => $tableId,
                        'status'      => 'pendiente',
                        'is_delivery' => $isDelivery,
                        'total'       => $incomingTotal,
                    ]);
                } else {

                    if ($incomingTotal > 0) {
                        $order->increment('total', $incomingTotal);
                        $order->refresh();
                    }
                }


                $lastProductIndex = $order->products()->count();
                $lastComboIndex = $order->combos()->count();

                foreach (collect($validated['products'] ?? []) as $p) {
                    $order->products()->attach($p['id'], [
                        'quantity'    => $p['quantity'],
                        'unit_price'  => $p['price'],
                        'complements' => $p['complements'] ?? null,
                        'notes'       => $p['notes'] ?? null,
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ]);
                }

                foreach (collect($validated['combos'] ?? []) as $c) {

                    $notes = $c['notes'] ?? null;
                    if (isset($c['combo_modifiers']) && $c['combo_modifiers']) {
                        $modText = 'Cortesías(' . implode(', ', $c['combo_modifiers']) . ')';
                        $notes = $notes ? ($notes . ' | ' . $modText) : $modText;
                    }


                    $order->combos()->attach($c['id'], [
                        'quantity'    => $c['quantity'],
                        'unit_price'  => $c['price'],
                        'complements' => $c['complements'] ?? null,
                        'notes'       => $notes,
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ]);
                }

                // Si hay mesa asociada, marcar ocupada
                if ($order->table) {
                    $order->table->update(['status' => 'ocupada']);
                }

                return $order;
            });


            event(new \App\Events\OrderCreated($order, $lastProductIndex, $lastComboIndex));

            // Redirecciones por rol
            if ($user->role === 'mesero') {
                return redirect()->route('mesero.dashboard')->with([
                    'success' => $order->wasRecentlyCreated
                        ? 'Orden creada exitosamente.'
                        : 'Productos agregados a la orden existente.',
                    'id' => $order->id
                ]);
            }
            if ($user->role === 'caja') {
                return redirect()->route('caja.dashboard')->with([
                    'success' => $order->wasRecentlyCreated
                        ? 'Orden creada exitosamente.'
                        : 'Productos agregados a la orden existente.',
                    'id' => $order->id
                ]);
            }

            return redirect()->route('orders.index')->with([
                'success' => $order->wasRecentlyCreated
                    ? 'Orden creada exitosamente.'
                    : 'Productos agregados a la orden existente.',
                'id' => $order->id
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error al crear/agregar a la orden. ' . $th->getMessage()
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
