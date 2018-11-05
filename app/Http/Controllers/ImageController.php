<?php

namespace App\Http\Controllers;

use App\Image;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

/**
 * Class ImageController
 * @package App\Http\Controllers
 */
class ImageController extends Controller
{
    /**
     * @param Request $request
     * @param $id
     *
     * @return Response
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function show(Request $request, $id)
    {
        $image = Image::find($id);
        $input = $request->input();

        $response = (new Response())
            ->setExpires(now()->addMonth());

        if (array_key_exists('thumb', $input)) {
            return $response->setContent(Storage::get($image->thumbnail));
        }

        return $response->setContent(Storage::get($image->filename));
    }
}
