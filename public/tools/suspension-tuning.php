<!doctype html>
<html lang="en-ca">
<head>
    <?php include("../theme/header-meta.php"); ?>

    <link href="/css/pages/tool-style.css" rel="stylesheet">
    <link href="/css/pages/tool-large-style.css" rel="stylesheet">
    <script type="importmap">
        {
            "imports": {
                "three": "/js/tools/three/three.module.js",
                "three/addons": "/js/tools/three/addons/Addons.js",
                "three/gui": "/js/tools/three/addons/libs/lil-gui.module.min.js",
                "sceneInitializer": "/js/tools/suspension-tuning/SceneInitializer.js",
                "cp": "/js/tools/suspension-tuning/cp.js",
                "scp": "/js/tools/suspension-tuning/scp.js",
                "geometry": "/js/tools/suspension-tuning/Geometry.js",
                "fork": "/js/tools/suspension-tuning/fork.js",
                "spring": "/js/tools/suspension-tuning/spring.js",
                "tire": "/js/tools/suspension-tuning/tire.js"
            }
        }
    </script>

    <meta name="keywords" content="fork suspension,motorcycle suspension calculator,suspension tuning">
</head>
<body>
<div class="content container-grid">
    <?php include("../theme/menu.php"); ?>
    <?php include("../theme/header.php"); ?>
    <div class="divider">SUSPENSION TUNING</div>
    <div class="content-grid">
        <div id="info">
            <h2>Parameters</h2>
            <ul>
                <li>TBD</li>
            </ul>

            <h2>Mouse Controls</h2>
            You can use your mouse to fully navigate the 3D space
            <ul>
                <li>Left Click and Drag: this will rotate the camera around the viewing point</li>
                <li>Right Click and Drag: this will drag the camera around along with its viewing point</li>
                <li>Scroll: this will zoom the camera in and out</li>
            </ul>

            <h2>DISCLAIMER</h2>
            This is an educational tool based on simple high school geometry, that simulates reality. As such it is not a 100% true representation of reality and should not be used as the sole truth of what would happen. Please do your own math and measurements before modifying the suspension of your motorcycle. Improper configurations will result in serious injury or death.
        </div>
        <br/>
        <div id="small-screen-warning">Your screen is too small to view the canvas.</div>
        <div id="canvas">
            <div id="control-panel-left"></div>
            <div id="control-panel-right"></div>
            <div id="scene-control-panel"></div>
            <div id="control-panels">

            </div>
        </div>
        <script type="module">
            import * as THREE from 'three';
            import * as THREE_Addons from 'three/addons';
            import {Tween, Easing} from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js'
            import * as SI from 'sceneInitializer';
            import {SceneControlPanel} from 'scp';
            import {ControlPanel} from 'cp';
            import {Geometry} from 'geometry';

            const floorY = -500

            let container = document.getElementById('canvas')
            let cpLeftContainer = document.getElementById('control-panel-left')
            let cpRightContainer = document.getElementById('control-panel-right')
            let scpContainer = document.getElementById('scene-control-panel')
            let scene = new THREE.Scene()
            scene.background = new THREE.Color( 0xa0a0a0 );

            let sceneInitializer = new SI.SceneInitializer(scene, container, floorY)
            sceneInitializer.initializeScene()

            let loader = new THREE_Addons.FontLoader()
            loader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
                let frameParameters = {
                    rake: 27,
                    wheelbase: 1590,
                    weight: 205,
                    rider: {
                        weight: 90,
                        gearWeight: 5,
                    },
                    frontTire: {
                      width:  90,
                      aspect: 90,
                      rimDiameterInInches: 21,
                    },
                    rearTire: {
                      width:  150,
                      aspect: 70,
                      rimDiameterInInches: 18,
                    },
                    tripleTree: {
                        rake: 0,
                        width: 200,
                        offset: 60,
                        stemLength: 200,
                        topYokeThickness: 20,
                        bottomYokeThickness: 30,
                    },
                    fork: {
                      diameter: 43,
                      length: 927,
                      travel: 210,
                      offset: 3,
                      stanchionTubeLength: 561,
                      outerTubeLength: 562,
                      spring: {
                        rate: 6.0,
                        length: 425,
                        preload: 0.0,
                      },
                      oilWeight: 10,
                      compressionDamping: 0,
                      reboundDamping: 0,
                    }
                }

                const xOffset = -1000
                const leftOffset = -400
                const rightOffset = 400

                let geometryLeft = new Geometry(JSON.parse(JSON.stringify(frameParameters)), floorY, font, xOffset, leftOffset, -Math.PI / 2)
                geometryLeft.initialize()
                scene.add(geometryLeft.pivot)
                let controlPanelLeft = new ControlPanel(cpLeftContainer, scene, geometryLeft)

                let geometryRight = new Geometry(JSON.parse(JSON.stringify(frameParameters)), floorY, font, xOffset, rightOffset, -Math.PI / 2)
                geometryRight.initialize()
                scene.add(geometryRight.pivot)
                let controlPanelRight = new ControlPanel(cpRightContainer, scene, geometryRight)

                let sceneControlPanel = new SceneControlPanel(scpContainer, scene, [geometryLeft, geometryRight])
            })


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
    </div>
    <?php include("../theme/footer.php"); ?>
</div>
</body>
</html>