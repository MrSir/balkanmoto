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
        let object;

        let camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000)
        camera.position.z = 100
        camera.position.x = 100

        let renderer = new THREE.WebGLRenderer()
        renderer.setSize(container.offsetWidth, container.offsetHeight)
        renderer.shadowMap.enabled = true;

        var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
        hemiLight.position.set( 0, 20, 0 );
        scene.add( hemiLight );

        var gui = new THREE.GUI({ autoPlace: false })
        container.appendChild(gui.domElement)
        container.appendChild(renderer.domElement)

        // simple cube
        // let geometry = new THREE.BoxGeometry(1, 1, 1)
        // let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        // let cube = new THREE.Mesh(geometry, material)
        // scene.add(cube)

        // manager

        function loadModel() {
            object.traverse(function (child) {
                if (child.isMesh) {
                    child.material = new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: true } )
                }
            })
            // object.position.y = 0
            scene.add(object)
        }

        var manager = new THREE.LoadingManager(loadModel)

        manager.onProgress = function (item, loaded, total) {
            console.log(item, loaded, total)
        }

        function onProgress(xhr) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100
                console.log('model ' + Math.round(percentComplete, 2) + '% downloaded')
            }
        }

        function onError() {
        }

        // piston
        var loader = new THREE.OBJLoader(manager)
        loader.load('/models/piston.obj', function (obj) {
            object = obj
        }, onProgress, onError)

        let controls = new THREE.OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.25
        controls.minDistance = 100
        controls.maxDistance = 1000

        function togglePins() {
            pins = pinsFormation[~~(Math.random() * pinsFormation.length)]
        }

        var params = {
            enableWind: true,
            showBall: false,
            tooglePins: togglePins,
        }
        gui.add(params, 'enableWind')
        gui.add(params, 'showBall')
        gui.add(params, 'tooglePins')

        function onWindowResize() {
            camera.aspect = container.offsetWidth / container.offsetHeight
            camera.updateProjectionMatrix()
            renderer.setSize(container.offsetWidth, container.offsetHeight)
        }

        window.addEventListener('resize', onWindowResize, false)

        let animate = function () {
            requestAnimationFrame(animate)

            controls.update()

            renderer.render(scene, camera)
        }

        animate()

        //TODO on window resize, keep canvas proportionate
    </script>
@endsection