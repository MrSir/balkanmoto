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
        'thumbnail',
        'size',
    ];

    protected $casts = [
        'title' => 'string',
        'filename' => 'string',
        'thumbnail' => 'string',
        'size' => 'string',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    public function getLinkAttribute()
    {
        return '/images/' . $this->id;
    }

    public function getThumbnailLinkAttribute()
    {
        return '/images/' . $this->id . '?thumb';
    }
}
