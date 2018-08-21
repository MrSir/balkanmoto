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
            'create',
            'store',
            'show',
            'edit',
            'update'
        ]
    ]
);

Route::resource(
    '/images',
    'ImageController',
    [
        'only' => [
            'index',
            'store',
            'destroy'
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
    '/login',
    [
        'as' => 'showlogin',
        'uses' => 'Auth\LoginController@showLoginForm',
    ]
);

Route::post(
    '/login',
    [
        'as' => 'login',
        'uses' => 'Auth\LoginController@login',
    ]
);

Route::get(
    '/logout',
    [
        'as' => 'logout',
        'uses' => 'Auth\LoginController@logout',
    ]
);

Route::get('login/google', 'Auth\LoginController@redirectToProvider');
Route::get('login/google/callback', 'Auth\LoginController@handleProviderCallback');

Route::get(
    '/privacy',
    function() {
        return view('pages.privacy');
    }
);