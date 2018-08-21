<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;

class ImageController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return View
     */
    public function index(): View
    {
        return view(
            'pages.images.index',
            [
                'headerText' => 'IMAGE MANAGER',
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request $request
     *
     * @return View
     */
    public function store(Request $request): View
    {
        return view(
            'pages.images.index',
            [
                'headerText' => 'IMAGE MANAGER',
            ]
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return View
     */
    public function destroy($id): View
    {
        return view(
            'pages.images.index',
            [
                'headerText' => 'IMAGE MANAGER',
            ]
        );
    }
}
