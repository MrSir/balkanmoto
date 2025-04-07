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
                "controlPanel": "/js/tools/suspension-tuning/ControlPanel.js",
                "sceneControlPanel": "/js/tools/suspension-tuning/SceneControlPanel.js",
                "frame3D": "/js/tools/suspension-tuning/Frame3D.js",
                "fork3D": "/js/tools/suspension-tuning/Fork3D.js",
                "spring3D": "/js/tools/suspension-tuning/Spring3D.js",
                "tire3D": "/js/tools/suspension-tuning/Tire3D.js"
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
            import * as SCP from 'sceneControlPanel';
            import * as CP from 'controlPanel';
            import * as Frame3D from 'frame3D';
            import * as Fork3D from 'fork3D';

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
                    rake: 30,
                    wheelbase: 1590,
                    load: {
                        motorcycleWeight: 205,
                        riderWeight: 95
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
                        offset: 60,
                        rake: 0,
                        stemLength: 200,
                        topYokeThickness: 20,
                        bottomYokeThickness: 30,
                    },
                    fork: {
                      diameter: 43,
                      stanchionTubeLength: 561,
                      outerTubeLength: 562,
                      length: 927,
                      offset: 3,
                      width: 200,
                      travel: 210,
                      spring: {
                        rate: 6.0,
                        length: 425
                      },
                      preload: 0,
                      compressionDamping: 0,
                      reboundDamping: 0,
                      compression: 0,
                    }
                }


                let frame1 = new Frame3D.Frame(floorY, JSON.parse(JSON.stringify(frameParameters)), -400)
                frame1.addToObject(scene)
                let controlPanelLeft = new CP.ControlPanel(cpLeftContainer, scene, frame1)

                let frame2 = new Frame3D.Frame(floorY, JSON.parse(JSON.stringify(frameParameters)), 400)
                frame2.addToObject(scene)
                let controlPanelRight = new CP.ControlPanel(cpRightContainer, scene, frame2)

                let sceneControlPanel = new SCP.SceneControlPanel(scpContainer, scene, [frame1, frame2])
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