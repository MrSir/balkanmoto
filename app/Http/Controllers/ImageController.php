<?php

namespace App\Http\Controllers;

use App\Image;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\View\View;

/**
 * Class ImageController
 * @package App\Http\Controllers
 */
class ImageController extends Controller
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
        $query = Image::query();

        $keyword = '';
        $input = collect($request->all());

        if ($input->has('keyword')) {
            $keyword = $input->get('keyword');

            $query->where(
                'title',
                'LIKE',
                '%' . $input->get('keyword') . '%'
            );
        }

        $images = $query->paginate(10);

        return view(
            'pages.images.index',
            [
                'headerText' => 'IMAGE MANAGER',
                'images' => $images,
                'keyword' => $keyword,
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request $request
     *
     * @return RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $files = $request->file('images');

        /** @var UploadedFile $file */
        foreach ($files as $file) {
            $newFileName = uniqid(
                    'IMAGE',
                    true
                ) . '.' . $file->getClientOriginalExtension();
            $thumbFileName = 'THUMB' . $newFileName;

            $this->make_thumb(
                $file->getRealPath(),
                $file->getRealPath() . '_thumb',
                250
            );

            // store files
            Storage::put(
                $newFileName,
                file_get_contents($file->getRealPath())
            );

            Storage::put(
                $thumbFileName,
                file_get_contents($file->getRealPath() . '_thumb')
            );

            $image = new Image();
            $image->title = $file->getClientOriginalName();
            $image->filename = $newFileName;
            $image->thumbnailName = $thumbFileName;
            $image->path = Storage::url($newFileName);
            $image->thumbnail = Storage::url($thumbFileName);
            $image->size = number_format(
                    $file->getSize() / 1000000,
                    2
                ) . 'MB';
            $image->save();


        }

        return redirect('/images');
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     */
    public function show($id)
    {
        $image = Image::find($id);

        return Storage::get($image->path);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $imageId
     *
     * @return RedirectResponse
     * @throws \Exception
     */
    public function destroy(int $imageId): RedirectResponse
    {
        $image = Image::find($imageId);

        Storage::delete($image->filename);
        Storage::delete($image->thumbnailName);

        $image->delete();

        return redirect('/images');
    }

    function make_thumb($src, $dest, $desired_width)
    {
        /* read the source image */
        $source_image = imagecreatefromjpeg($src);
        $width = imagesx($source_image);
        $height = imagesy($source_image);

        /* find the "desired height" of this thumbnail, relative to the desired width  */
        $desired_height = floor($height * ($desired_width / $width));

        /* create a new, "virtual" image */
        $virtual_image = imagecreatetruecolor(
            $desired_width,
            $desired_height
        );

        /* copy source image at a resized size */
        imagecopyresampled(
            $virtual_image,
            $source_image,
            0,
            0,
            0,
            0,
            $desired_width,
            $desired_height,
            $width,
            $height
        );

        /* create the physical thumbnail image to its destination */
        imagejpeg(
            $virtual_image,
            $dest,
            100
        );
    }
}
