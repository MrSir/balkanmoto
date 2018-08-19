<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Tag
 * @package App
 */
class Tag extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'tagged_count',
    ];

    protected $casts = [
        'name' => 'string',
        'tagged_count' => 'integer',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    /**
     * @return BelongsToMany
     */
    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(
           Article::class,
           'articles_tags'
        );
    }
}
