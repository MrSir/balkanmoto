<?php

namespace App\Nova;

use App;
use Illuminate\Http\Request;
use Johnathan\NovaTrumbowyg\NovaTrumbowyg;
use Laravel\Nova\Fields;

class Article extends Resource
{
    /**
     * The model the resource corresponds to.
     * @var string
     */
    public static $model = App\Article::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     * @var string
     */
    public static $title = 'title';

    /**
     * The columns that should be searched.
     * @var array
     */
    public static $search = [
        'id',
        'title',
        'summary',
        'body'
    ];

    /**
     * Get the fields displayed by the resource.
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function fields(Request $request)
    {
        return [
            Fields\ID::make()
                ->sortable(),
            Fields\BelongsTo::make('User')
                ->sortable(),
            Fields\Image::make('Image')
                ->thumbnail(
                    function() {
                        return $this->cover->thumbnail_link;
                    }
                )
                ->hideWhenCreating()
                ->hideWhenUpdating(),
            Fields\BelongsTo::make('Image', 'cover')
                ->hideFromIndex()
                ->hideFromDetail()
                ->searchable(),
            Fields\Boolean::make('Is Published')
                ->sortable(),
            Fields\Boolean::make('Is Featured')
                ->sortable(),
            Fields\Text::make('Slug')
                ->rules(
                    [
                        'required',
                        'string',
                    ]
                )
                ->creationRules(
                    [
                        'unique:articles,slug'
                    ]
                )
                ->updateRules(
                    [
                        'unique:articles,slug,{{resourceId}}'
                    ]
                ),
            Fields\Text::make('Title')
                ->sortable(),
            Fields\Textarea::make('Summary')
                ->rules(
                    [
                        'required',
                        'string',
                        'max:255'
                    ]
                )
                ->hideFromIndex(),
            NovaTrumbowyg::make('Body')
                ->rules(
                    [
                        'required',
                        'string'
                    ]
                )
                ->hideFromIndex(),
            Fields\BelongsToMany::make('Tags')
                ->searchable(true)
        ];
    }

    /**
     * Get the cards available for the request.
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function cards(Request $request)
    {
        return [];
    }

    /**
     * Get the filters available for the resource.
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function filters(Request $request)
    {
        return [];
    }

    /**
     * Get the lenses available for the resource.
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function lenses(Request $request)
    {
        return [];
    }

    /**
     * Get the actions available for the resource.
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function actions(Request $request)
    {
        return [];
    }
}
