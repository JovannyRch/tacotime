<?php

namespace App\Http\Controllers;

use App\Models\CashRegisterSession;
use App\Models\Category;
use App\Models\Combo;
use App\Models\Order;
use App\Models\Table;
use Inertia\Inertia;

class CajaController extends Controller
{

    public function index()
    {
        return Inertia::render('Caja/Index');
    }

    public function pendingForCashier()
    {
        $orders = Order::with('table')
            ->where('status', 'pendiente')
            ->orderBy('created_at')
            ->get();

        return Inertia::render('Caja/PendingOrders', [
            'orders' => $orders
        ]);
    }


    public function ticket($sessionId)
    {
        $session = CashRegisterSession::with(['payments.order'])
            ->find($sessionId);

        $session->payments->each(function ($payment) {
            $resume = $payment->order->getResumeAttribute();
            $payment->order->resume = $resume;
            $payment->order->table = $payment->order->table_id ? Table::find($payment->order->table_id) : null;
        });

        if (!$session) {
            return redirect()->route('caja.index');
        }

        return Inertia::render('Caja/CajaTicketPage', [
            'session' => $session
        ]);
    }

    public function showOrder(Order $order)
    {
        $order->load(['products', 'combos', 'table', 'user', 'payment']);

        return Inertia::render('Caja/Order/Show', [
            'order' => $order
        ]);
    }

    public function createOrder()
    {

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

        return Inertia::render('Caja/Order/Create', [
            'categories' => $categories,
            'combos' => $combos,
        ]);
    }
}
