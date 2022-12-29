let mix = require('laravel-mix')
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/assets/js/app.js', 'public/js')
mix.js('resources/assets/js/tools/three.js', 'public/js/tools/three.js')
mix.scripts(['resources/assets/js/tools/suspension-geometry/ControlPanel.js'], 'public/js/tools/suspension-geometry/ControlPanel.js')
mix.scripts(['resources/assets/js/tools/suspension-geometry/Defaults.js'], 'public/js/tools/suspension-geometry/Defaults.js')
mix.scripts(['resources/assets/js/tools/suspension-geometry/Fork3D.js'], 'public/js/tools/suspension-geometry/Fork3D.js')
mix.scripts(['resources/assets/js/tools/suspension-geometry/Frame3D.js'], 'public/js/tools/suspension-geometry/Frame3D.js')
mix.scripts(['resources/assets/js/tools/suspension-geometry/Labels3D.js'], 'public/js/tools/suspension-geometry/Labels3D.js')
mix.scripts(['resources/assets/js/tools/suspension-geometry/SceneInitializer.js'], 'public/js/tools/suspension-geometry/SceneInitializer.js')
mix.scripts(['resources/assets/js/tools/suspension-geometry/Tire3D.js'], 'public/js/tools/suspension-geometry/Tire3D.js')

mix.scripts(['resources/assets/js/tools/carburetor-tuning/ControlPanel.js'], 'public/js/tools/carburetor-tuning/ControlPanel.js')
mix.scripts(['resources/assets/js/tools/carburetor-tuning/SceneInitializer.js'], 'public/js/tools/carburetor-tuning/SceneInitializer.js')
mix.scripts(['resources/assets/js/tools/carburetor-tuning/Chart.js'], 'public/js/tools/carburetor-tuning/Chart.js')
mix.scripts(['resources/assets/js/tools/carburetor-tuning/chart-elements/ChartElement.js'], 'public/js/tools/carburetor-tuning/chart-elements/ChartElement.js')
mix.scripts(['resources/assets/js/tools/carburetor-tuning/chart-elements/FuelMap.js'], 'public/js/tools/carburetor-tuning/chart-elements/FuelMap.js')
mix.scripts(['resources/assets/js/tools/carburetor-tuning/chart-elements/IdleCircuit.js'], 'public/js/tools/carburetor-tuning/chart-elements/IdleCircuit.js')
mix.scripts(['resources/assets/js/tools/carburetor-tuning/chart-elements/MainFuelJet.js'], 'public/js/tools/carburetor-tuning/chart-elements/MainFuelJet.js')
mix.scripts(['resources/assets/js/tools/carburetor-tuning/chart-elements/NeedleClipPosition.js'], 'public/js/tools/carburetor-tuning/chart-elements/NeedleClipPosition.js')
mix.scripts(['resources/assets/js/tools/carburetor-tuning/chart-elements/NeedleDiameter.js'], 'public/js/tools/carburetor-tuning/chart-elements/NeedleDiameter.js')
mix.scripts(['resources/assets/js/tools/carburetor-tuning/chart-elements/NeedleTaper.js'], 'public/js/tools/carburetor-tuning/chart-elements/NeedleTaper.js')
mix.scripts(['resources/assets/js/tools/carburetor-tuning/chart-elements/ThrottlePosition.js'], 'public/js/tools/carburetor-tuning/chart-elements/ThrottlePosition.js')
mix.scripts(['resources/assets/js/tools/carburetor-tuning/chart-elements/exhaust-mods/DrilledStock.js'], 'public/js/tools/carburetor-tuning/chart-elements/exhaust-mods/DrilledStock.js')
mix.scripts(['resources/assets/js/tools/carburetor-tuning/chart-elements/exhaust-mods/FullExhaust.js'], 'public/js/tools/carburetor-tuning/chart-elements/exhaust-mods/FullExhaust.js')
mix.scripts(['resources/assets/js/tools/carburetor-tuning/chart-elements/exhaust-mods/SlipOns.js'], 'public/js/tools/carburetor-tuning/chart-elements/exhaust-mods/SlipOns.js')
mix.scripts(['resources/assets/js/tools/carburetor-tuning/chart-elements/intake-mods/BetterFilter.js'], 'public/js/tools/carburetor-tuning/chart-elements/intake-mods/BetterFilter.js')
mix.scripts(['resources/assets/js/tools/carburetor-tuning/chart-elements/intake-mods/HeavyBreatherIntake.js'], 'public/js/tools/carburetor-tuning/chart-elements/intake-mods/HeavyBreatherIntake.js')
mix.scripts(['resources/assets/js/tools/carburetor-tuning/chart-elements/intake-mods/PodFilters.js'], 'public/js/tools/carburetor-tuning/chart-elements/intake-mods/PodFilters.js')
mix.scripts(['resources/assets/js/tools/carburetor-tuning/chart-elements/problems/AirLeakAirBox.js'], 'public/js/tools/carburetor-tuning/chart-elements/problems/AirLeakAirBox.js')
mix.scripts(['resources/assets/js/tools/carburetor-tuning/chart-elements/problems/AirLeakCarbBoots.js'], 'public/js/tools/carburetor-tuning/chart-elements/problems/AirLeakCarbBoots.js')
mix.scripts(['resources/assets/js/tools/carburetor-tuning/chart-elements/problems/AirLeakExhaust.js'], 'public/js/tools/carburetor-tuning/chart-elements/problems/AirLeakExhaust.js')

mix.sass('resources/assets/sass/app.scss', 'public/css')
mix.styles('resources/assets/css/style.css', 'public/css/style.css')
    .styles('resources/assets/css/large-style.css', 'public/css/large-style.css')
    .styles('resources/assets/css/pages/about-style.css', 'public/css/pages/about-style.css')
    .styles('resources/assets/css/pages/home-style.css', 'public/css/pages/home-style.css')
    .styles('resources/assets/css/pages/article-style.css', 'public/css/pages/article-style.css')
    .styles('resources/assets/css/pages/articles-style.css', 'public/css/pages/articles-style.css')
    .styles('resources/assets/css/pages/links-style.css', 'public/css/pages/links-style.css')
    .styles('resources/assets/css/pages/tool-style.css', 'public/css/pages/tool-style.css')
    .styles(
        'resources/assets/css/pages/tools/engineChecklist-style.css',
        'public/css/pages/tools/engineChecklist-style.css',
    )
    .styles('resources/assets/css/pages/about-large-style.css', 'public/css/pages/about-large-style.css')
    .styles('resources/assets/css/pages/home-large-style.css', 'public/css/pages/home-large-style.css')
    .styles('resources/assets/css/pages/article-large-style.css', 'public/css/pages/article-large-style.css')
    .styles('resources/assets/css/pages/articles-large-style.css', 'public/css/pages/articles-large-style.css')
    .styles('resources/assets/css/pages/links-large-style.css', 'public/css/pages/links-large-style.css')
    .styles('resources/assets/css/pages/tool-large-style.css', 'public/css/pages/tool-large-style.css')
    .styles(
        'resources/assets/css/pages/tools/engineChecklist-large-style.css',
        'public/css/pages/tools/engineChecklist-large-style.css',
    )
