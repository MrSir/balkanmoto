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
            <div id="control-panel">
                <div id="control-panel-left"></div>
                <div id="control-panel-right"></div>
            </div>
        </div>
        <script type="module">
            import * as THREE from 'three';
            import * as THREE_Addons from 'three/addons';
            import * as SI from 'sceneInitializer';
            import * as CP from 'controlPanel';
            import * as Fork3D from 'fork3D';

            const floorY = -500

            let container = document.getElementById('canvas')
            let cpLeftContainer = document.getElementById('control-panel-left')
            let cpRightContainer = document.getElementById('control-panel-right')
            let scene = new THREE.Scene()
            scene.background = new THREE.Color( 0xa0a0a0 );

            let sceneInitializer = new SI.SceneInitializer(scene, container, floorY)
            sceneInitializer.initializeScene()

            let loader = new THREE_Addons.FontLoader()
            loader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
                let fork1 = new Fork3D.Fork(
                    floorY,
                    -400,  0,
                    42, 1000,
                    10,
                    200,
                    200,
                    0,
                    80,
                    0
                )
                fork1.buildFork().addToObject(scene)

                let controlPanelLeft = new CP.ControlPanel(cpLeftContainer, scene, fork1)

                let fork2 = new Fork3D.Fork(
                    floorY,
                    400,  0,
                    42, 1000,
                    10,
                    200,
                    200,
                    0,
                    80,
                    0
                )
                fork2.buildFork().addToObject(scene)

                let controlPanelRight = new CP.ControlPanel(cpRightContainer, scene, fork2)
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