class Tire3D {
    constructor(floorY, width, aspect, rimDiameterInInches) {
        this.x = 0
        this.y = 0
        this.floorY = floorY
        this.width = width
        this.aspect = aspect
        this.setRimDiameterInInches(rimDiameterInInches)

        this.tireMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x121212121,
            roughness: 1,
            metalness: 0,
            reflectivity: 0.2,
            depthWrite: true,
            side: THREE.DoubleSide,
            transparent: false,
            opacity: 0.25,
            //wireframe: true,
        })
    }

    get radialSegments() {
        return 16
    }

    get tubularSegments() {
        return 100
    }

    get wheelRadius() {
        return this.wheelDiameter / 2
    }

    setTransparency(toggle) {
        this.tireMaterial.transparent = toggle
        return this
    }

    setX(x) {
        this.x = x
        return this
    }

    setY(y) {
        this.y = y
        return this
    }

    setParameters(parameters) {
        this.setWidth(parameters.width)
            .setAspect(parameters.aspect)
            .setRimDiameterInInches(parameters.rimDiameterInInches)

        return this
    }

    setWidth(width) {
        this.width = width
        return this
    }

    setAspect(aspect) {
        this.aspect = aspect
        return this
    }

    setRimDiameterInInches(rimDiameterInInches) {
        this.rimDiameterInInches = rimDiameterInInches
        this.rimDiameterInMillimeters = rimDiameterInInches * 25.4
        return this
    }

    setRimDiameterInMillimeters(rimDiameterInMillimeters) {
        this.rimDiameterInMillimeters = rimDiameterInMillimeters
        return this
    }

    calculateWheelDimentions() {
        this.tireHeight = this.width * (this.aspect / 100)
        this.wheelDiameter = this.rimDiameterInMillimeters + 2 * this.tireHeight
        this.rimRadius = this.rimDiameterInMillimeters / 2
        this.tireRadius = this.rimRadius + this.tireHeight
        return this
    }

    calculateYBasedOnWheelDiameter() {
        this.y = this.floorY + this.wheelDiameter / 2
        return this
    }

    buildTire() {
        let points = []
        // bead
        points.push(new THREE.Vector2(this.rimRadius, this.width / 2 - 20))
        points.push(new THREE.Vector2(this.rimRadius, this.width / 2 - 10))

        //thread
        points.push(new THREE.Vector2(this.wheelRadius * 0.85, this.width / 2))
        points.push(new THREE.Vector2(this.wheelRadius * 0.95, this.width * 0.4))
        points.push(new THREE.Vector2(this.wheelRadius * 0.99, this.width * 0.2))
        points.push(new THREE.Vector2(this.wheelRadius, this.width * 0.05))
        points.push(new THREE.Vector2(this.wheelRadius, -this.width * 0.05))
        points.push(new THREE.Vector2(this.wheelRadius * 0.99, -this.width * 0.2))
        points.push(new THREE.Vector2(this.wheelRadius * 0.95, -this.width * 0.4))
        points.push(new THREE.Vector2(this.wheelRadius * 0.85, -this.width / 2))

        // bead
        points.push(new THREE.Vector2(this.rimRadius, -this.width / 2))
        points.push(new THREE.Vector2(this.rimRadius, -this.width / 2 + 10))

        let geometry = new THREE.LatheBufferGeometry(points, 42, 0, Math.PI * 2)
        this.lathe = new THREE.Mesh(geometry, this.tireMaterial)
        this.lathe.castShadow = true
        this.lathe.rotateX(Math.PI / 2)
        this.lathe.position.set(this.x, this.y, 0)

        return this
    }

    removeFromObject(object) {
        object.remove(this.lathe)
    }

    addToObject(object) {
        object.add(this.lathe)
    }
}
