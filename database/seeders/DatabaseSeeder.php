<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

         DB::table('categories')->insert([
            ['name' => 'Tacos'],
            ['name' => 'Alambres'],
            ['name' => 'Gringas'],
            ['name' => 'Bebidas'],
            ['name' => 'Especiales'],
        ]);

        DB::table('users')->insert([
            'name' => 'Admin',
            'email' => 'admin@tacotime.com',
            'password' => bcrypt('admin123'),
            'is_admin' => true,
            'role' => 'admin',
        ]);
    }
}
