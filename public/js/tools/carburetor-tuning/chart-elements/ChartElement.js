class ChartElement {
    constructor(scene, renderer, camera, font) {
        this.scene = scene
        this.renderer = renderer
        this.camera = camera
        this.font = font

        this.meshesInitialized = false
        this.visible = false
        this.points = []
        this.meshes = []

        this.blackMaterial = new THREE.LineBasicMaterial({color: 0x000000})
        this.redMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 })

        this.blueMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff })
        this.blueMediumMaterial = new THREE.LineBasicMaterial({ color: 0x6ba4ff })
        this.aquaMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff })

        this.greenMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 })
        this.yellowMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 })
        this.fusiaMaterial = new THREE.LineBasicMaterial({ color: 0xff00ff })

        this.textParameters = {
            font: this.font,
            size: 30,
            height: 1,
            curveSegments: 2,
            bevelEnabled: false,
        }
    }

    normalDistributionF(x, u, s) {
        let numerator = Math.E ** (-0.5 * (((x - u) / s) ** 2))
        let denominator = s * Math.sqrt(2 * Math.PI)

        let y = numerator / denominator

        return y
    }

    buildMeshes() {
        // abstract method
    }

    toggleVisible(toggle) {
        this.visible = toggle
        if (toggle) {
            if (!this.meshesInitialized) {
                this.buildMeshes()
            }

            this.drawInScene()
        } else {
            this.removeFromScene()
        }
    }

    removeFromScene() {
        this.meshes.forEach((mesh) => this.scene.remove(mesh))
    }

    drawInScene() {
        this.meshes.forEach((mesh) => this.scene.add(mesh))
    }

    redrawInScene() {
        this.removeFromScene()

        this.points = []
        this.meshes = []
        this.buildMeshes()

        if (this.visible) {
            this.drawInScene()
        }
    }

    buildLabel(text, x, y, z, material) {
        let textGeo = new THREE.TextGeometry(text, this.textParameters)
        textGeo.computeBoundingBox()
        textGeo.computeVertexNormals()

        textGeo.textWidth = textGeo.boundingBox.max.x - textGeo.boundingBox.min.x
        textGeo.textHeight = textGeo.boundingBox.max.y - textGeo.boundingBox.min.y

        let textMesh = new THREE.Mesh(textGeo, material)
        textMesh.position.set(x, y, z)

        return textMesh
    }

    buildPoint(x, y, z) {
        return new THREE.Vector3(x, y, z)
    }

    buildLine(points, material) {
        return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material)
    }

}