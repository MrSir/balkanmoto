<?php

use Faker\Generator as Faker;

$factory->define(\App\Article::class, function (Faker $faker) {
    return [
        'slug' => $faker->word,
        'user_id' => 1,
        'image_id' => 1,
        'title' => $faker->sentence,
        'body' => $faker->randomHtml(),
    ];
});
