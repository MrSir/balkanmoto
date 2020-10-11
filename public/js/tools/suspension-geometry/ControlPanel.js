class ControlPanel {
    constructor(element, frame, frameParameters) {
        this.gui = new THREE.GUI({
            width: 350,
            closeOnTop: true,
            scrollable: false,
        })
        element.appendChild(this.gui.domElement)

        this.frame = frame
        this.frameParameters = frameParameters

        this.createViewFolder()
            .createDefaultsFolder()
            .createFrontTireFolder()
            .createRearTireFolder()
            .createFrameFolder(this.frameParameters)
            .createForkFolder(this.frameParameters.fork)
    }

    resetGuiTo(newParams) {
        this.frontTireWidth.setValue(newParams.frontTire.width)
        this.frontTireAspect.setValue(newParams.frontTire.aspect)
        this.frontRimSize.setValue(newParams.frontTire.rimDiameterInInches)

        this.rearTireWidth.setValue(newParams.rearTire.width)
        this.rearTireAspect.setValue(newParams.rearTire.aspect)
        this.rearRimSize.setValue(newParams.rearTire.rimDiameterInInches)

        this.stemRake.setValue(newParams.rake)

        this.forkLength.setValue(newParams.fork.length)
        this.forkOffset.setValue(newParams.fork.offset)
        this.trippleTreeRake.setValue(newParams.fork.tripleTreeRake)
        this.forkDiameter.setValue(newParams.fork.diameter)
        this.forkWidth.setValue(newParams.fork.width)
    }

    createViewFolder() {
        let viewFolder = this.gui.addFolder('View')
        let params = {
            'Show Geometry': true,
            'Transparent Objects': false,
        }

        viewFolder
            .add(params, 'Show Geometry')
            .listen()
            .onChange((toggle) => {
                this.frame.setShowGeometry(toggle).redrawInScene()
            })

        viewFolder
            .add(params, 'Transparent Objects')
            .listen()
            .onChange((toggle) => {
                this.frame.setTransparentObjects(toggle).redrawInScene()
            })

        viewFolder.open()

        return this
    }

    createDefaultsFolder() {
        let defaultsFolder = this.gui.addFolder('Defaults')
        let params = {
            Defaults: 'zero',
        }

        let defaults = new Defaults()

        defaultsFolder
            .add(params, 'Defaults')
            .options(defaults.getOptions())
            .listen()
            .onChange((name) => {
                let selectedParams = defaults.findDefaults(name)

                this.frame.rearTire
                    .setParameters(selectedParams)
                    .calculateTorusSize()
                    .calculateYBasedOnWheelDiameter()
                this.frame.frontTire
                    .setParameters(selectedParams)
                    .calculateTorusSize()
                    .calculateYBasedOnWheelDiameter()
                    .setX(this.frame.rearTire.x + selectedParams.wheelbase)
                this.frame
                    .setParameters(selectedParams)
                    .initialCalculate()
                    .redrawInScene()

                this.resetGuiTo(selectedParams)
                //todo update gui values
            })

        defaultsFolder.open()

        return this
    }

    createFrontTireFolder() {
        let frontTireFolder = this.gui.addFolder('Front Tire')
        let params = {
            'Tire Width (mm)': this.frameParameters.frontTire.width,
            'Tire Aspect': this.frameParameters.frontTire.aspect,
            'Rim Size (in)': this.frameParameters.frontTire.rimDiameterInInches,
        }

        this.frontTireWidth = frontTireFolder
            .add(params, 'Tire Width (mm)', 70, 320, 5)
            .listen()
            .onChange((width) => {
                this.frame.frontTire.setWidth(width)
                this.frame.redrawInScene()
            })

        this.frontTireAspect = frontTireFolder
            .add(params, 'Tire Aspect', 25, 95, 5)
            .listen()
            .onChange((aspect) => {
                this.frame.frontTire.setAspect(aspect)
                this.frame.redrawInScene()
            })

        this.frontRimSize = frontTireFolder
            .add(params, 'Rim Size (in)', 13, 22, 1)
            .listen()
            .onChange((rimDiameterInInches) => {
                this.frame.frontTire.setRimDiameterInInches(rimDiameterInInches)
                this.frame.redrawInScene()
            })

        frontTireFolder.close()

        return this
    }

    createRearTireFolder() {
        let rearTireFolder = this.gui.addFolder('Rear Tire')
        let params = {
            'Tire Width (mm)': this.frameParameters.rearTire.width,
            'Tire Aspect': this.frameParameters.rearTire.aspect,
            'Rim Size (in)': this.frameParameters.rearTire.rimDiameterInInches,
        }

        this.rearTireWidth = rearTireFolder
            .add(params, 'Tire Width (mm)', 70, 320, 5)
            .listen()
            .onChange((width) => {
                this.frame.rearTire.setWidth(width)
                this.frame.redrawInScene()
            })

        this.rearTireAspect = rearTireFolder
            .add(params, 'Tire Aspect', 25, 95, 5)
            .listen()
            .onChange((aspect) => {
                this.frame.rearTire.setAspect(aspect)
                this.frame.redrawInScene()
            })

        this.rearRimSize = rearTireFolder
            .add(params, 'Rim Size (in)', 13, 22, 1)
            .listen()
            .onChange((rimDiameterInInches) => {
                this.frame.rearTire.setRimDiameterInInches(rimDiameterInInches)
                this.frame.redrawInScene()
            })

        rearTireFolder.close()

        return this
    }

    createFrameFolder() {
        let frameFolder = this.gui.addFolder('Frame')
        let params = {
            'Stem Rake (deg)': this.frameParameters.rake,
            'Stem Length (mm)': this.frameParameters.stemLength,
        }

        // frameFolder
        //     .add(params, 'Wheelbase (mm)', 1300, 1800, 1)
        //     .listen()
        //     .onChange(function (wheelbase) {
        //         rearTire.setX(-wheelbase / 2).redrawInScene()
        //         frontTire.setX(wheelbase / 2).redrawInScene()
        //         fork.redrawInScene()
        //         labels.redrawInScene()
        //     })
        // frameFolder
        //     .add(params, 'Backbone Length (mm)', 980, 2000, 1)
        //     .listen()
        //     .onChange((backboneLength) => {
        //         this.frame.setBackboneLength(backboneLength).redrawInScene()
        //     })
        // frameFolder
        //     .add(params, 'Backbone Angle (deg)', 0, 45, 0.5)
        //     .listen()
        //     .onChange((backboneAngle) => {
        //         this.frame.setBackboneAngle(backboneAngle).redrawInScene()
        //     })
        this.stemRake = frameFolder
            .add(params, 'Stem Rake (deg)', 0, 45, 0.5)
            .listen()
            .onChange((rake) => {
                this.frame.parameters.rake = rake
                this.frame.redrawInScene()
            })

        this.stemLength = frameFolder
            .add(params, 'Stem Length (mm)', 100, 250, 1)
            .listen()
            .onChange((stemLength) => {
                this.frame.parameters.stemLength = stemLength
                this.frame.redrawInScene()
            })

        frameFolder.open()

        return this
    }

    createForkFolder() {
        let forkFolder = this.gui.addFolder('Fork')
        let params = {
            'Fork Length (mm)': this.frameParameters.fork.length,
            'Fork Offset (mm)': this.frameParameters.fork.offset,
            'Triple Tree Rake (deg)': this.frameParameters.fork.tripleTreeRake,
            'Fork Diameter (mm)': this.frameParameters.fork.diameter,
            'Fork Width (mm)': this.frameParameters.fork.width,
        }

        this.forkLength = forkFolder
            .add(params, 'Fork Length (mm)', 400, 1000, 1)
            .listen()
            .onChange((length) => {
                this.frame.parameters.fork.length = length
                this.frame.redrawInScene()
            })

        this.forkOffset = forkFolder
            .add(params, 'Fork Offset (mm)', 0, 100, 1)
            .listen()
            .onChange((offset) => {
                this.frame.parameters.fork.offset = offset
                this.frame.redrawInScene()
            })

        this.trippleTreeRake = forkFolder
            .add(params, 'Triple Tree Rake (deg)', 0, 10, 1)
            .listen()
            .onChange((tripleTreeRake) => {
                this.frame.parameters.fork.tripleTreeRake = tripleTreeRake
                this.frame.redrawInScene()
            })

        this.forkDiameter = forkFolder
            .add(params, 'Fork Diameter (mm)', 27, 49, 1)
            .listen()
            .onChange((diameter) => {
                this.frame.parameters.fork.diameter = diameter
                this.frame.redrawInScene()
            })

        this.forkWidth = forkFolder
            .add(params, 'Fork Width (mm)', 200, 400, 1)
            .listen()
            .onChange((width) => {
                this.frame.parameters.fork.width = width
                this.frame.redrawInScene()
            })

        forkFolder.open()

        return this
    }
}
