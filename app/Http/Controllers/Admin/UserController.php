<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $meta = User::where('role', '!=',  'admin')
            ->orderBy('created_at', 'desc')
            ->where('created_via', 'web')
            ->select(['id', 'name', 'email', 'role'])
            ->paginate(20);
        return Inertia::render('Admin/Users/Index', ['meta' => $meta]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,mesero,ordenes,caja',
        ]);

        User::create([
            ...$data,
            'password' => bcrypt($data['password']),
        ]);

        return redirect()->back();
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->back();
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|in:admin,mesero,ordenes,caja',
            'password' => 'nullable|string|min:6',
        ]);

        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return redirect()->back();
    }
}
