@extends('theme.master')

@section('page-header')
    <link href="/css/pages/tool-style.css" rel="stylesheet">
    <link href="/css/pages/tool-large-style.css" rel="stylesheet">
    <script src="/js/tools/three.js" type="application/javascript"></script>
    <script src="/js/tools/suspension-geometry/Tire3D.js" type="application/javascript"></script>
@endsection

@section('content')
    <div id="canvas"></div>
    <script type="module">
        const floorY = -500

        let container = document.getElementById('canvas')
        let scene = new THREE.Scene()

        let camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.01, 100000)
        camera.position.set(0, 500, 1500)

        let renderer = new THREE.WebGLRenderer()
        renderer.setSize(container.offsetWidth, container.offsetHeight)
        renderer.shadowMap.enabled = true

        let hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
        hemiLight.position.set(0, 20, 0)
        scene.add(hemiLight)

        let floorGeometry = new THREE.PlaneGeometry(10000, 10000, 1, 1)
        let floorMaterial = new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: true })
        let floor = new THREE.Mesh(floorGeometry, floorMaterial)
        floor.rotation.x = -Math.PI / 2
        floor.position.y = floorY
        scene.add(floor)

        let rearTire = new Tire3D(scene, renderer, camera, floorY, 130, 90, 17)
        rearTire.setX(-785).calculateTorusSize().buildTorus().addToScene()

        let frontTire = new Tire3D(scene, renderer, camera, floorY, 110, 90, 18)
        frontTire.setX(758).calculateTorusSize().buildTorus().addToScene()

        // function loadModel() {
        //     object.traverse(function (child) {
        //         if (child.isMesh) {
        //             child.material = new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: true } )
        //         }
        //     })
        //     // object.position.y = 0
        //     scene.add(object)
        // }
        //
        // var manager = new THREE.LoadingManager(loadModel)
        //
        // manager.onProgress = function (item, loaded, total) {
        //     console.log(item, loaded, total)
        // }
        //
        // function onProgress(xhr) {
        //     if (xhr.lengthComputable) {
        //         var percentComplete = xhr.loaded / xhr.total * 100
        //         console.log('model ' + Math.round(percentComplete, 2) + '% downloaded')
        //     }
        // }

        // function onError() {
        // }

        // piston
        // var loader = new THREE.OBJLoader(manager)
        // loader.load('/models/piston.obj', function (obj) {
        //     object = obj
        // }, onProgress, onError)

        let controls = new THREE.OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.25
        controls.minDistance = 1000
        controls.maxDistance = 100000

        let gui = new THREE.GUI({})
        container.appendChild(gui.domElement)
        container.appendChild(renderer.domElement)

        let params = {
            'Rear Tire Width': 130,
            'Rear Tire Aspect': 90,
            'Rear Rim Size': 17,
            'Front Tire Width': 110,
            'Front Tire Aspect': 90,
            'Front Rim Size': 18,
            'Wheelbase': 1570
        }

        let rearTireFolder = gui.addFolder('Rear Tire')
        rearTireFolder.add(params, 'Rear Tire Width', 90, 320, 5).listen().onChange(function (width) {
            rearTire.setWidth(width).redrawInScene()
        })
        rearTireFolder.add(params, 'Rear Tire Aspect', 45, 95, 5).listen().onChange(function (aspect) {
            rearTire.setAspect(aspect).redrawInScene()
        })
        rearTireFolder.add(params, 'Rear Rim Size', 13, 22, 1).listen().onChange(function (rimDiameterInInches) {
            rearTire.setRimDiameterInInches(rimDiameterInInches).redrawInScene()
        })

        let frontTireFolder = gui.addFolder('Front Tire')
        frontTireFolder.add(params, 'Front Tire Width', 90, 320, 5).listen().onChange(function (width) {
            frontTire.setWidth(width).redrawInScene()
        })
        frontTireFolder.add(params, 'Front Tire Aspect', 45, 95, 5).listen().onChange(function (aspect) {
            frontTire.setAspect(aspect).redrawInScene()
        })
        frontTireFolder.add(params, 'Front Rim Size', 13, 22, 1).listen().onChange(function (rimDiameterInInches) {
            frontTire.setRimDiameterInInches(rimDiameterInInches).redrawInScene()
        })

        let frameFolder = gui.addFolder('Frame')
        frameFolder.add(params, 'Wheelbase', 1300, 1800, 1).listen().onChange(function (wheelbase) {
            rearTire.setX(-wheelbase/2).redrawInScene()
            frontTire.setX(wheelbase/2).redrawInScene()
        })

        rearTireFolder.open()
        frontTireFolder.open()
        frameFolder.open()

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