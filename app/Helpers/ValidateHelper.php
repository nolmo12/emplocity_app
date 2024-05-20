<?php
namespace App\Helpers;

use Illuminate\Support\MessageBag;
class ValidateHelper
{
    /**
    * Custom codes for auth validation errors.
    * Starts at 46x:
    * 461 => email error,
    * 462 => password error,
    * 463 => passwords don't match each other
    */
    static function getAllAuthErrorCodes(MessageBag $errors) : array
    {
        $formattedErrors = [];
        foreach ($errors->all() as $error)
        {
            $code = 0;
            if(str_contains($error, 'email'))
            {
                $code = 461;
            }
            if(str_contains($error, 'password'))
            {
                $code = 462;
            }
            if(str_contains($error, 'repeat password'))
            {
                $code = 463;
            }
    
            $formattedErrors[] = [
                $code => $error
                ];
            }
    
            return $formattedErrors;
    }
        /**
    * Custom codes for video validation errors.
    * Starts at 46x:
    * 471 => video required error,
    * 472 => title required error,
    * 473 => language required error,
    * 474 => visibility required error
    */
    static function getAllVideoErrorCodes(MessageBag $errors) : array
    {
        $formattedErrors = [];
        $code = 0;
        foreach ($errors->all() as $error)
        {
            $code = 0;
            if(str_contains($error, 'video'))
            {
                $code = 471;
            }
            if(str_contains($error, 'title'))
            {
                $code = 472;
            }
            if(str_contains($error, 'language'))
            {
                $code = 473;
            }
            if(str_contains($error, 'visibility'))
            {
                $code = 474;
            }
            $formattedErrors[] = [
                $code => $error
                ];
            }
    
            return $formattedErrors;
    }

}
