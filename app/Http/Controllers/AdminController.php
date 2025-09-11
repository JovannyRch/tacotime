<?php

namespace App\Http\Controllers;

use App\Models\CashRegisterSession;
use App\Models\Order;
use App\Models\Table;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function index()
    {

        $today = Carbon::today();

        $ordersToday = Order::whereDate('created_at', $today)->get();
        $sessionsToday = CashRegisterSession::whereDate('opened_at', $today)->get();

        $topProducts = DB::table('order_product')
            ->join('products', 'order_product.product_id', '=', 'products.id')
            ->join('orders', 'order_product.order_id', '=', 'orders.id')
            ->whereDate('orders.created_at', $today)
            ->select('products.name', DB::raw('SUM(order_product.quantity) as total_sold'))
            ->groupBy('products.name')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        $recentOrders = Order::with('table')
            ->whereDate('created_at', Carbon::today())
            ->latest()
            ->take(5)
            ->get(['id', 'table_id', 'total', 'status', 'created_at']);


        $tables = Table::all(['id', 'name', 'status']);



        return inertia('Admin/Dashboard', [
            'summary' => [
                'total_sales' => $ordersToday->sum('total'),
                'orders_count' => $ordersToday->count(),
                'total_cash' => $sessionsToday->sum('total_cash'),
                'total_card' => $sessionsToday->sum('total_card'),
                'total_transfer' => $sessionsToday->sum('total_transfer'),
                'active_session' => CashRegisterSession::whereNull('closed_at')->latest()->with('user')->first(),
            ],
            'topProducts' => $topProducts,
            'recentOrders' => $recentOrders,
            'tables' => $tables,
        ]);
    }
}
