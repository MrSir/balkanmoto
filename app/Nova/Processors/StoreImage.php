<?php
/**
 * Created by PhpStorm.
 * User: mitkotochev
 * Date: 2018-08-28
 * Time: 2:08 PM
 */

namespace App\Nova\Processors;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StoreImage
{
    public function __invoke(Request $request)
    {
        $file = $request->image;
        $ext = $file->getClientOriginalExtension();

        $newFileName = uniqid(
                'IMAGE',
                true
            ) . '.' . $ext;
        $thumbFileName = 'THUMB' . $newFileName;

        // store files
        Storage::put(
            $newFileName,
            file_get_contents($file->getRealPath())
        );

        if (strtolower($ext) === 'jpg'){
            $this->make_thumb(
                $file->getRealPath(),
                $file->getRealPath() . '_thumb',
                300
            );

            Storage::put(
                $thumbFileName,
                file_get_contents($file->getRealPath() . '_thumb')
            );
        }

        return [
            'title' => $file->getClientOriginalName(),
            'filename' => $newFileName,
            'thumbnail' => $thumbFileName,
            'size' => number_format(
                    $file->getSize() / 1000000,
                    2
                ) . 'MB'
        ];
    }

    public function make_thumb($src, $dest, $desired_width)
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
