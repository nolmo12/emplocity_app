<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class Enumerate implements ValidationRule
{
    protected array $enumValues;

    public function __construct(array $enumValues)
    {
        $this->enumValues = $enumValues;
    }
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, $value, Closure $fail): void
    {
        if (!in_array($value, $this->enumValues))
        {
            $fail("The $attribute must be one of the following: " . implode(', ', $this->enumValues));
        }
    }
}
