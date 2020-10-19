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
    <meta name="keywords" content="fork suspension,motorcycle suspension calculator,suspension calculator,trail calculator">
@endsection

@section('content')
    <div id="info">
        <h1>Suspension Geometry</h1>
        <h2>Parameters</h2>
        <ul>
            <li>Stem Rake (deg): this is the angle between the frame and the fork stem, measured in degrees.</li>
            <li>Wheelbase (mm): the distance across the ground from the rear axle to the front axle, measured in millimeters. This is only available when initializing a Custom frame</li>
            <li>Fork Length (mm): this is the length of the fork tubes from the center of the mounting point to the top of the top yoke, measured in millimeters</li>
            <li>Fork Offset (mm): this is the perpendicular distance between the center of the fork stem and the center of the fork tubes, measured in millimeters</li>
            <li>Triple Tree Rake (deg): this is the angle the triple trees add to the overall geometry, measured in degrees</li>
            <li>Front Tire Width (mm): this is simply how wide the tire is, measured in millimeters</li>
            <li>Front Tire Aspect: this is the aspect ratio used to compute the height of the tire</li>
            <li>Front Rim Size (in): this is the rim diameter, measured in inches</li>
            <li>Rear Tire Width (mm): this is simply how wide the tire is, measured in millimeters</li>
            <li>Rear Tire Aspect: this is the aspect ratio used to compute the height of the tire</li>
            <li>Rear Rim Size (in): this is the rim diameter, measured in inches</li>
        </ul>
        <h3>Visual Aid Parameters</h3>
        While these parameters do not affect the geometry in any way they do help with the visualization of the final result.
        <ul>
            <li>Stem Length (mm): this is simply the length of the fork stem measured in millimeters</li>
            <li>Fork Diameter (mm): this is simply the thickness (diameter) of the forks measured in millimeters</li>
            <li>Fork Width (mm): this is the space between the two fork tubes, measured in millimeters from the center to center</li>
        </ul>
        <h3>Parameters NOT considered</h3>
        <ul>
            <li>Rear Suspension geometry is completely omitted in this first version. (This might not matter if you are computing things for a hard tail)</li>
            <li>There is no gravitational simulations, so suspension sag, and changes in geometry due to rider weight are not considered</li>
            <li>While the geometry simulation doesn't consider the cases of offset front axle mounting point from below the fork tubes, it can still be simulated if you were to do the math to compute the triple tree rake</li>
        </ul>
        These items are excluded in this initial version of the tool for simplicity, since they complicate the mathematics behind the simulation significantly.
        They will likely be added in future versions.

        <h2>Simulated Result</h2>
        With this tool you would be able to visualize the relative changes to suspension geometry of your motorcycle. The simulation will compute these values:
        <ul>
            <li>Wheelbase: the distance across the ground from the rear axle to the front axle</li>
            <li>Rake: the absolute angle between the vertical and the fork stem</li>
            <li>Trail: the distance across the ground from the front axle to the intersecting point of the ground and the straight line drawn through the fork stem</li>
        </ul>
        For more details on what those numbers, and the parameters mean check out the write up article [Coming Soon ...]

        <h2>View Toggles</h2>
        The controls in the tool also provide some viewing toggles to help you see what matters most to you.
        <ul>
            <li>Show Geometry: this toggle will show/hide the important geometric lines, to help you understand what is actually going on as you configure the setup</li>
            <li>Show Labels: this toggle will show/hide the simulated results in the form of lines with dynamic labels on them.</li>
            <li>Transparent Objects: with all the labels and geometry it may become hard to see things, this toggle will make the 3D objects 75% transparent.</li>
        </ul>

        <h2>Mouse Controls</h2>
        You can use your mouse to fully navigate the 3D space
        <ul>
            <li>Left Click and Drag: this will rotate the camera around the viewing point</li>
            <li>Right Click and Drag: this will drag the camera around along with its viewing point</li>
            <li>Scroll: this will zoom the camera in and out</li>
        </ul>

        <h2>DISCLAIMER</h2>
        This is an educational tool based on simple high school geometry, that simulates reality. As such it is not a 100% true representation of reality
        and should not be used as the sole truth of what would happen. Please do your own math and measurements before modifying the suspension geometry
        of your motorcycle. Improper configurations will result in serious injury or death.
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

        let defaults = new Defaults()

        let loader = new THREE.FontLoader()
        loader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
            let frame = new Frame3D(scene, sceneInitializer.renderer, sceneInitializer.camera, floorY, defaults.findDefaults('Custom'), font)

            let controlPanel = new ControlPanel(document.getElementById('control-panel'), frame, defaults.findDefaults('Custom'))
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
@endsection