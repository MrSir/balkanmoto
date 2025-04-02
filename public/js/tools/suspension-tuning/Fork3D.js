import * as THREE from 'three';
import * as Spring3D from 'spring3D';
import * as Tire3D from 'tire3D';

export class Fork {
    constructor(floorY, x, y, diameter, length, offset, width, stemLength, rake, forkTripleTreeBaseOffset, frameStemTopHeight) {
        this.radiusSegments = 32
        this.heightSegments = 1
        this.stemRadius = 12
        
        this.floorY = floorY

        this.x = x
        this.y = y

        this.diameter = diameter
        this.radius = diameter / 2
        this.length = length
        this.offset = offset
        this.width = width
        this.stemLength = stemLength

        this.preload = 0

        this.rake = rake
        this.forkTripleTreeBaseOffset = forkTripleTreeBaseOffset
        this.frameStemTopHeight = frameStemTopHeight

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
            //wireframe: true,
        })

        this.goldForkTubeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffd700,
            emissive: 0x000000,
            metalness: 1.0,
            flatShading: false,
            roughness: 0.2,
            reflectivity: 1,
            clearcoat: 0.0,
            transparent: true,
            opacity: 0.5,
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
        })
    }

    get tripleTreeRakeInRadians() {
        return THREE.MathUtils.degToRad(this.rake)
    }

    setTransparency(toggle) {
        this.goldForkTubeMaterial.transparent = toggle
        this.goldForkTubeMaterial.opacity = toggle ? 0.5 : 1
        this.silverForkTubeMaterial.transparent = toggle
        this.silverForkTubeMaterial.opacity = toggle ? 0.8 : 1

        return this
    }

    buildTire() {
        let tire = new Tire3D.Tire(this.floorY, 90, 90, 21, 0, 0, Math.PI / 2)
        tire.calculateWheelDimensions().calculateYBasedOnWheelDiameter().buildTire()

        return tire
    }

    buildWheelAxle(yCoordinate) {
        let geometry = new THREE.CylinderGeometry(10, 10, this.width, this.radiusSegments, this.heightSegments)

        let mesh = new THREE.Mesh(geometry, this.forkMaterial)
        mesh.castShadow = true
        mesh.position.y = yCoordinate
        mesh.rotateX(Math.PI / 2)

        return mesh
    }

    buildForkTube(yCoordinate, zCoordinate) {
        let geometry = new THREE.CylinderGeometry(
            this.radius,
            this.radius,
            this.length - 300,
            this.radiusSegments,
            this.heightSegments
        )

        let mesh = new THREE.Mesh(geometry, this.goldForkTubeMaterial)
        mesh.castShadow = true
        mesh.position.set(0, yCoordinate + (this.length / 2) + 150, zCoordinate)

        return mesh
    }

    buildForkInsideTube(yCoordinate, zCoordinate) {
        let geometry = new THREE.CylinderGeometry(
            this.radius - 5,
            this.radius - 5,
            this.length - 500,
            this.radiusSegments,
            this.heightSegments
        )

        let mesh = new THREE.Mesh(geometry, this.silverForkTubeMaterial)
        mesh.castShadow = true
        mesh.position.set(0, yCoordinate + (this.length / 2) - 250, zCoordinate)

        return mesh
    }

    buildSpring(yCoordinate, zCoordinate) {
        let spring = new Spring3D.Spring(this.radius - 12, 3, 50, 24, this.length * 0.6, 1)
        spring.update()

        spring.position.set(0, yCoordinate + (this.length / 2) - 120 , zCoordinate)

        return spring
    }

    buildForkStem(yCoordinate) {
        let geometry = new THREE.CylinderGeometry(
            this.stemRadius,
            this.stemRadius,
            this.stemLength,
            this.radiusSegments,
            this.heightSegments
        )
        let mesh = new THREE.Mesh(geometry, this.forkMaterial)
        mesh.castShadow = true

        let stemAxleLength = Math.cos(this.tripleTreeRakeInRadians) * (this.length - this.offset)
        let YBasedOnDimensions = stemAxleLength - this.stemLength / 2
        let topDiff = this.frameStemTopHeight - YBasedOnDimensions

        mesh.position.set(
            0 - this.forkTripleTreeBaseOffset,
            yCoordinate + this.frameStemTopHeight - topDiff,
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

    buildTopYoke(yCoordinate) {
        let mesh = this.buildYoke(80, 20)
        let stemAxleLength = Math.cos(this.tripleTreeRakeInRadians) * (this.length - this.offset)
        let topDiff = this.frameStemTopHeight - stemAxleLength

        mesh.position.set(
            0 - this.forkTripleTreeBaseOffset,
            yCoordinate + this.frameStemTopHeight - topDiff - 3,
            0
        )

        return mesh
    }

    buildBottomYoke(yCoordinate) {
        let mesh = this.buildYoke(80, 30)

        let yokeDepth = mesh.geometry.boundingBox.max.z - mesh.geometry.boundingBox.min.z
        let stemAxleLength = Math.cos(this.tripleTreeRakeInRadians) * (this.length - this.offset)
        let topDiff = this.frameStemTopHeight - stemAxleLength

        mesh.position.set(
            0 - this.forkTripleTreeBaseOffset,
            yCoordinate + this.frameStemTopHeight - topDiff - this.stemLength + yokeDepth - 1,
            0
        )

        return mesh
    }

    buildFork() {
        let tire = this.buildTire()
        let wheelAxle = this.buildWheelAxle(tire.y)

        let forkLeftCylinder = this.buildForkTube(tire.y, -this.width / 2)
        let forkLeftInnerCylinder = this.buildForkInsideTube(tire.y, -this.width / 2)
        let leftSpring = this.buildSpring(tire.y, -this.width / 2)

        let forkRightCylinder = this.buildForkTube(tire.y,this.width / 2)
        let forkRightInnerCylinder = this.buildForkInsideTube(tire.y, this.width / 2)
        let rightSpring = this.buildSpring(tire.y, this.width / 2)

        let forkStem = this.buildForkStem(tire.y)
        let topYoke = this.buildTopYoke(tire.y)
        let bottomYoke = this.buildBottomYoke(tire.y)

        this.pivot = new THREE.Group()
        this.pivot.position.set(this.x, this.y, 0)
        this.pivot.add(tire.lathe)
        this.pivot.add(wheelAxle)
        this.pivot.add(forkLeftCylinder)
        this.pivot.add(forkLeftInnerCylinder)
        this.pivot.add(leftSpring)
        this.pivot.add(forkRightCylinder)
        this.pivot.add(forkRightInnerCylinder)
        this.pivot.add(rightSpring)

        this.pivot.add(forkStem)
        this.pivot.add(topYoke)
        this.pivot.add(bottomYoke)

        this.pivot.rotateY(- Math.PI / 2)

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
