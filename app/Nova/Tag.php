<?php

namespace App\Nova;

use App;
use Illuminate\Http\Request;
use Laravel\Nova\Fields;

class Tag extends Resource
{
    /**
     * The model the resource corresponds to.
     * @var string
     */
    public static $model = App\Tag::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     * @var string
     */
    public static $title = 'name';

    /**
     * The columns that should be searched.
     * @var array
     */
    public static $search = [
        'id',
        'name',
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
            Fields\Text::make('Name')
                ->sortable()
                ->rules(
                    [
                        'required',
                        'string',
                        'max:255'
                    ]
                )
                ->creationRules(
                    [
                        'unique:tags,name'
                    ]
                )
                ->updateRules(
                    [
                        'unique:tags,name,{{resourceId}}'
                    ]
                ),
            Fields\Number::make(
                'Count',
                'tagged_count'
            ),
            Fields\BelongsToMany::make('Articles')
                ->searchable(true),
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
