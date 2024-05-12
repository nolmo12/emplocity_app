<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Payu\Interfaces\PayuOrderInterface;
use Payu\Models\Payment;

class Order extends Model implements PayuOrderInterface
{
  use HasFactory, SoftDeletes;

  protected $guarded = [];

  public function payments()
  {
    return $this->hasMany(Payment::class)->withTrashed();
  }

  public function paid_payment()
  {
    return $this->hasOne(Payment::class)->where('status', 'COMPLETED')->withTrashed()->latest();
  }

  // Wymagane metody poniżej
  function orderId()
  {
    return $this->id;
  }

  function orderCost()
  {
    return $this->cost;
  }

  function orderFirstname()
  {
    return $this->firstname;
  }

  function orderLastname()
  {
    return $this->lastname;
  }

  function orderPhone()
  {
    return $this->phone;
  }

  function orderEmail()
  {
    return $this->email;
  }
}