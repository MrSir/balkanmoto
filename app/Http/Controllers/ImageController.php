<?php

namespace App\Http\Controllers;

use App\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Class ImageController
 * @package App\Http\Controllers
 */
class ImageController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @param $id
     *
     * @return string
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function show(Request $request, $id)
    {
        $image = Image::find($id);

        $input = $request->input();

        if (array_key_exists('thumb', $input)) {
            return Storage::get($image->thumbnail);
        }

        return Storage::get($image->filename);
    }
}
