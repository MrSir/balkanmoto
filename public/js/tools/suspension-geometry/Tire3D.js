class Tire3D {
    x = 0
    y = 0

    constructor(floorY, width, aspect, rimDiameterInInches) {
        this.floorY = floorY
        this.width = width
        this.aspect = aspect
        this.setRimDiameterInInches(rimDiameterInInches)

        this.torusMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x222222222,
            roughness: 1,
            metalness: 0,
            reflectivity: 0.2,
            depthWrite: true,
            transparent: true,
            opacity: 0.25,
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
        this.torusMaterial.transparent = toggle
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

    setWidth(width) {
        this.width = width
        return this
    }

    setAspect(aspect) {
        this.aspect = aspect
        return this
    }

    setRimDiameterInInches(rimDiameterInInches) {
        this.rimDiameterInMillimeters = rimDiameterInInches * 25.4
        return this
    }

    setRimDiameterInMillimeters(rimDiameterInMillimeters) {
        this.rimDiameterInMillimeters = rimDiameterInMillimeters
        return this
    }

    calculateTorusSize() {
        let tireHeight = this.width * (this.aspect / 100)
        this.wheelDiameter = this.rimDiameterInMillimeters + 2 * tireHeight

        this.torusTube = tireHeight / 2
        this.torusRadius = (this.wheelDiameter - tireHeight) / 2

        return this
    }

    calculateYBasedOnWheelDiameter() {
        this.y = this.floorY + this.wheelDiameter / 2
        return this
    }

    buildTorus() {
        this.torusGeometry = new THREE.TorusGeometry(
            this.torusRadius,
            this.torusTube,
            this.radialSegments,
            this.tubularSegments
        )

        this.torus = new THREE.Mesh(this.torusGeometry, this.torusMaterial)
        this.torus.castShadow = true
        this.torus.position.setX(this.x)
        this.torus.position.setY(this.y)

        return this
    }

    removeFromObject(object) {
        object.remove(this.torus)
    }

    addToObject(object) {
        object.add(this.torus)
    }
}
