<?php

use Faker\Generator as Faker;

$factory->define(\App\Image::class, function (Faker $faker) {
    return [
        'title' => $faker->title,
        'filename' => $faker->word.$faker->fileExtension,
        'thumbnail' => $faker->word.$faker->fileExtension,
        'size' => $faker->randomDigit . '.23MB'
    ];
});
