<?php
use App\Models\User;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

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
      $table->integer('orderable_id');
      $table->string('orderable_type');
    });
  }

  public function down()
  {
    Schema::dropIfExists('orders');
  }
};