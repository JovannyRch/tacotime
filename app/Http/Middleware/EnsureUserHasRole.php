<?php

// app/Http/Middleware/EnsureUserHasRole.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Ajusta según tu modelo: puedes tener $user->role, $user->is_admin, etc.
        $userRole = $user->role ?? null;


        // Soporta varios roles: role:mesero,cajero
        $roles = collect($roles)->flatMap(fn($r) => explode(',', $r))->map('trim')->filter();

        if ($roles->isEmpty() || ($userRole && $roles->contains($userRole))) {
            return $next($request);
        }

        // 403 o redirige a un dashboard genérico
        abort(403, 'No tienes permisos para acceder a esta página.');
    }
}
