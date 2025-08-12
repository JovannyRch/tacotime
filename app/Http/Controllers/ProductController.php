<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {

        if (Auth::user()->role === 'admin') {
            $meta = Product::with('category')->orderBy('created_at', 'desc')->paginate(12);
            $categories = Category::all();
            return Inertia::render('Admin/Products/Index', [
                'meta' => $meta,
                'categories' => $categories
            ]);
        }

        $products = Product::with('category')->get();
        return Inertia::render('Products/Index', [
            'products' => $products
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create', [
            'categories' => Category::all(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'is_available' => 'boolean',
        ]);

        Product::create($data);
        return redirect()->route('products.index');
    }

    public function edit(Product $product)
    {
        $product->load('category');
        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => Category::all(),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'is_available' => 'boolean',
        ]);

        $product->update($data);
        return redirect()->route('products.index');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('products.index');
    }
}
