<?php

use Faker\Generator as Faker;

$factory->define(\App\Article::class, function (Faker $faker) {
    return [
        'slug' => $faker->word . now()->format('YmdHis'),
        'is_published' => $faker->boolean,
        'is_featured' => $faker->boolean,
        'user_id' => \App\User::first(),
        'image_id' => \App\Image::first(),
        'title' => $faker->sentence,
        'summary' => $faker->sentence,
        'body' => $faker->randomHtml(),
        'published_at' => now(),
    ];
});
