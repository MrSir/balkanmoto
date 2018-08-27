<?php

namespace App\Http\Controllers;

use App\Article;
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
        $input = $request->input();

        $article = new Article();
        $article->slug = $input['slug'];
        $article->title = $input['title'];
        $article->body = $input['body'];
        $article->is_featured = $input['is_featured'];

        if ($input['is_published']){
            $article->is_published = true;
            $article->published_at = now();
        }

        $article->save();

        return redirect('');
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
