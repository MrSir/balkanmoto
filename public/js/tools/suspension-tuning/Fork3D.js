import * as THREE from 'three';
import * as Spring3D from 'spring3D';
import * as Tire3D from 'tire3D';

export class Fork {
    constructor(floorY, x, y, diameter, stanchionTubeLength, outerTubeLength, length, offset, width, tripleTreeParameters, spring, preload, compressionDamping, reboundDamping, compression) {
        this.radiusSegments = 32
        this.heightSegments = 1
        this.stemRadius = 12
        
        this.diameter = diameter
        this.radius = diameter / 2
        this.stanchionTubeLength = stanchionTubeLength
        this.outerTubeLength = outerTubeLength
        this.length = length
        this.offset = offset
        this.width = width

        this.spring = spring
        this.preload = preload
        this.compressionDamping = compressionDamping
        this.reboundDamping = reboundDamping

        this.compression = compression

        this.tripleTreeParameters = tripleTreeParameters

        this.tire = null

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
            transparent: true,
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
        let geometry = new THREE.CylinderGeometry(10, 10, this.width, this.radiusSegments, this.heightSegments)

        let mesh = new THREE.Mesh(geometry, this.forkMaterial)
        mesh.castShadow = true
        mesh.position.set(0, 0, 0)
        mesh.rotateX(Math.PI / 2)

        return mesh
    }

    buildForkTube() {
        let geometry = new THREE.CylinderGeometry(
            this.radius + 3,
            this.radius + 3,
            this.outerTubeLength,
            this.radiusSegments,
            this.heightSegments
        )

        let mesh = new THREE.Mesh(geometry, this.goldForkTubeMaterial)
        mesh.castShadow = true
        mesh.position.set(0, this.length - (this.stanchionTubeLength / 2) - this.compression, 0)

        return mesh
    }

    buildForkInsideTube() {
        let geometry = new THREE.CylinderGeometry(
            this.radius,
            this.radius,
            this.stanchionTubeLength,
            this.radiusSegments,
            this.heightSegments
        )

        let mesh = new THREE.Mesh(geometry, this.silverForkTubeMaterial)
        mesh.castShadow = true
        mesh.position.set(0, this.stanchionTubeLength / 2, 0)

        return mesh
    }

    buildSpring() {
        let thickness_ratio = this.spring /  6.0
        let thickness = 2.0 * thickness_ratio

        let diameter_ratio = 38 / (38 - (thickness * 2))
        let diameter = 38 / diameter_ratio
        let radius = diameter / 2

        let turns = 30
        let length = 425
        let height = length - this.preload - this.compression

        let spring = new Spring3D.Spring(radius, thickness, turns, 24, height, 1)
        spring.update()

        spring.position.set(0, this.length - length, 0)

        return spring
    }

    buildForkStem() {
        let geometry = new THREE.CylinderGeometry(
            this.stemRadius,
            this.stemRadius,
            this.tripleTreeParameters.stemLength,
            this.radiusSegments,
            this.heightSegments
        )
        let mesh = new THREE.Mesh(geometry, this.forkMaterial)
        mesh.castShadow = true

        mesh.position.set(
            0 - this.tripleTreeParameters.offset,
            this.length - (this.tripleTreeParameters.stemLength / 2) - this.offset - this.compression,
            0
        )

        return mesh
    }

    buildYoke(offset, thickness) {
        let shape = new THREE.Shape()
        let points = [
            new THREE.Vector2(0, -this.stemRadius - 15),
            new THREE.Vector2(5 - this.stemRadius, -this.stemRadius - 10),
            new THREE.Vector2(-2 - this.stemRadius, -this.stemRadius),
            new THREE.Vector2(-5 - this.stemRadius, 0),

            new THREE.Vector2(-2 - this.stemRadius, this.stemRadius),
            new THREE.Vector2(5 - this.stemRadius, this.stemRadius + 10),
            new THREE.Vector2(0, this.stemRadius + 15),
        ]

        // right fork tube mount
        for (let i = Math.PI; i >= -Math.PI / 4; i -= Math.PI / 8) {
            let x = Math.cos(i) * (this.radius + 10)
            let y = Math.sin(i) * (this.radius + 10)

            points.push(new THREE.Vector2(offset + x, this.width / 2 + y))
        }

        points.push(new THREE.Vector2(offset + this.radius, 0))

        // left fork tube mount
        for (let i = Math.PI / 4; i >= -Math.PI; i -= Math.PI / 8) {
            let x = Math.cos(i) * (this.radius + 10)
            let y = Math.sin(i) * (this.radius + 10)

            points.push(new THREE.Vector2(offset + x, -this.width / 2 + y))
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
        let mesh = this.buildYoke(this.tripleTreeParameters.offset, this.tripleTreeParameters.topYokeThickness)

        mesh.position.set(
            0 - this.tripleTreeParameters.offset,
            this.length - this.offset - this.compression,
            0
        )

        return mesh
    }

    buildBottomYoke() {
        let mesh = this.buildYoke(this.tripleTreeParameters.offset, this.tripleTreeParameters.bottomYokeThickness)

        mesh.position.set(
            0 - this.tripleTreeParameters.offset,
            this.length - this.offset - this.tripleTreeParameters.stemLength - this.compression,
            0
        )

        return mesh
    }

    buildFork() {
        let wheelAxle = this.buildWheelAxle()

        let forkLeftCylinder = this.buildForkTube()
        let forkLeftInnerCylinder = this.buildForkInsideTube()
        let leftSpring = this.buildSpring()
        let pivotLeftFork = new THREE.Group()
        pivotLeftFork.position.set(0, 0, -this.width / 2)
        pivotLeftFork.add(forkLeftInnerCylinder)
        pivotLeftFork.add(forkLeftCylinder)
        pivotLeftFork.add(leftSpring)

        let forkRightCylinder = this.buildForkTube()
        let forkRightInnerCylinder = this.buildForkInsideTube()
        let rightSpring = this.buildSpring()
        let pivotRightFork = new THREE.Group()
        pivotRightFork.position.set(0, 0, this.width / 2)
        pivotRightFork.add(forkRightCylinder)
        pivotRightFork.add(forkRightInnerCylinder)
        pivotRightFork.add(rightSpring)

        let forkStem = this.buildForkStem()
        let topYoke = this.buildTopYoke()
        let bottomYoke = this.buildBottomYoke()
        let pivotTripleTree = new THREE.Group()
        pivotTripleTree.position.set(0, 0, 0)
        pivotTripleTree.add(forkStem)
        pivotTripleTree.add(topYoke)
        pivotTripleTree.add(bottomYoke)

        this.pivot = new THREE.Group()
        this.pivot.position.set(this.tire.x, this.tire.y, 0)
        this.pivot.add(wheelAxle)
        this.pivot.add(pivotLeftFork)
        this.pivot.add(pivotRightFork)
        this.pivot.add(pivotTripleTree)

        return this
    }

    removeFromObject(object) {
        object.remove(this.pivot)
    }

    addToObject(object) {
        object.add(this.pivot)
    }

    redrawInScene(scene) {
        this.removeFromObject(scene)
        this.buildFork().addToObject(scene)
    }
}

export default {}
