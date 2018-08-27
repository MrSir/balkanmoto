<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Image
 * @package App
 */
class Image extends Model
{
    protected $fillable = [
        'title',
        'filename',
        'thumbnailName',
        'path',
        'thumbnail',
        'size',
    ];

    protected $casts = [
        'title' => 'string',
        'filename' => 'string',
        'thumbnailName' => 'string',
        'path' => 'string',
        'thumbnail' => 'string',
        'size' => 'string',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];
}
