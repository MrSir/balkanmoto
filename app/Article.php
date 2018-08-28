<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Article
 * @package App
 */
class Article extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'slug',
        'user_id',
        'image_id',
        'is_published',
        'is_featured',
        'title',
        'summary',
        'body',
        'published_at',
    ];

    protected $casts = [
        'slug' => 'string',
        'user_id' => 'integer',
        'image_id' => 'integer',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'title' => 'string',
        'summary' => 'string',
        'body' => 'string',
    ];

    protected $dates = [
        'published_at',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo
     */
    public function cover(): BelongsTo
    {
        return $this->belongsTo(Image::class, 'image_id');
    }

    /**
     * @return BelongsToMany
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(
            Tag::class,
            'articles_tags'
        );
    }
}
