@extends('theme.master')

@section('page-header')
    <link href="/css/pages/tool-style.css" rel="stylesheet">
    <link href="/css/pages/tool-large-style.css" rel="stylesheet">
    <script src="/js/tools/three.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/ControlPanel.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/ChartElement.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/ThrottlePosition.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/Chart.js" type="application/javascript"></script>
    <script src="/js/tools/carburetor-tuning/SceneInitializer.js" type="application/javascript"></script>
    <meta name="keywords" content="carburetor tunning,carburetor,jets,rejetting,needle shims">
@endsection

@section('content')
    <div id="info">
        <h1>Carburetor Tuning</h1>
        TBD ...
    </div>
    <br/>
    <div id="small-screen-warning">Your screen is too small to view the canvas.</div>
    <div id="canvas">
        <div id="control-panel"></div>
    </div>
    <script type="module">
        const floorY = -500

        let container = document.getElementById('canvas')
        let scene = new THREE.Scene()
        scene.background = new THREE.Color( 0xa0a0a0 );

        let sceneInitializer = new SceneInitializer(scene, container, floorY)
        sceneInitializer.initializeScene()

        let loader = new THREE.FontLoader()
        loader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
            let chart = new Chart(scene, sceneInitializer.renderer, sceneInitializer.camera, font, 2000, 1500, floorY)
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