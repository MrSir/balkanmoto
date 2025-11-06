import * as THREE from 'three';

export class Simulation {
    constructor(scene, geometry, dropHeight, floorY) {
        this.scene = scene
        this.geometry = geometry
        this.floorY = floorY

        this.g = 9810
        this.dropHeight = dropHeight
        this.y = dropHeight
        this.startTime = null
        this.v0 = 0
        this.stop = false

        this.pivot = new THREE.Group()
        this.pivot.add(this.geometry.pivot)
        this.pivot.position.y = this.y
    }

    reset() {
        this.y = this.dropHeight
        this.startTime = null
        this.v0 = 0
        this.stop = false
    }

    toggleGeometry(toggle) {
        this.geometry.showGeometry = toggle
        this.geometry.update()
        this.geometry.updateGeometry()
    }

    toggleDimensions(toggle) {
        this.geometry.showDimensions = toggle
        this.geometry.update()
        this.geometry.updateGeometry()
    }

    toggleTransparency(toggle){
        this.geometry.transparentObjects = toggle
        this.geometry.update()
        this.geometry.updateGeometry()
    }

    update() {
        this.geometry.update()
        this.geometry.updateGeometry()()
    }

    calculateY(time) {
        let t = (time - this.startTime) / 1000
        this.v0 = this.v0 - (this.g*t)
        this.y = this.y + (this.v0*t)

        if (this.y <= this.floorY) {
            // TODO this is where we simulate the compression
            // TODO the elasticity coefficient is the main thing to calculate from the fork settings
            this.v0 = (-0.9) * this.v0
            this.y = this.floorY
            // TODO this is the rebound
        }

        this.startTime = time
    }

    simulate(time) {
        if (this.startTime === null) {
            this.startTime = time
        }

        let lastY = this.y

        this.calculateY(time)

        this.pivot.position.y = this.y

        if (lastY === this.y && this.y === this.floorY){
            this.stop = true
        }
    }
}

export default {}
