<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArticlesTagsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('articles_tags', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('article_id')
                ->index('articles_tags_article_id_foreign');
            $table->unsignedInteger('tag_id')
                ->index('articles_tags_tag_id_foreign');
            $table->timestamps();
        });
    }
}
