<?php
namespace App\Helpers;

function getRandomFloat(float $min, float $max, int $precision = 2): float
{
    $scale = pow(10, $precision);
    return mt_rand($min * $scale, $max * $scale) / $scale;
}