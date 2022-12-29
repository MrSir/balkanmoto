<?php

namespace App\Http\Controllers\Tools;

class CarburetorTuningController
{
    public function __invoke()
    {
        return view(
            'pages.tools.carburetorTuning',
            [
                'headerText' => 'Carburetor Tuning',
            ]
        );
    }
}