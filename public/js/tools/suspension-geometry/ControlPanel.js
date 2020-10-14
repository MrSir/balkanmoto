'use strict'

class ControlPanel {
    previousDefault = 'Custom'
    defaultName = 'Custom'
    initialized = false

    customParameters

    constructor(element, frame, frameParameters) {
        this.gui = new THREE.GUI({
            width: 350,
            closeOnTop: true,
            scrollable: false,
        })
        element.appendChild(this.gui.domElement)

        this.frame = frame
        this.frameParameters = frameParameters

        this.createViewFolder().createDefaultsFolder().createCustomFolder()
    }

    cleanUpGui() {
        if (this.initialized || this.previousDefault !== 'Custom') {
            this.gui.removeFolder(this.frontTireFolder)
            this.gui.removeFolder(this.rearTireFolder)
            this.gui.removeFolder(this.frameFolder)
            this.gui.removeFolder(this.forkFolder)
        } else {
            this.gui.removeFolder(this.customFolder)
            this.gui.remove(this.initializeButton)
        }
    }

    resetGuiTo(newParams) {
        this.frameParameters = newParams

        this.cleanUpGui()

        if (this.defaultName !== 'Custom') {
            this.initialized = true
            this.createFrontTireFolder().createRearTireFolder().createFrameFolder().createForkFolder()
        } else {
            this.initialized = false
            this.createCustomFolder()
        }
    }

    createViewFolder() {
        let viewFolder = this.gui.addFolder('View')
        let params = {
            'Show Geometry': false,
            'Show Labels': true,
            'Transparent Objects': false,
        }

        viewFolder
            .add(params, 'Show Geometry')
            .listen()
            .onChange((toggle) => {
                this.frame.setShowGeometry(toggle)

                if (this.initialized) {
                    this.frame.redrawInScene()
                }
            })

        viewFolder
            .add(params, 'Show Labels')
            .listen()
            .onChange((toggle) => {
                this.frame.setShowLabels(toggle)

                if (this.initialized) {
                    this.frame.redrawInScene()
                }
            })

        viewFolder
            .add(params, 'Transparent Objects')
            .listen()
            .onChange((toggle) => {
                this.frame.setTransparentObjects(toggle)

                if (this.initialized) {
                    this.frame.redrawInScene()
                }
            })

        viewFolder.open()

        return this
    }

    createDefaultsFolder() {
        let defaultsFolder = this.gui.addFolder('Defaults')
        let params = {
            Defaults: 'Custom',
        }

        let defaults = new Defaults()

        this.customParameters = defaults.findDefaults('Custom')

        defaultsFolder
            .add(params, 'Defaults')
            .options(defaults.getOptions())
            .listen()
            .onChange((name) => {
                this.previousDefault = this.defaultName
                this.defaultName = name

                this.frameParameters = defaults.findDefaults(name)

                this.resetGuiTo(this.frameParameters)

                if (name !== 'Custom') {
                    this.frame.setParameters(this.frameParameters).initialCalculate().redrawInScene()
                } else {
                    this.frame.removeFromScene()
                }
            })

        defaultsFolder.open()

        return this
    }

    createCustomFolder() {
        this.customFolder = this.gui.addFolder('Custom Frame')
        let params = {
            'Stem Rake (deg)': 30,
            'Wheelbase (mm)': 1000,
            'Fork Length (mm)': 1000,
            'Fork Offset (mm)': 60,
            'Triple Tree Rake (deg)': 0,
            'Front Tire Width (mm)': 130,
            'Front Tire Aspect': 90,
            'Front Rim Size (in)': 17,
            'Rear Tire Width (mm)': 110,
            'Rear Tire Aspect': 90,
            'Rear Rim Size (in)': 18,
        }

        this.customFolder
            .add(params, 'Stem Rake (deg)', 0, 45, 0.5)
            .listen()
            .onChange((rake) => {
                this.frameParameters.rake = rake
            })

        this.customFolder
            .add(params, 'Wheelbase (mm)', 1000, 1800, 5)
            .listen()
            .onChange((wheelbase) => {
                this.frameParameters.wheelbase = wheelbase
            })

        this.customFolder
            .add(params, 'Fork Length (mm)', 400, 1000, 1)
            .listen()
            .onChange((length) => {
                this.frameParameters.fork.length = length
            })

        this.customFolder
            .add(params, 'Fork Offset (mm)', 0, 80, 5)
            .listen()
            .onChange((offset) => {
                this.frameParameters.fork.offset = offset
            })

        this.customFolder
            .add(params, 'Triple Tree Rake (deg)', 0, 10, 1)
            .listen()
            .onChange((tripleTreeRake) => {
                this.frameParameters.fork.tripleTreeRake = tripleTreeRake
            })

        this.customFolder.add(params, 'Front Tire Width (mm)', 70, 320, 5).onChange((width) => {
            this.frameParameters.frontTire.width = width
        })

        this.customFolder
            .add(params, 'Front Tire Aspect', 25, 95, 5)
            .listen()
            .onChange((aspect) => {
                this.frameParameters.frontTire.aspect = aspect
            })

        this.customFolder
            .add(params, 'Front Rim Size (in)', 13, 22, 1)
            .listen()
            .onChange((rimDiameterInInches) => {
                this.frameParameters.frontTire.rimDiameterInInches = rimDiameterInInches
            })

        this.customFolder.add(params, 'Rear Tire Width (mm)', 70, 320, 5).onChange((width) => {
            this.frameParameters.rearTire.width = width
        })

        this.customFolder
            .add(params, 'Rear Tire Aspect', 25, 95, 5)
            .listen()
            .onChange((aspect) => {
                this.frameParameters.rearTire.aspect = aspect
            })

        this.customFolder
            .add(params, 'Rear Rim Size (in)', 13, 22, 1)
            .listen()
            .onChange((rimDiameterInInches) => {
                this.frameParameters.rearTire.rimDiameterInInches = rimDiameterInInches
            })

        this.customFolder.open()

        let initializeObject = {
            initialize: () => {
                this.gui.removeFolder(this.customFolder)
                this.gui.remove(this.initializeButton)

                this.frame.setParameters(this.frameParameters).initialCalculate().redrawInScene()

                this.createFrontTireFolder().createRearTireFolder().createFrameFolder().createForkFolder()

                this.initialized = true
            },
        }

        this.initializeButton = this.gui.add(initializeObject, 'initialize').name('INITIALIZE FRAME')

        return this
    }

    createFrontTireFolder() {
        this.frontTireFolder = this.gui.addFolder('Front Tire')
        let params = {
            'Tire Width (mm)': this.frameParameters.frontTire.width,
            'Tire Aspect': this.frameParameters.frontTire.aspect,
            'Rim Size (in)': this.frameParameters.frontTire.rimDiameterInInches,
        }

        this.frontTireFolder.add(params, 'Tire Width (mm)', 70, 320, 5).onChange((width) => {
            this.frameParameters.frontTire.width = width
            this.frame.setParameters(this.frameParameters).redrawInScene()
        })

        this.frontTireFolder
            .add(params, 'Tire Aspect', 25, 95, 5)
            .listen()
            .onChange((aspect) => {
                this.frameParameters.frontTire.aspect = aspect
                this.frame.setParameters(this.frameParameters).redrawInScene()
            })

        this.frontTireFolder
            .add(params, 'Rim Size (in)', 13, 22, 1)
            .listen()
            .onChange((rimDiameterInInches) => {
                this.frameParameters.frontTire.rimDiameterInInches = rimDiameterInInches
                this.frame.setParameters(this.frameParameters).redrawInScene()
            })

        this.frontTireFolder.close()

        return this
    }

    createRearTireFolder() {
        this.rearTireFolder = this.gui.addFolder('Rear Tire')
        let params = {
            'Tire Width (mm)': this.frameParameters.rearTire.width,
            'Tire Aspect': this.frameParameters.rearTire.aspect,
            'Rim Size (in)': this.frameParameters.rearTire.rimDiameterInInches,
        }

        this.rearTireFolder
            .add(params, 'Tire Width (mm)', 70, 320, 5)
            .listen()
            .onChange((width) => {
                this.frameParameters.rearTire.width = width
                this.frame.setParameters(this.frameParameters).redrawInScene()
            })

        this.rearTireFolder
            .add(params, 'Tire Aspect', 25, 95, 5)
            .listen()
            .onChange((aspect) => {
                this.frameParameters.rearTire.aspect = aspect
                this.frame.setParameters(this.frameParameters).redrawInScene()
            })

        this.rearTireFolder
            .add(params, 'Rim Size (in)', 13, 22, 1)
            .listen()
            .onChange((rimDiameterInInches) => {
                this.frameParameters.rearTire.rimDiameterInInches = rimDiameterInInches
                this.frame.setParameters(this.frameParameters).redrawInScene()
            })

        this.rearTireFolder.close()

        return this
    }

    createFrameFolder() {
        this.frameFolder = this.gui.addFolder('Frame')
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
        this.frameFolder
            .add(params, 'Stem Rake (deg)', 0, 45, 0.5)
            .listen()
            .onChange((rake) => {
                this.frameParameters.rake = rake
                this.frame.setParameters(this.frameParameters).redrawInScene()
            })

        this.frameFolder
            .add(params, 'Stem Length (mm)', 100, 250, 1)
            .listen()
            .onChange((stemLength) => {
                this.frameParameters.stemLength = stemLength
                this.frame.setParameters(this.frameParameters).redrawInScene()
            })

        this.frameFolder.open()

        return this
    }

    createForkFolder() {
        this.forkFolder = this.gui.addFolder('Fork')
        let params = {
            'Fork Length (mm)': this.frameParameters.fork.length,
            'Fork Offset (mm)': this.frameParameters.fork.offset,
            'Triple Tree Rake (deg)': this.frameParameters.fork.tripleTreeRake,
            'Fork Diameter (mm)': this.frameParameters.fork.diameter,
            'Fork Width (mm)': this.frameParameters.fork.width,
        }

        this.forkFolder
            .add(params, 'Fork Length (mm)', 400, 1000, 1)
            .listen()
            .onChange((length) => {
                this.frameParameters.fork.length = length
                this.frame.setParameters(this.frameParameters).redrawInScene()
            })

        this.forkFolder
            .add(params, 'Fork Offset (mm)', 0, 80, 5)
            .listen()
            .onChange((offset) => {
                this.frameParameters.fork.offset = offset
                this.frame.setParameters(this.frameParameters).redrawInScene()
            })

        this.forkFolder
            .add(params, 'Triple Tree Rake (deg)', 0, 10, 1)
            .listen()
            .onChange((tripleTreeRake) => {
                this.frameParameters.fork.tripleTreeRake = tripleTreeRake
                this.frame.setParameters(this.frameParameters).redrawInScene()
            })

        this.forkFolder
            .add(params, 'Fork Diameter (mm)', 27, 49, 1)
            .listen()
            .onChange((diameter) => {
                this.frameParameters.fork.diameter = diameter
                this.frame.setParameters(this.frameParameters).redrawInScene()
            })

        this.forkFolder
            .add(params, 'Fork Width (mm)', 100, 400, 1)
            .listen()
            .onChange((width) => {
                this.frameParameters.fork.width = width
                this.frame.setParameters(this.frameParameters).redrawInScene()
            })

        this.forkFolder.open()

        return this
    }
}
