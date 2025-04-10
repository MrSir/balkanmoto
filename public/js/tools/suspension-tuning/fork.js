import * as THREE from 'three';
import {Spring} from 'spring';

export class Fork {
    constructor(geometry) {
        this.geometry = geometry;

        this.forkGeometry = geometry.fork.dimensions;
        this.tripleTreeGeometry = geometry.tripleTree.dimensions;

        this.forkMaterial = new THREE.MeshPhongMaterial({
            color: 0x333333333,
            transparent: false,
            opacity: 0.5,
            depthWrite: true,
            depthTest: true,
        })

        this.tripleTreeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xc4c4c4,
            roughness: 0.2,
            metalness: 1.0,
            transparent: false,
            opacity: 0.5,
            depthWrite: true,
            depthTest: true,
            flatShading: false,
        })

        this.goldForkTubeMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            emissive: 0x000000,
            metalness: 1.0,
            roughness: 0.2,
            transparent: true,
            opacity: 0.8,
            depthWrite: true,
            depthTest: true,
        })

        this.silverForkTubeMaterial = new THREE.MeshStandardMaterial({
            color: 0xc4c4c4,
            emissive: 0x000000,
            metalness: 1.0,
            roughness: 0.2,
            transparent: true,
            opacity: 0.8,
            depthWrite: true,
            depthTest: true,
        })
    }

    setTransparency(toggle) {
        this.goldForkTubeMaterial.transparent = toggle
        this.goldForkTubeMaterial.opacity = toggle ? 0.5 : 1
        this.silverForkTubeMaterial.transparent = toggle
        this.silverForkTubeMaterial.opacity = toggle ? 0.5 : 1
        this.tripleTreeMaterial.transparent = toggle
        this.tripleTreeMaterial.opacity = toggle ? 0.5 : 1

        return this
    }

    buildWheelAxle() {
        let geometry = new THREE.CylinderGeometry(10, 10, this.tripleTreeGeometry.width, 32, 1)

        let mesh = new THREE.Mesh(geometry, this.forkMaterial)
        mesh.castShadow = true
        mesh.rotateX(Math.PI / 2)

        return mesh
    }

    buildForkTube() {
        let geometry = new THREE.CylinderGeometry(
            this.forkGeometry.radius + 3,
            this.forkGeometry.radius + 3,
            this.forkGeometry.outerTubeLength,
            32,
            1
        )

        let mesh = new THREE.Mesh(geometry, this.goldForkTubeMaterial)
        mesh.castShadow = true

        return mesh
    }

    buildForkInsideTube() {
        let geometry = new THREE.CylinderGeometry(
            this.forkGeometry.radius,
            this.forkGeometry.radius,
            this.forkGeometry.stanchionTubeLength,
            32,
            1
        )

        let mesh = new THREE.Mesh(geometry, this.silverForkTubeMaterial)
        mesh.castShadow = true

        return mesh
    }

    buildSpring() {
        let thickness_ratio = this.geometry.spring.dimensions.rate / 6.0
        let thickness = 2.0 * thickness_ratio

        let diameter_ratio = 38 / (38 - (thickness * 2))
        let diameter = 38 / diameter_ratio
        let radius = diameter / 2

        let turns = 30
        let length = this.geometry.spring.dimensions.length
        let preloadLength = length - this.geometry.spring.dimensions.preload

        let height = preloadLength - this.geometry.compression

        let spring = new Spring(radius, thickness, turns, 24, height, 1)
        spring.update()

        spring.position.set(0, this.forkGeometry.length - (this.forkGeometry.outerTubeLength / 2) - height - this.geometry.spring.dimensions.preload - this.geometry.compression, 0)

        return spring
    }

    buildForkStem() {
        let geometry = new THREE.CylinderGeometry(12, 12, this.tripleTreeGeometry.stemLength, 32, 1)
        let mesh = new THREE.Mesh(geometry, this.forkMaterial)
        mesh.castShadow = true

        mesh.position.y = - (this.tripleTreeGeometry.stemLength / 2)

        return mesh
    }

    buildYoke(offset, thickness) {
        let shape = new THREE.Shape()
        let points = [
            new THREE.Vector2(0, -12 - 15),
            new THREE.Vector2(5 - 12, -12 - 10),
            new THREE.Vector2(-2 - 12, -12),
            new THREE.Vector2(-5 - 12, 0),

            new THREE.Vector2(-2 - 12, 12),
            new THREE.Vector2(5 - 12, 12 + 10),
            new THREE.Vector2(0, 12 + 15),
        ]

        // right fork tube mount
        for (let i = Math.PI; i >= -Math.PI / 4; i -= Math.PI / 8) {
            let x = Math.cos(i) * (this.forkGeometry.radius + 10)
            let y = Math.sin(i) * (this.forkGeometry.radius + 10)

            points.push(new THREE.Vector2(offset + x, this.tripleTreeGeometry.width / 2 + y))
        }

        points.push(new THREE.Vector2(offset + this.forkGeometry.radius, 0))

        // left fork tube mount
        for (let i = Math.PI / 4; i >= -Math.PI; i -= Math.PI / 8) {
            let x = Math.cos(i) * (this.forkGeometry.radius + 10)
            let y = Math.sin(i) * (this.forkGeometry.radius + 10)

            points.push(new THREE.Vector2(offset + x, -this.tripleTreeGeometry.width / 2 + y))
        }

        shape.setFromPoints(points)

        let extrudeSettings = {
            steps: 5,
            depth: thickness,
            bevelEnabled: true,
            bevelThickness: 2,
            bevelSize: 1,
            bevelOffset: 2,
            bevelSegments: 3,
        }

        let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
        geometry.computeBoundingBox()
        // geometry.mergeVertices()
        geometry.computeVertexNormals()
        let mesh = new THREE.Mesh(geometry, this.tripleTreeMaterial)
        mesh.castShadow = true
        mesh.rotateX(THREE.MathUtils.degToRad(90))

        return mesh
    }

    buildTopYoke() {
        return this.buildYoke(this.tripleTreeGeometry.offset, this.tripleTreeGeometry.topYokeThickness)
    }

    buildBottomYoke() {
        let mesh = this.buildYoke(this.tripleTreeGeometry.offset, this.tripleTreeGeometry.bottomYokeThickness)
        mesh.position.y = -this.tripleTreeGeometry.stemLength

        return mesh
    }

    buildGeometry() {
        let wheelAxle = this.buildWheelAxle()

        let forkStem = this.buildForkStem()
        let topYoke = this.buildTopYoke()
        let bottomYoke = this.buildBottomYoke()
        this.pivotTripleTree = new THREE.Group()
        this.pivotTripleTree.add(forkStem)
        this.pivotTripleTree.add(topYoke)
        this.pivotTripleTree.add(bottomYoke)

        let forkLeftInnerCylinder = this.buildForkInsideTube()
        this.leftSpring = this.buildSpring()
        this.pivotLeftFork = new THREE.Group()
        this.pivotLeftFork.add(forkLeftInnerCylinder)
        this.pivotLeftFork.add(this.leftSpring)

        let forkRightInnerCylinder = this.buildForkInsideTube()
        this.rightSpring = this.buildSpring()
        this.pivotRightFork = new THREE.Group()
        this.pivotRightFork.add(forkRightInnerCylinder)
        this.pivotRightFork.add(this.rightSpring)

        this.forkLeftCylinder = this.buildForkTube()
        this.forkRightCylinder = this.buildForkTube()

        this.pivot = new THREE.Group()
        this.pivot.add(wheelAxle)
        this.pivot.add(this.pivotTripleTree)
        this.pivot.add(this.pivotLeftFork)
        this.pivot.add(this.pivotRightFork)
        this.pivot.add(this.forkLeftCylinder)
        this.pivot.add(this.forkRightCylinder)

        return this
    }

    updateSpringsGeometry() {
        this.pivotLeftFork.remove(this.leftSpring)
        this.leftSpring = this.buildSpring()
        this.pivotLeftFork.add(this.leftSpring)

        this.pivotRightFork.remove(this.rightSpring)
        this.rightSpring = this.buildSpring()
        this.pivotRightFork.add(this.rightSpring)
    }

    updateGeometry() {
        this.pivot.position.set(this.geometry.frontTire.position.x, this.geometry.frontTire.position.y, 0)

        this.pivotTripleTree.position.set(
            0 - this.tripleTreeGeometry.offset,
            this.forkGeometry.length - this.geometry.fork.dimensions.offset + this.geometry.spring.dimensions.preload - this.geometry.compression,
            0
        )

        this.pivotLeftFork.position.set(0, this.forkGeometry.stanchionTubeLength / 2, -this.tripleTreeGeometry.width / 2)
        this.pivotRightFork.position.set(0, this.forkGeometry.stanchionTubeLength / 2, this.tripleTreeGeometry.width / 2)

        this.forkLeftCylinder.position.set(
            0,
            this.forkGeometry.length - (this.forkGeometry.outerTubeLength / 2) + this.geometry.spring.dimensions.preload - this.geometry.compression,
            -this.tripleTreeGeometry.width / 2
        )
        this.forkRightCylinder.position.set(
            0,
            this.forkGeometry.length - (this.forkGeometry.outerTubeLength / 2) + this.geometry.spring.dimensions.preload - this.geometry.compression,
            this.tripleTreeGeometry.width / 2
        )

        this.updateSpringsGeometry()

        this.pivot.rotation.z = this.geometry.verticalStemAngle
    }
}

export default {}
