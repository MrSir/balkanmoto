@extends('theme.master')

@section('page-header')
    <link href="/css/pages/tool-style.css" rel="stylesheet">
    <link href="/css/pages/tool-large-style.css" rel="stylesheet">
    <script src="/js/tools/three.js" type="application/javascript"></script>
    <script src="/js/tools/suspension-geometry/Tire3D.js" type="application/javascript"></script>
    <script src="/js/tools/suspension-geometry/Fork3D.js" type="application/javascript"></script>
    <script src="/js/tools/suspension-geometry/ControlPanel.js" type="application/javascript"></script>
    <script src="/js/tools/suspension-geometry/Labels3D.js" type="application/javascript"></script>
    <script src="/js/tools/suspension-geometry/Frame3D.js" type="application/javascript"></script>
    <script src="/js/tools/suspension-geometry/SceneInitializer.js" type="application/javascript"></script>
    <script src="/js/tools/suspension-geometry/Defaults.js" type="application/javascript"></script>
@endsection

@section('content')
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

        let axisGeometry = new THREE.BufferGeometry().setFromPoints([
                                                                        new THREE.Vector3(-100, 0, 0),
                                                                        new THREE.Vector3(100, 0, 0),
                                                                    ])
        let axisMaterial = new THREE.MeshBasicMaterial({color: 0x000000})
        let xAxis = new THREE.Line(axisGeometry,axisMaterial)
        let yAxis = new THREE.Line(axisGeometry,axisMaterial)
        let zAxis = new THREE.Line(axisGeometry,axisMaterial)

        yAxis.rotateZ(Math.PI /2)
        zAxis.rotateY(Math.PI /2)

        scene.add(xAxis,yAxis,zAxis)

        let defaults = new Defaults()

        let frame = new Frame3D(scene, sceneInitializer.renderer, sceneInitializer.camera, floorY, defaults.findDefaults('1982 Honda V45 Saber'))
        frame.drawInScene()

        let controlPanel = new ControlPanel(document.getElementById('control-panel'), frame, defaults.findDefaults('1982 Honda V45 Saber'))

        function onWindowResize() {
            sceneInitializer.camera.aspect = container.offsetWidth / container.offsetHeight
            sceneInitializer.camera.updateProjectionMatrix()
            sceneInitializer.renderer.setSize(container.offsetWidth, container.offsetHeight)
        }

        window.addEventListener('resize', onWindowResize, false)

        let animate = function () {
            requestAnimationFrame(animate)

            sceneInitializer.controls.update()

            sceneInitializer.renderer.render(scene, sceneInitializer.camera)
        }

        animate()
    </script>
@endsection