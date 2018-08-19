<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
            'pages.articles.index',
            [
                'headerText' => 'ARTICLES',
            ]
        );
    }

    /**
     * Display the creation form for the specified resource.
     *
     * @return View
     */
    public function create()
    {
        return view(
            'pages.articles.create',
            [
                'headerText' => 'CREATE ARTICLE',
            ]
        );
    }

    /**
     * Store the specified resource.
     *
     * @return View
     */
    public function store(Request $request)
    {
        return view(
            'pages.articles.show',
            [
                'headerText' => 'ARTICLE',
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
            'pages.articles.show',
            [
                'headerText' => 'ARTICLE',
            ]
        );
    }

    /**
     * Display the edit form for the specified resource.
     *
     * @param  int $id
     *
     * @return View
     */
    public function edit($id)
    {
        return view(
            'pages.articles.edit',
            [
                'headerText' => 'EDIT ARTICLE',
            ]
        );
    }

    /**
     * Update the specified resource.
     *
     * @param  int $id
     *
     * @return View
     */
    public function update(Request $request, $id)
    {
        dd($request->all());

        //return view(
        //    'pages.articles.show',
        //    [
        //        'headerText' => 'ARTICLE',
        //    ]
        //);
    }
}
