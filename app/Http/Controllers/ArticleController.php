<?php

namespace App\Http\Controllers;

use App\Article;
use App\Image;
use App\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
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
     *
     * @param Request $request
     *
     * @return RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $input = $request->input();

        $imagePath = $input['image'];
        $imagePath = substr($imagePath, strlen(url('/')));

        $image = Image::query()
            ->where('path', '=', $imagePath)
            ->first();

        $article = new Article();
        $article->user_id = $request->user()->id;
        $article->image_id = $image->id;
        $article->slug = $input['slug'];
        $article->title = $input['title'];
        $article->summary = $input['summary'];
        $article->body = $input['body'];

        $article->is_featured = false;
        $article->is_featured = false;

        if (array_key_exists('is_featured', $input)) {
            $article->is_featured = true;
        }

        if (array_key_exists('is_published', $input)) {
            $article->is_published = true;
            $article->published_at = now();
        }

        $article->save();

        return redirect()->route('articles.edit', ['id' => $article->id]);
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
        $article = Article::find($id);

        return view(
            'pages.articles.show',
            [
                'headerText' => 'ARTICLE',
                'article' => $article
            ]
        );
    }

    /**
     * Display the edit form for the specified resource.
     *
     * @param Request $request
     * @param         $id
     *
     * @return View
     */
    public function edit(Request $request, $id): View
    {
        $article = Article::find($id);

        return view(
            'pages.articles.edit',
            [
                'headerText' => 'EDIT ARTICLE',
                'article' => $article,
            ]
        );
    }

    /**
     * Update the specified resource.
     *
     * @param Request $request
     * @param $id
     *
     * @return RedirectResponse
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $article = Article::find($id);

        $input = $request->input();

        $imagePath = $input['image'];
        $imagePath = substr($imagePath, strlen(url('/')));

        $image = Image::query()
            ->where('path', '=', $imagePath)
            ->first();

        $article->user_id = $request->user()->id;
        $article->image_id = $image->id;
        $article->slug = $input['slug'];
        $article->title = $input['title'];
        $article->summary = $input['summary'];
        $article->body = $input['body'];

        $article->is_featured = false;
        $article->is_featured = false;

        if (array_key_exists('is_featured', $input)) {
            $article->is_featured = true;
        }

        if (array_key_exists('is_published', $input)) {
            $article->is_published = true;
            $article->published_at = now();
        }

        $article->save();

        return redirect('/articles');
    }
}
