import * as THREE from 'three';

export class Tire {
    constructor(tireGeometry) {
        this.tireGeometry = tireGeometry

        this.tireMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x121212121,
            roughness: 1,
            metalness: 0,
            reflectivity: 0.2,
            depthWrite: true,
            side: THREE.DoubleSide,
            transparent: false,
            opacity: 0.5,
        })
    }

    setTransparency(toggle) {
        this.tireMaterial.transparent = toggle
        return this
    }

    buildGeometry() {
        let points = []
        // bead
        points.push(new THREE.Vector2(this.tireGeometry.dimensions.rim.radius, this.tireGeometry.dimensions.tire.width / 2 - 20))
        points.push(new THREE.Vector2(this.tireGeometry.dimensions.rim.radius, this.tireGeometry.dimensions.tire.width / 2 - 10))

        //thread
        points.push(new THREE.Vector2(this.tireGeometry.dimensions.radius * 0.85, this.tireGeometry.dimensions.tire.width / 2))
        points.push(new THREE.Vector2(this.tireGeometry.dimensions.radius * 0.95, this.tireGeometry.dimensions.tire.width * 0.4))
        points.push(new THREE.Vector2(this.tireGeometry.dimensions.radius * 0.99, this.tireGeometry.dimensions.tire.width * 0.2))
        points.push(new THREE.Vector2(this.tireGeometry.dimensions.radius, this.tireGeometry.dimensions.tire.width * 0.05))
        points.push(new THREE.Vector2(this.tireGeometry.dimensions.radius, -this.tireGeometry.dimensions.tire.width * 0.05))
        points.push(new THREE.Vector2(this.tireGeometry.dimensions.radius * 0.99, -this.tireGeometry.dimensions.tire.width * 0.2))
        points.push(new THREE.Vector2(this.tireGeometry.dimensions.radius * 0.95, -this.tireGeometry.dimensions.tire.width * 0.4))
        points.push(new THREE.Vector2(this.tireGeometry.dimensions.radius * 0.85, -this.tireGeometry.dimensions.tire.width / 2))

        // bead
        points.push(new THREE.Vector2(this.tireGeometry.dimensions.rim.radius, -this.tireGeometry.dimensions.tire.width / 2))
        points.push(new THREE.Vector2(this.tireGeometry.dimensions.rim.radius, -this.tireGeometry.dimensions.tire.width / 2 + 10))

        let geometry = new THREE.LatheGeometry(points, 42, 0, Math.PI * 2)
        this.lathe = new THREE.Mesh(geometry, this.tireMaterial)
        this.lathe.castShadow = true
        this.lathe.rotation.x = -Math.PI / 2

        return this
    }

    updateGeometry() {
        this.lathe.position.x = this.tireGeometry.position.x
        this.lathe.position.y = this.tireGeometry.position.y
    }
}

export default {}
