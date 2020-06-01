<?php

namespace App\Http\Controllers;

use App\Article;
use App\Tag;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ToolController extends Controller
{
    public function index(Request $request): View
    {
        return view(
            'pages.tools',
            [
                'headerText' => 'Tools',
            ]
        );
    }

    public function engineFix(Request $request): View
    {
        return view(
            'pages.tools.engineFix',
            [
                'headerText' => 'Engine Fix',
            ]
        );
    }
}
