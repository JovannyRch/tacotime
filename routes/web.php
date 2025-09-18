<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CajaController;
use App\Http\Controllers\CashRegisterSessionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ComboController;
use App\Http\Controllers\MeseroController;
use App\Http\Controllers\ModifierController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TableController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    //redirect to the appropriate dashboard based on user role
    if (Auth::check()) {
        return redirect()->route(Auth::user()->role . '.dashboard');
    }
    return redirect()->route('login');
})->middleware(['auth', 'verified'])->name('dashboard');






Route::middleware(['auth'])->group(function () {
    Route::resource('products', ProductController::class);
    Route::resource('combos', ComboController::class);
    Route::resource('tables', TableController::class);
    Route::resource('orders', OrderController::class);
    Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.updateStatus');
    Route::get('/orders/{order}/ticket', [OrderController::class, 'ticket'])->name('orders.ticket');
    Route::get('/orders/{order}/comanda', [OrderController::class, 'comanda'])->name('orders.comanda');

    Route::get('/caja/{id}/ticket', [CajaController::class, 'ticket'])->name('caja.ticket');
});

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard');
    Route::resource('users', UserController::class)->only(['index', 'store', 'destroy', 'update']);
    Route::resource('orders', OrderController::class);
    Route::resource('combos', ComboController::class);
    Route::resource('tables', TableController::class)->only(['index']);
    Route::resource('categories', CategoryController::class);
    Route::resource('products', ProductController::class)->only(['index']);
    Route::resource('cashier', CashRegisterSessionController::class)->only(['index', 'show']);
    Route::prefix('modifiers')->group(function () {
        Route::get('/', [ModifierController::class, 'index'])->name('modifiers.index');
        Route::post('/', [ModifierController::class, 'store'])->name('modifiers.store');
        Route::get('{modifier}', [ModifierController::class, 'show'])->name('modifiers.show');
        Route::put('{modifier}', [ModifierController::class, 'update'])->name('modifiers.update');
        Route::delete('{modifier}', [ModifierController::class, 'destroy'])->name('modifiers.destroy');

        Route::post('{modifier}/assign', [ModifierController::class, 'assign'])->name('modifiers.assign');
        Route::post('{modifier}/unassign', [ModifierController::class, 'unassign'])->name('modifiers.unassign');
    });
});



Route::middleware(['auth', 'role:mesero'])->prefix('mesero')->name('mesero.')->group(function () {
    Route::get('/dashboard', [MeseroController::class, 'index'])->name('dashboard');
    Route::get('/table/{table_id}/orders/create', [MeseroController::class, 'create'])->name('orders.create');
});

Route::middleware(['auth', 'role:caja'])->prefix('caja')->name('caja.')->group(function () {
    Route::get('', [CajaController::class, 'index'])->name('dashboard');
    Route::get('/ordenes', [CajaController::class, 'pendingForCashier']);
    Route::get('/mesas', [CajaController::class, 'mesas']);
    Route::get('/ordenes/{order}', [CajaController::class, 'showOrder'])->name('orders.show');
    Route::get('/ordenar', [CajaController::class, 'createOrder'])->name('caja.order');


    Route::post('/cash-register/open', [CashRegisterSessionController::class, 'open']);
    Route::get('/cash-register/current', [CashRegisterSessionController::class, 'current']);
    Route::post('/cash-register/close', [CashRegisterSessionController::class, 'close']);

    Route::post('/payments', [CashRegisterSessionController::class, 'store'])->name('payments.store');
});




require __DIR__ . '/auth.php';
