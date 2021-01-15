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
            'show',
        ],
    ]
);

Route::get('/tools/suspension-geometry', 'Tools\SuspensionGeometryController');

Route::resource(
    '/images',
    'ImageController',
    [
        'only' => [
            'show',
        ],
    ]
);

Route::get(
    '/links',
    [
        'as' => 'links',
        'uses' => 'Controller@links',
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