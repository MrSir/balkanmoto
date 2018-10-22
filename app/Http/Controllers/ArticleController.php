<?php

namespace App\Http\Controllers;

use App\Article;
use App\Tag;
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
        $query = Article::query()
            ->select('articles.*');

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

        if ($input->has('tag')) {
            $query->join(
                'articles_tags',
                'articles_tags.article_id',
                '=',
                'articles.id'
            )
                ->join(
                    'tags',
                    'tags.id',
                    '=',
                    'articles_tags.tag_id'
                )
                ->where(
                    'tags.name',
                    '=',
                    $input->get('tag')
                );
        }

        $query->orderBy('created_at', 'DESC');

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
                'article' => $article,
            ]
        );
    }
}
