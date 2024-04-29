<?php
namespace App\Helpers;

interface SearchInterface
{
    public function calculateSearchScore(array $searchQueryArray) : float;

    public function calculateListingScore() : float;
}