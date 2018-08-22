<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Class Tag
 * @package App
 */
class Tag extends Model
{
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

    /**
     * @return string
     */
    public function getUpperCaseNameAttribute(): string
    {
        return strtoupper($this->name);
    }

    /**
     * @return string
     */
    public function getClassAttribute(): string
    {
        $class = 'very-small';

        if ($this->tagged_count > 1) {
            $class = 'small';
        }

        if ($this->tagged_count > 10) {
            $class = 'medium';
        }

        if ($this->tagged_count > 15) {
            $class = 'large';
        }

        if ($this->tagged_count > 25) {
            $class = 'very-large';
        }

        return $class;
    }

    /**
     * @return string
     */
    public function getLinkAttribute(): string
    {
        return '/articles?tagId=' . $this->id;
    }
}
