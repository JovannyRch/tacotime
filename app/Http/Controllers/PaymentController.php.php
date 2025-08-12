<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Models\CashRegisterSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'method' => 'required|in:cash,card,transfer,free',
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
