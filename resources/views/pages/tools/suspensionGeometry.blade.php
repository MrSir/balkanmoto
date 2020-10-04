@extends('theme.master')

@section('page-header')
    <link href="/css/pages/tool-style.css" rel="stylesheet">
    <link href="/css/pages/tool-large-style.css" rel="stylesheet">
    <script src="/js/tools/three.js" type="application/javascript"></script>
    <script src="/js/tools/suspension-geometry/Tire3D.js" type="application/javascript"></script>
    <script src="/js/tools/suspension-geometry/Fork3D.js" type="application/javascript"></script>
    <script src="/js/tools/suspension-geometry/ControlPanel.js" type="application/javascript"></script>
@endsection

@section('content')
    <div id="canvas">
        <div id="control-panel"></div>
    </div>
    <script type="module">
        const floorY = -500

        let container = document.getElementById('canvas')
        let scene = new THREE.Scene()

        let camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.01, 100000)
        camera.position.set(0, 500, 1500)

        let renderer = new THREE.WebGLRenderer()
        renderer.setSize(container.offsetWidth, container.offsetHeight)
        renderer.shadowMap.enabled = true
        container.appendChild(renderer.domElement)

        let controls = new THREE.OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.25
        controls.minDistance = 1000
        controls.maxDistance = 100000

        let hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
        hemiLight.position.set(0, 20, 0)
        scene.add(hemiLight)

        let dirLight = new THREE.DirectionalLight(0xffffff)
        dirLight.position.set(200, 500, 1500)
        dirLight.castShadow = true
        dirLight.shadow.camera.top = 5000
        dirLight.shadow.camera.bottom = -5000
        dirLight.shadow.camera.left = -5000
        dirLight.shadow.camera.right = 5000
        dirLight.shadow.camera.near = 0.01
        dirLight.shadow.camera.far = 100000
        scene.add(dirLight)

        let floor = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(10000, 10000),
            new THREE.MeshPhongMaterial({color: 0xaaaaaaaaa, depthWrite: true,})
        )
        floor.rotation.x = -Math.PI / 2
        floor.position.y = floorY - 10
        floor.receiveShadow = true
        scene.add(floor)

        let rearTire = new Tire3D(scene, renderer, camera, floorY, 130, 90, 17)
        rearTire.setX(-785).calculateTorusSize().buildTorus().addToScene()

        let frontTire = new Tire3D(scene, renderer, camera, floorY, 110, 90, 18)
        frontTire.setX(758).calculateTorusSize().buildTorus().addToScene()

        let fork = new Fork3D(scene, renderer, camera, floorY, 37, 240, 1000, 25, 200, frontTire)
        fork.calculateFork().buildFork().addToScene()

        let controlPanel = new ControlPanel(document.getElementById('control-panel'))
        controlPanel.createTireFolder('Rear', {tireWidth: 130, tireAspect: 90, rimSize: 17}, rearTire)
            .createTireFolder('Front', {tireWidth: 110, tireAspect: 90, rimSize: 18}, frontTire, fork)
            .createFrameFolder({wheelbase: 1570}, rearTire, frontTire, fork)
            .createForkFolder({diameter: 37, width: 240, length: 1000, offset: 25, stemHeight: 200, rake: 26.5}, fork)

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
    </script>
@endsection