class Tire3D {
    x = 0
    y = 0

    constructor(
        scene,
        renderer,
        camera,
        floorY,
        width,
        aspect,
        rimDiameterInInches
    ) {
        this.scene = scene
        this.renderer = renderer
        this.camera = camera
        this.floorY = floorY
        this.width = width
        this.aspect = aspect
        this.rimDiameterInInches = rimDiameterInInches

        this.torusMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x222222222,
            roughness: 1,
            metalness: 0,
            reflectivity: 0.2,
            depthWrite: true,
        })
    }

    get radialSegments() {
        return 16
    }

    get tubularSegments() {
        return 100
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
        this.rimDiameterInInches = rimDiameterInInches
        return this
    }

    calculateTorusSize() {
        let rimDiameterInMillimeters = this.rimDiameterInInches * 25.4
        let tireHeight = this.width * (this.aspect / 100)
        let wheelDiameter = rimDiameterInMillimeters + 2 * tireHeight

        this.y = this.floorY + wheelDiameter / 2

        this.torusTube = tireHeight / 2
        this.torusRadius = (wheelDiameter - tireHeight) / 2

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

    addToScene() {
        this.scene.add(this.torus)
    }

    redrawInScene() {
        this.scene.remove(this.torus)

        this.calculateTorusSize().buildTorus()

        this.addToScene()
        this.renderer.render(this.scene, this.camera)
    }
}
