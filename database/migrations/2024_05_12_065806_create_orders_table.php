<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up()
  {
    Schema::create('orders', function (Blueprint $table) {
      $table->id();
      $table->decimal('cost', 15, 2)->nullable()->default(0.00);
      $table->enum('payment_method', ['money', 'card', 'online', 'cashback'])->nullable()->default('money');
      $table->enum('payment_gateway', ['payu'])->nullable(true);
      $table->string('firstname');
      $table->string('lastname');
      $table->string('phone');
      $table->string('email');
      $table->timestamps();
      $table->softDeletes();
      $table->unsignedBigInteger('user_id')->nullable(true);
      $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
    });
  }

  public function down()
  {
    Schema::dropIfExists('orders');
  }
};