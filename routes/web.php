<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get(
    '/',
    function () {
        return view('welcome');
    }
);

Route::get(
    '/home',
    [
        'as' => 'home',
        'uses' => 'Controller@home',
    ]

);

Route::get(
    '/about',
    [
        'as' => 'about',
        'uses' => 'Controller@about',
    ]
);

Route::resource(
    '/articles',
    'ArticleController',
    [
        'only' => [
            'index',
            'show'
        ]
    ]
);

Route::get(
    '/contact',
    [
        'as' => 'contact',
        'uses' => 'Controller@contact',
    ]
);

Route::get(
    '/privacy',
    function() {
        return view('pages.privacy');
    }
);