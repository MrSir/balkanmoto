<?php

namespace App\Http\Controllers;

use App\Article;
use App\Link;
use App\Tag;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class LinkController
 * @package App\Http\Controllers
 */
class LinkController extends Controller
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
        $links = Link::query()
            ->select('links.*')
            ->orderBy('order', 'ASC')
            ->get();

        return view(
            'pages.links.index',
            [
                'headerText' => 'Links',
                'links' => $links,
            ]
        );
    }
}
