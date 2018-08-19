<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Image
 * @package App
 */
class Image extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'path',
        'thumbnail',
    ];

    protected $casts = [
        'path' => 'string',
        'thumbnail' => 'string',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];
}
