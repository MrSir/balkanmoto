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

        let renderer = new THREE.WebGLRenderer({antialias: true})
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

        // frame parameters
        let frameParameters = {
            backboneLength: 1500,
            rake: 29.5,
            wheelbase: 1570,
            fork: {
                diameter: 37,
                width: 240,
                length: 830.2625,
                offset: 0,
                stemHeight: 200
            },
            frontTire: {
                width: 110,
                aspect: 90,
                rimDiameterInInches: 18
            },
            rearTire: {
                width: 130,
                aspect: 90,
                rimDiameterInInches: 17
            }
        }

        let frame = new Frame3D(scene, renderer, camera, floorY, frameParameters)

        //let fork = new Fork3D(scene, renderer, camera, floorY, 37, 240, 1000, 25, 200, frontTire)

        frame.drawInScene()



        //frontTire.setX(758).calculateTorusSize().buildTorus().addToScene()


        //fork.calculateFork().buildFork()
        let labels = null
        //let labels = new Labels3D(scene, renderer, camera, floorY, rearTire, frontTire)
        // labels.redrawInScene()

        let controlPanel = new ControlPanel(document.getElementById('control-panel'), labels, frame, frameParameters)

        // let a = Math.cos(THREE.MathUtils.degToRad(29.5)) * 1000
        // let b = 1570 - a
        // let c = Math.sin(THREE.MathUtils.degToRad(29.5)) * 1000
        //
        // let x = Math.sqrt(Math.pow(b,2) + Math.pow(c,2))
        // console.log(x - 25)

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