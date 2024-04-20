<?php
namespace App\Helpers;
class Utils
{
    public static function getRandomFloat(float $min, float $max, int $precision = 2): float
    {
        $scale = pow(10, $precision);
        return mt_rand($min * $scale, $max * $scale) / $scale;
    }

    public static function sortByScore(&$scores, $order = 'asc')
    {
            if (count($scores) <= 1)
            {
                return;
            }
        
            $pivotKey = key($scores);
            $pivotValue = $scores[$pivotKey]['score'];
            $left = [];
            $right = [];
        
            foreach ($scores as $key => $value)
            {
                if ($key === $pivotKey) 
                {
                    continue;
                }
        
                if (($order === 'asc' && $value['score'] <= $pivotValue) || ($order === 'desc' && $value['score'] >= $pivotValue)) 
                {
                    $left[$key] = $value;
                } else {
                    $right[$key] = $value;
                }
            }
        
            Self::sortByScore($left, $order);
            Self::sortByScore($right, $order);
        
            $scores = $order === 'desc' ? $right + [$pivotKey => $scores[$pivotKey]] + $left : $left + [$pivotKey => $scores[$pivotKey]] + $right;
    }
}