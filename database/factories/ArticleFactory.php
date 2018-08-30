<?php

use Faker\Generator as Faker;

$factory->define(\App\Article::class, function (Faker $faker) {
    $slug = $faker->word;

    while (!\App\Article::where('slug', '=', $slug)->first()) {
        $slug = $faker->word();
    }

    return [
        'slug' => $faker->word,
        'is_published' => $faker->boolean,
        'is_featured' => $faker->boolean,
        'user_id' => \App\User::first(),
        'image_id' => \App\Image::first(),
        'title' => $faker->sentence,
        'summary' => $faker->sentence,
        'body' => $faker->randomHtml(),
    ];
});
