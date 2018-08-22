<?php

namespace App\Http\Controllers;

use App\Article;
use App\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class ArticleController
 * @package App\Http\Controllers
 */
class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     *
     * @return View
     */
    public function index(Request $request): View
    {
        $query = Article::query();

        $keyword = '';
        $input = collect($request->all());

        if (!$input->has('preview')) {
            $query->where(
                'is_published',
                '=',
                true
            );
        }

        if ($input->has('keyword')) {
            $keyword = $input->get('keyword');

            $query->where(
                'title',
                'LIKE',
                '%' . $input->get('keyword') . '%'
            );
        }

        if ($input->has('tagId')) {
            $query->join(
                'articles_tags',
                'articles_tags.article_id',
                '=',
                'articles.id'
            )
                ->where(
                    'articles_tags.tag_id',
                    '=',
                    $input->get('tagId')
                );
        }

        $articles = $query->paginate(10);

        $tags = Tag::all();

        return view(
            'pages.articles.index',
            [
                'headerText' => 'ARTICLES',
                'articles' => $articles,
                'keyword' => $keyword,
                'tags' => $tags,
            ]
        );
    }

    /**
     * Display the creation form for the specified resource.
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
     * @return RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        return redirect('/articles');
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     *
     * @return View
     */
    public function show($id): View
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
    public function edit($id): View
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
     * @return RedirectResponse
     */
    public function update(Request $request, $id): RedirectResponse
    {
        dd($request->all());

        return redirect('/articles');
    }
}
