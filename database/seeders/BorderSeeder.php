<?php

namespace Database\Seeders;

use App\Models\Border;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class BorderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Border::create([
            'rarity' => 2,
            'type' => '/storage/borders/Topaz_ring.png',
            'price' => 15.0,
            'name' => 'Topaz Ring'
        ]);
        Border::create([
            'rarity' => 2,
            'type' => '/storage/borders/Angry.png',
            'price' => 15.0,
            'name' => 'Angery!!!'
        ]);
        Border::create([
            'rarity' => 3,
            'type' => '/storage/borders/Bubble.png',
            'price' => 20.0,
            'name' => 'Bubble'
        ]);
        Border::create([
            'rarity' => 4,
            'type' => '/storage/borders/Cat_ears.png',
            'price' => 25.0,
            'name' => 'UwU'
        ]);
        Border::create([
            'rarity' => 4,
            'type' => '/storage/borders/Dragons.png',
            'price' => 25.0,
            'name' => 'Dragons',
        ]);
        Border::create([
            'rarity' => 4,
            'type' => '/storage/borders/Neon.png',
            'price' => 25.0,
            'name' => 'Neon'
        ]);
    }
}
