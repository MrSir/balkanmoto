<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Link extends Model
{
    protected $fillable = [
        'order',
        'title',
        'url',
    ];

    protected $casts = [
        'order' => 'integer',
        'title' => 'string',
        'url' => 'string',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];
}
