<?php

namespace App\Nova;

use App;
use Laravel\Nova\Fields;
use Illuminate\Http\Request;

class Image extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var string
     */
    public static $model = App\Image::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'title';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id',
        'title'
    ];

    /**
     * Get the fields displayed by the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function fields(Request $request)
    {
        return [
            Fields\ID::make()->sortable(),
            Fields\Image::make('Image')
                ->thumbnail(
                    function(){
                        return $this->thumbnail_link;
                    }
                )
                ->hideWhenCreating()
                ->hideWhenUpdating(),
            Fields\Image::make('Image')
                ->store(new Processors\StoreImage)
                ->hideWhenUpdating()
                ->hideFromDetail()
                ->hideFromIndex(),
            Fields\Text::make('Title')
                ->sortable()
                ->rules(
                    [
                        'required',
                        'string',
                        'max:255'
                    ]
                )
                ->hideWhenCreating(),
            Fields\Text::make('Filename')
                ->sortable()
                ->rules(
                    [
                        'required',
                        'string',
                        'max:255'
                    ]
                )
                ->hideWhenCreating()
                ->hideWhenUpdating(),
            Fields\Text::make('Thumbnail')
                ->sortable()
                ->rules(
                    [
                        'required',
                        'string',
                        'max:255'
                    ]
                )
                ->hideFromIndex()
                ->hideWhenCreating()
                ->hideWhenUpdating(),
            Fields\Text::make('Size')
                ->sortable()
                ->rules(
                    [
                        'required',
                        'string',
                        'max:255'
                    ]
                )
                ->hideWhenCreating()
                ->hideWhenUpdating(),

        ];
    }

    /**
     * Get the cards available for the request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function cards(Request $request)
    {
        return [];
    }

    /**
     * Get the filters available for the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function filters(Request $request)
    {
        return [];
    }

    /**
     * Get the lenses available for the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function lenses(Request $request)
    {
        return [];
    }

    /**
     * Get the actions available for the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function actions(Request $request)
    {
        return [];
    }
}
