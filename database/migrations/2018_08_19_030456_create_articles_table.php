<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArticlesTable extends Migration
{
    /**
     * Run the migrations.
     * @return void
     */
    public function up()
    {
        Schema::create(
            'articles',
            function (Blueprint $table) {
                $table->increments('id');
                $table->string('slug')->unique();

                $table->unsignedInteger('user_id')
                    ->index('articles_user_id_foreign');
                $table->unsignedInteger('image_id')
                    ->index('articles_image_id_foreign');

                $table->boolean('is_published')
                    ->default(false);
                $table->boolean('is_featured')
                    ->default(false);

                $table->string('title');
                $table->string('summary');
                $table->text('body');

                $table->timestamp('published_at');
                $table->timestamps();
                $table->softDeletes();
            }
        );
    }
}
