class ControlPanel {
    constructor(element, labels, frame, frameParameters) {
        this.gui = new THREE.GUI({
            width: 350,
            closeOnTop: true,
            scrollable: false,
        })
        element.appendChild(this.gui.domElement)

        this.labels = labels
        this.frame = frame
        this.frameParameters = frameParameters

        this.createTireFolder('Rear', this.frameParameters.rearTire)
            .createTireFolder('Front', this.frameParameters.frontTire)
            .createFrameFolder(this.frameParameters)
    }

    createTireFolder(name, paramDefaults) {
        let tireFolder = this.gui.addFolder(name + ' Tire')
        let params = {}
        params[name + ' Tire Width (mm)'] = paramDefaults.width
        params[name + ' Tire Aspect'] = paramDefaults.aspect
        params[name + ' Rim Size (in)'] = paramDefaults.rimDiameterInInches

        tireFolder
            .add(params, name + ' Tire Width (mm)', 90, 320, 5)
            .listen()
            .onChange((width) => {
                this.frame[name.toLowerCase() + 'Tire'].setWidth(width)
                this.frame.redrawInScene()
            })

        tireFolder
            .add(params, name + ' Tire Aspect', 45, 95, 5)
            .listen()
            .onChange((aspect) => {
                this.frame[name.toLowerCase() + 'Tire'].setAspect(aspect)
                this.frame.redrawInScene()
            })

        tireFolder
            .add(params, name + ' Rim Size (in)', 13, 22, 1)
            .listen()
            .onChange((rimDiameterInInches) => {
                this.frame[name.toLowerCase() + 'Tire'].setRimDiameterInInches(
                    rimDiameterInInches
                )
                this.frame.redrawInScene()
            })

        tireFolder.open()

        return this
    }

    createFrameFolder(paramDefaults) {
        let frameFolder = this.gui.addFolder('Frame')
        let params = {
            //'Wheelbase (mm)': paramDefaults.wheelbase,
            'Backbone Length (mm)': paramDefaults.backboneLength,
            'Fork Rake (deg)': paramDefaults.rake,
            'Backbone Angle (deg)': paramDefaults.backboneAngle,
        }
        //let labels = this.labels

        // frameFolder
        //     .add(params, 'Wheelbase (mm)', 1300, 1800, 1)
        //     .listen()
        //     .onChange(function (wheelbase) {
        //         rearTire.setX(-wheelbase / 2).redrawInScene()
        //         frontTire.setX(wheelbase / 2).redrawInScene()
        //         fork.redrawInScene()
        //         labels.redrawInScene()
        //     })
        frameFolder
            .add(params, 'Backbone Length (mm)', 0, 1000, 1)
            .listen()
            .onChange((backboneLength) => {
                this.frame
                    .setBackboneLength(backboneLength)
                    .calculateBackboneAngle()
                    .redrawInScene()
            })
        // frameFolder
        //     .add(params, 'Backbone Angle (deg)', 0, 45, 0.5)
        //     .listen()
        //     .onChange((backboneAngle) => {
        //         this.frame.setBackboneAngle(backboneAngle).redrawInScene()
        //     })
        frameFolder
            .add(params, 'Fork Rake (deg)', 0, 45, 0.5)
            .listen()
            .onChange((rake) => {
                this.frame
                    .setRake(rake)
                    .calculateBackboneAngle()
                    .redrawInScene()
            })

        frameFolder.open()

        return this
    }

    createForkFolder(paramDefaults, fork) {
        let forkFolder = this.gui.addFolder('Fork')
        let params = {
            'Fork Diameter (mm)': paramDefaults.diameter,
            'Fork Width (mm)': paramDefaults.width,
            'Fork Length (mm)': paramDefaults.length,
            'Fork Offset (mm)': paramDefaults.offset,
            'Fork Stem Length (mm)': paramDefaults.stemHeight,
        }

        forkFolder
            .add(params, 'Fork Diameter (mm)', 37, 41, 1)
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
            .add(params, 'Fork Stem Length (mm)', 100, 250, 1)
            .listen()
            .onChange(function (stemHeight) {
                fork.setStemHeight(stemHeight).redrawInScene()
            })

        forkFolder.open()

        return this
    }
}
