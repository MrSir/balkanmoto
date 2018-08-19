<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return View
     */
    public function index()
    {
        return view(
            'pages.articles',
            [
                'headerText' => 'ARTICLES',
            ]
        );
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     *
     * @return View
     */
    public function show($id)
    {
        return view(
            'pages.article',
            [
                'headerText' => 'ARTICLE',
            ]
        );
    }
}
