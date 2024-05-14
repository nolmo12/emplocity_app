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
            'rarity' => 1,
            'type' => '/storage/borders/Amethyst.png',
            'price' => 10.0
        ]);
        Border::create([
            'rarity' => 1,
            'type' => '/storage/borders/Jade.png',
            'price' => 10.0
        ]);
        Border::create([
            'rarity' => 1,
            'type' => '/storage/borders/Ruby.png',
            'price' => 10.0
        ]);
        Border::create([
            'rarity' => 1,
            'type' => '/storage/borders/Sapphire.png',
            'price' => 10.0
        ]);
        Border::create([
            'rarity' => 1,
            'type' => '/storage/borders/Topaz.png',
            'price' => 10.0
        ]);
        Border::create([
            'rarity' => 2,
            'type' => '/storage/borders/Topaz_ring.png',
            'price' => 10.0
        ]);
        Border::create([
            'rarity' => 2,
            'type' => '/storage/borders/Angry.png',
            'price' => 15.0
        ]);
        Border::create([
            'rarity' => 3,
            'type' => '/storage/borders/Bubble.png',
            'price' => 20.0
        ]);
        Border::create([
            'rarity' => 4,
            'type' => '/storage/borders/Cat_ears.png',
            'price' => 25.0
        ]);
        Border::create([
            'rarity' => 4,
            'type' => '/storage/borders/Dragons.png',
            'price' => 25.0
        ]);
        Border::create([
            'rarity' => 4,
            'type' => '/storage/borders/Neon.png',
            'price' => 25.0
        ]);
    }
}
