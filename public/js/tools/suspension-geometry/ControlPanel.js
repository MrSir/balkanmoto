class ControlPanel {
    constructor(element) {
        this.gui = new THREE.GUI({ width: 325 })
        element.appendChild(this.gui.domElement)
    }

    createTireFolder(name, paramDefaults, tireMesh, forkMesh) {
        let tireFolder = this.gui.addFolder(name + ' Tire')
        let params = {}
        params[name + ' Tire Width (mm)'] = paramDefaults.tireWidth
        params[name + ' Tire Aspect'] = paramDefaults.tireAspect
        params[name + ' Rim Size (in)'] = paramDefaults.rimSize

        tireFolder
            .add(params, name + ' Tire Width (mm)', 90, 320, 5)
            .listen()
            .onChange(function (width) {
                tireMesh.setWidth(width).redrawInScene()
                forkMesh ? forkMesh.redrawInScene() : null
            })

        tireFolder
            .add(params, name + ' Tire Aspect', 45, 95, 5)
            .listen()
            .onChange(function (aspect) {
                tireMesh.setAspect(aspect).redrawInScene()
                forkMesh ? forkMesh.redrawInScene() : null
            })

        tireFolder
            .add(params, name + ' Rim Size (in)', 13, 22, 1)
            .listen()
            .onChange(function (rimDiameterInInches) {
                tireMesh
                    .setRimDiameterInInches(rimDiameterInInches)
                    .redrawInScene()
                forkMesh ? forkMesh.redrawInScene() : null
            })

        tireFolder.open()

        return this
    }

    createFrameFolder(paramDefaults, rearTire, frontTire, fork) {
        let frameFolder = this.gui.addFolder('Frame')
        let params = {
            'Wheelbase (mm)': paramDefaults.wheelbase,
        }

        frameFolder
            .add(params, 'Wheelbase (mm)', 1300, 1800, 1)
            .listen()
            .onChange(function (wheelbase) {
                rearTire.setX(-wheelbase / 2).redrawInScene()
                frontTire.setX(wheelbase / 2).redrawInScene()
                fork.redrawInScene()
            })

        frameFolder.open()

        return this
    }

    createForkFolder(paramDefaults, fork) {
        let forkFolder = this.gui.addFolder('Fork')
        let params = {
            'Fork Diameter (in)': paramDefaults.diameter,
            'Fork Width (mm)': paramDefaults.width,
            'Fork Length (mm)': paramDefaults.length,
            'Fork Offset (mm)': paramDefaults.offset,
            'Fork Stem Height (mm)': paramDefaults.stemHeight,
            'Fork Rake (deg)': paramDefaults.rake,
        }

        forkFolder
            .add(params, 'Fork Diameter (in)', 37, 41, 1)
            .listen()
            .onChange(function (diameter) {
                fork.setRadius(diameter / 2).redrawInScene()
            })

        forkFolder
            .add(params, 'Fork Width (mm)', 200, 400, 1)
            .listen()
            .onChange(function (width) {
                fork.setWidth(width).redrawInScene()
            })

        forkFolder
            .add(params, 'Fork Length (mm)', 400, 1000, 1)
            .listen()
            .onChange(function (length) {
                fork.setLength(length).redrawInScene()
            })

        forkFolder
            .add(params, 'Fork Offset (mm)', 0, 100, 1)
            .listen()
            .onChange(function (offset) {
                fork.setOffset(offset).redrawInScene()
            })

        forkFolder
            .add(params, 'Fork Stem Height (mm)', 100, 500, 1)
            .listen()
            .onChange(function (stemHeight) {
                fork.setStemHeight(stemHeight).redrawInScene()
            })

        forkFolder
            .add(params, 'Fork Rake (deg)', 21, 45, 0.5)
            .listen()
            .onChange(function (rake) {
                fork.setRake(rake).redrawInScene()
            })

        forkFolder.open()

        return this
    }
}
