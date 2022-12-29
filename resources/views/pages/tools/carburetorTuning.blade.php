@extends('theme.master')

@section('page-header')
    <link href="/css/pages/tool-style.css" rel="stylesheet">
    <link href="/css/pages/tool-large-style.css" rel="stylesheet">
    <script src="/js/tools/three.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/ControlPanel.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/chart-elements/ChartElement.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/chart-elements/ThrottlePosition.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/chart-elements/IdleCircuit.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/chart-elements/MainFuelJet.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/chart-elements/NeedleClipPosition.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/chart-elements/NeedleDiameter.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/chart-elements/NeedleTaper.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/chart-elements/intake-mods/BetterFilter.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/chart-elements/intake-mods/HeavyBreatherIntake.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/chart-elements/intake-mods/PodFilters.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/chart-elements/exhaust-mods/DrilledStock.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/chart-elements/exhaust-mods/SlipOns.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/chart-elements/exhaust-mods/FullExhaust.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/chart-elements/problems/AirLeakAirBox.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/chart-elements/problems/AirLeakCarbBoots.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/chart-elements/problems/AirLeakExhaust.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/chart-elements/FuelMap.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/Chart.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/SceneInitializer.js" type="application/javascript"></script>
    <meta name="keywords" content="carburetor tunning,carburetor,jets,rejetting,needle shims">
@endsection

@section('content')
    <div id="info">
        <h1>Carburetor Tuning</h1>
        <p>
            Carburetor Tuning is one of those things that seems like black magic or engine whispering. In reality however it's deeply rooted in physics and engineering and boils down to balancing the Air/Fuel ratio for the entire operating range. When it comes to CV (Continuous Velocity) type carburetors there really is only a few factors that can affect performance. Since these simple devices make use of <a href="https://en.wikipedia.org/wiki/Bernoulli%27s_principle">Bernoulli's Principle</a> to achieve mixture atomization, the components that dictate how much air or fuel the carburetor can make use of are the ones we are interested in. Typically these components are designed to affect the mixture at different levels of the throttle being open. Below you can find these components and their effects.
        </p>
        <ul>
            <li>
                0-25% Open
                <ul>
                    <li>
                        Pilot Fuel Jet: The fuel jet used to control the amount of fuel the carburetor is able to access under start up and idle conditions. They are typically very small and can easily be clogged by modern fuels if left to sit for long periods of time. This is the primary reason a carbureted motorcycle with spark and compression would have a hard time starting or idling.
                    </li>
                    <li>
                        Pilot Mixture Screw: This is the primary tuning tool that comes built in on pretty much every CV carburetor. The screw adjustment controls the amount of fuel allowed to be sucked up through the entire throttle range with the biggest impact at the initial start up and idling. Adjusting the mixture screw can help fine tune and correct lean/rich conditions in the operation of the carburetors. In a lot of cases simply adjusting the mixture screw is enough to correct the performance of the carburetors without actually swaping out other components.
                    </li>
                </ul>
            </li>
            <li>
                25%-75% Open
                <ul>
                    <li>
                        Jet Needle Diameter: Since the jet needle is essentially used to plug the main fuel jet, it's diameter (measured at the thickest part) greatly determines how effectively it does just that. By replacing the needle with a thicker/thinner one, one can control the fuel mixture when the throttle is right at the beginning of the throttle range. The biggest impact can be felt at 12.5%-37.5% of open throttle.
                    </li>
                    <li>
                        Jet Needle Clip Position: The Jet Needle Clip determines how high the needle will sit at rest. This by extension determines how much of the opening of the main fuel jet is clear for fuel to go through. Typically these come with 5 positions to put the needle clip. The top one being the leanest (pushing needle further down), and the bottom one the richest (pulling the needle the furthest up). Adjustments to the position of the Jet Needle Clip affect the next part of throttle operation range, from 25%-55%.
                    </li>
                    <li>
                        Jet Needle Taper: The last characteristic of the jet needle is it's taper. This determines the angle at which the needle gets narrower with. A needle with less taper would typically be longer as well. Controlling the taper allows for changes to the air fuel ratio in the 40%-75% range.
                    </li>
                </ul>
            </li>
            <li>
                75%-100% Open
                <ul>
                    <li>
                        Main Fuel Jet: Similar to the Pilot Fuel Jet, the Main Fuel Jet controls the amount of fuel the carburetor is able to access. The difference here is that it plays a row into the 3/4 to wide open throttle conditions instead. Typically replacing the intake components or the exhaust on a carbureted motorcycle would require these be replaced in order to compensate for the much higher air flow. Without upgrading them you would not be able to dial away the lean operations with just the mixture screw.
                    </li>
                </ul>
            </li>
        </ul>
        <p>There are other factors involved in the operation of the Carburetors like Throttle Valve Cutaway and Straight Diameter, however these typically involve replacing the entire carburetor. For the purposes of this tool, we will assume them to be constant.</p>
        <p>DISCLAIMER: The below tool is meant to simulate the effects of making different changes to the carburetors. It is by no means a true simulation and should not be used for anything other than educational purposes. It was built based on the research I have done myself combined with some simply graphing and mathematics. The adjustable values are simply for demonstration purposes, and do not necessarily reflect real world numbers.</p>
    </div>
    <br/>
    <div id="small-screen-warning">Your screen is too small to view the canvas.</div>
    <div id="canvas">
        <div id="control-panel"></div>
    </div>
    <script type="module">
        const z = -500

        let container = document.getElementById('canvas')
        let scene = new THREE.Scene()
        scene.background = new THREE.Color( 0xa0a0a0 );

        let sceneInitializer = new SceneInitializer(scene, container, z)
        sceneInitializer.initializeScene()

        let loader = new THREE.FontLoader()
        loader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
            let chart = new Chart(scene, sceneInitializer.renderer, sceneInitializer.camera, font, 2000, 1500, z)
            chart.drawChart()

            let controlPanel = new ControlPanel(document.getElementById('control-panel'), chart)
        })

        function onWindowResize() {
            sceneInitializer.camera.aspect = container.offsetWidth / container.offsetHeight
            sceneInitializer.camera.updateProjectionMatrix()
            sceneInitializer.renderer.setSize(container.offsetWidth, container.offsetHeight)
        }

        window.addEventListener('resize', onWindowResize, false)

        let animate = function () {
            requestAnimationFrame(animate)

            sceneInitializer.renderer.render(scene, sceneInitializer.camera)
        }

        animate()
    </script>
@endsection