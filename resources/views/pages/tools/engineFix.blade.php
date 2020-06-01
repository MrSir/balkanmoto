@extends('theme.master')

@section('page-header')
    <link href="/css/pages/tools/engineFix-style.css" rel="stylesheet">
    <link href="/css/pages/tools/engineFix-large-style.css" rel="stylesheet">
    <script src="/js/three.js"></script>
@endsection

@section('content')
    <div id="canvas"></div>
    <script type="application/javascript">
      let container = document.getElementById('canvas')

      let scene = new THREE.Scene()
      let camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000)

      let renderer = new THREE.WebGLRenderer()
      renderer.setSize(container.offsetWidth, container.offsetHeight)

      container.appendChild(renderer.domElement)

      let geometry = new THREE.BoxGeometry(1, 1, 1)
      let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      let cube = new THREE.Mesh(geometry, material)
      scene.add(cube)

      camera.position.z = 5

      let animate = function () {
        requestAnimationFrame(animate)

        cube.rotation.x += 0.01
        cube.rotation.y += 0.01

        renderer.render(scene, camera)
      }

      animate()

      //TODO on window resize, keep canvas proportionate
    </script>
@endsection