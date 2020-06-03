<?php

namespace App\Http\Controllers\Tools;

class EngineChecklistController
{
    public function __invoke()
    {
        return view(
            'pages.tools.engineChecklist',
            [
                'headerText' => 'Engine Checklist',
            ]
        );
    }
}