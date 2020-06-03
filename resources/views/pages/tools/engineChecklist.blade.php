@extends('theme.master')

@section('page-header')
    <link href="/css/pages/tools/engineChecklist-style.css" rel="stylesheet">
    <link href="/css/pages/tools/engineChecklist-large-style.css" rel="stylesheet">
    <script src="/js/tools/three.js" type="application/javascript"></script>
@endsection

@section('content')
    <div id="canvas"></div>
    <script type="module">
        let container = document.getElementById('canvas')
        let scene = new THREE.Scene()

        let camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000)
        camera.position.z = 5

        let renderer = new THREE.WebGLRenderer()
        renderer.setSize(container.offsetWidth, container.offsetHeight)
        var gui = new THREE.GUI({ autoPlace: false });
        container.appendChild(gui.domElement);
        container.appendChild(renderer.domElement)

        let geometry = new THREE.BoxGeometry(1, 1, 1)
        let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        let cube = new THREE.Mesh(geometry, material)
        scene.add(cube)

        let controls = new THREE.OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.25
        controls.minDistance = 2;
        controls.maxDistance = 10;



        function togglePins() {
            pins = pinsFormation[ ~ ~ ( Math.random() * pinsFormation.length ) ];
        }

        var params = {
            enableWind: true,
            showBall: false,
            tooglePins: togglePins
        };
        gui.add( params, 'enableWind' );
        gui.add( params, 'showBall' );
        gui.add( params, 'tooglePins' );

        function onWindowResize() {
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( container.offsetWidth, container.offsetHeight );
        }

        window.addEventListener( 'resize', onWindowResize, false );

        let animate = function () {
            requestAnimationFrame(animate)

            controls.update()

            renderer.render(scene, camera)
        }

        animate()

        //TODO on window resize, keep canvas proportionate
    </script>
@endsection