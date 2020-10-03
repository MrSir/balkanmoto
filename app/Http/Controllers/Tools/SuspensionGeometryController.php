<?php

namespace App\Http\Controllers\Tools;

class SuspensionGeometryController
{
    public function __invoke()
    {
        return view(
            'pages.tools.suspensionGeometry',
            [
                'headerText' => 'Suspension Geometry',
            ]
        );
    }
}