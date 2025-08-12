<?php

namespace App\Http\Controllers;

use App\Models\CashRegisterSession;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CashRegisterSessionController extends Controller
{

    public function index()
    {
        $meta = CashRegisterSession::with('user')
            ->orderBy('opened_at', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/CashRegisterSessions/Index', [
            'meta' => $meta
        ]);
    }

    public function show($id)
    {
        $cashRegisterSession = CashRegisterSession::with('user')
            ->find($id);

        if (!$cashRegisterSession) {
            return redirect()->route('admin.cashier.index');
        }


        $cashRegisterSession->payments->each(function ($payment) {
            $resume = $payment->order->getResumeAttribute();
            $payment->order->resume = $resume;
            $payment->order->table = $payment->order->table_id ? $payment->order->table : null;
        });

        return Inertia::render('Admin/CashRegisterSessions/Show', [
            'session' => $cashRegisterSession
        ]);
    }

    public function open(Request $request)
    {
        $user = Auth::user();

        $alreadyOpen = CashRegisterSession::where('user_id', $user->id)
            ->whereNull('closed_at')
            ->first();

        if ($alreadyOpen) {
            return response()->json(['message' => 'Ya hay una caja abierta.'], 422);
        }

        $session = CashRegisterSession::create([
            'user_id' => $user->id,
            'opened_at' => now(),
        ]);

        return response()->json($session, 201);
    }

    public function current()
    {
        $user = Auth::user();

        $session = CashRegisterSession::where('user_id', $user->id)
            ->whereNull('closed_at')
            ->with(['payments.order'])
            ->first();

        if (!$session) {
            return response()->json(['message' => 'No hay una caja abierta.'], 404);
        }

        $computedTotals = [
            'cash' => $session->payments->where('method', 'cash')->sum('amount'),
            'card' => $session->payments->where('method', 'card')->sum('amount'),
            'transfer' => $session->payments->where('method', 'transfer')->sum('amount'),
        ];

        return response()->json([
            ...$session->toArray(),
            'computed_totals' => $computedTotals
        ]);
    }

    public function close()
    {
        $user = Auth::user();

        $session = CashRegisterSession::where('user_id', $user->id)
            ->whereNull('closed_at')
            ->with('payments')
            ->first();

        if (!$session) {
            return response()->json(['message' => 'No hay una caja abierta.'], 404);
        }

        // Calcular totales
        $totals = $session->payments->groupBy('method')->map(function ($payments) {
            return $payments->sum('amount');
        });

        $session->update([
            'closed_at' => now(),
            'total_cash' => $totals['cash'] ?? 0,
            'total_card' => $totals['card'] ?? 0,
            'total_transfer' => $totals['transfer'] ?? 0,
        ]);

        return response()->json([
            'message' => 'Caja cerrada correctamente',
            'session' => $session->load('payments.order')
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'method' => 'required|in:cash,card,transfer',
            'amount' => 'required|numeric|min:0',
            'received_amount' => 'nullable|numeric|min:0',
            'discount_type' => 'nullable|in:PERCENT,FIXED',
            'discount_value' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'discount_reason' => 'nullable|string|max:255',
        ]);

        $user = Auth::user();

        $session = CashRegisterSession::where('user_id', $user->id)
            ->whereNull('closed_at')
            ->first();

        if (!$session) {
            return response()->json(['message' => 'No hay caja abierta.'], 422);
        }

        // Validación extra para efectivo
        $change = null;
        if ($validated['method'] === 'cash') {
            if (!isset($validated['received_amount']) || $validated['received_amount'] < $validated['amount']) {
                return response()->json(['message' => 'Monto recibido insuficiente.'], 422);
            }
            $change = $validated['received_amount'] - $validated['amount'];
        }

        $payment = Payment::create([
            'order_id' => $validated['order_id'],
            'cash_register_session_id' => $session->id,
            'method' => $validated['method'],
            'amount' => $validated['amount'],
            'received_amount' => $validated['received_amount'],
            'change' => $change,
            'discount_type' => $validated['discount_type'] ?? null,
            'discount_value' => $validated['discount_value'] ?? null,
            'discount_amount' => $validated['discount_amount'] ?? 0,
            'discount_reason' => $validated['discount_reason'] ?? null,
        ]);

        $order = Order::find($validated['order_id']);
        $order->update(['status' => 'pagado']);

        if ($order->table) {
            $order->table->update(['status' => 'disponible']);
        }

        return response()->json($payment, 201);
    }
}
