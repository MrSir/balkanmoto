class ControlPanel {
    constructor(element) {
        this.previousInitialized = false
        this.initialized = false

        this.gui = new THREE.GUI({
            width: 400,
            closeOnTop: true,
            scrollable: false,
        })
        element.appendChild(this.gui.domElement)

        this.createViewFolder()
            .createDefaultsFolder()
            // .createFrontTireFolder()
            // .createRearTireFolder()
            // .createFrameFolder()
            // .createTripleTreeFolder()
            // .createForkFolder()
            // .createInitializeButton()
    }

    cleanUpGui() {
        // this.gui.removeFolder(this.frontTireFolder)
        // this.gui.removeFolder(this.rearTireFolder)
        // this.gui.removeFolder(this.frameFolder)
        // this.gui.removeFolder(this.tripleTreeFolder)
        // this.gui.removeFolder(this.forkFolder)

        if (this.initialized && !this.previousInitialized) {
            this.gui.remove(this.initializeButton)
        }
    }

    resetGuiTo(newParams) {
        this.frameParameters = newParams

        this.cleanUpGui()

        // this.createFrontTireFolder()
        //     .createRearTireFolder()
        //     .createFrameFolder()
        //     .createTripleTreeFolder()
        //     .createForkFolder()

        if (!this.initialized) {
            this.createInitializeButton()
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
                this.previousInitialized = this.initialized
                this.initialized = name !== 'Custom'

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

    createInitializeButton() {
        let initializeObject = {
            initialize: () => {
                this.previousInitialized = this.initialized
                this.initialized = true

                this.resetGuiTo(this.frameParameters)
                this.frame.setParameters(this.frameParameters).initialCalculate().redrawInScene()
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
            if (this.initialized) {
                this.frame.setParameters(this.frameParameters).redrawInScene()
            }
        })

        this.frontTireFolder
            .add(params, 'Tire Aspect', 25, 95, 5)
            .listen()
            .onChange((aspect) => {
                this.frameParameters.frontTire.aspect = aspect
                if (this.initialized) {
                    this.frame.setParameters(this.frameParameters).redrawInScene()
                }
            })

        this.frontTireFolder
            .add(params, 'Rim Size (in)', 13, 22, 1)
            .listen()
            .onChange((rimDiameterInInches) => {
                this.frameParameters.frontTire.rimDiameterInInches = rimDiameterInInches
                if (this.initialized) {
                    this.frame.setParameters(this.frameParameters).redrawInScene()
                }
            })

        if (!this.initialized) {
            this.frontTireFolder.open()
        }

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
                if (this.initialized) {
                    this.frame.setParameters(this.frameParameters).redrawInScene()
                }
            })

        this.rearTireFolder
            .add(params, 'Tire Aspect', 25, 95, 5)
            .listen()
            .onChange((aspect) => {
                this.frameParameters.rearTire.aspect = aspect
                if (this.initialized) {
                    this.frame.setParameters(this.frameParameters).redrawInScene()
                }
            })

        this.rearTireFolder
            .add(params, 'Rim Size (in)', 13, 22, 1)
            .listen()
            .onChange((rimDiameterInInches) => {
                this.frameParameters.rearTire.rimDiameterInInches = rimDiameterInInches
                if (this.initialized) {
                    this.frame.setParameters(this.frameParameters).redrawInScene()
                }
            })

        if (!this.initialized) {
            this.rearTireFolder.open()
        }

        return this
    }

    createFrameFolder() {
        this.frameFolder = this.gui.addFolder('Frame')
        let params = {
            'Stem Rake (deg)': this.frameParameters.rake,
            'Stem Length (mm)': this.frameParameters.stemLength,
            'Wheelbase (mm)': this.frameParameters.wheelbase,
        }

        this.frameFolder
            .add(params, 'Stem Rake (deg)', 0, 45, 0.5)
            .listen()
            .onChange((rake) => {
                this.frameParameters.rake = rake
                if (this.initialized) {
                    this.frame.setParameters(this.frameParameters).redrawInScene()
                }
            })

        this.frameFolder
            .add(params, 'Stem Length (mm)', 100, 250, 1)
            .listen()
            .onChange((stemLength) => {
                this.frameParameters.stemLength = stemLength
                if (this.initialized) {
                    this.frame.setParameters(this.frameParameters).redrawInScene()
                }
            })

        if (!this.initialized) {
            this.frameFolder
                .add(params, 'Wheelbase (mm)', 1000, 2000, 1)
                .listen()
                .onChange((wheelbase) => {
                    this.frameParameters.wheelbase = wheelbase
                })
        }

        this.frameFolder.open()

        return this
    }

    createTripleTreeFolder() {
        this.tripleTreeFolder = this.gui.addFolder('Triple Tree')
        let params = {
            'Offset (mm)': this.frameParameters.tripleTree.offset,
            'Rake (deg)': this.frameParameters.tripleTree.rake,
            'Top Yoke Thickness (mm)': this.frameParameters.tripleTree.topYokeThickness,
            'Bottom Yoke Thickness (mm)': this.frameParameters.tripleTree.bottomYokeThickness,
        }

        this.tripleTreeFolder
            .add(params, 'Offset (mm)', 0, 80, 1)
            .listen()
            .onChange((offset) => {
                this.frameParameters.tripleTree.offset = offset
                if (this.initialized) {
                    this.frame.setParameters(this.frameParameters).redrawInScene()
                }
            })

        this.tripleTreeFolder
            .add(params, 'Rake (deg)', 0, 10, 1)
            .listen()
            .onChange((rake) => {
                this.frameParameters.tripleTree.rake = rake
                if (this.initialized) {
                    this.frame.setParameters(this.frameParameters).redrawInScene()
                }
            })

        this.tripleTreeFolder
            .add(params, 'Top Yoke Thickness (mm)', 20, 40, 1)
            .listen()
            .onChange((thickness) => {
                this.frameParameters.tripleTree.topYokeThickness = thickness
                if (this.initialized) {
                    this.frame.setParameters(this.frameParameters).redrawInScene()
                }
            })

        this.tripleTreeFolder
            .add(params, 'Bottom Yoke Thickness (mm)', 20, 40, 1)
            .listen()
            .onChange((thickness) => {
                this.frameParameters.tripleTree.bottomYokeThickness = thickness
                if (this.initialized) {
                    this.frame.setParameters(this.frameParameters).redrawInScene()
                }
            })

        this.tripleTreeFolder.open()

        return this
    }

    createForkFolder() {
        this.forkFolder = this.gui.addFolder('Fork')
        let params = {
            'Offset (mm)': this.frameParameters.fork.offset,
            'Length (mm)': this.frameParameters.fork.length,
            'Diameter (mm)': this.frameParameters.fork.diameter,
            'Width (mm)': this.frameParameters.fork.width,
        }

        this.forkFolder
            .add(params, 'Length (mm)', 600, 1000, 1)
            .listen()
            .onChange((length) => {
                this.frameParameters.fork.length = length
                if (this.initialized) {
                    this.frame.setParameters(this.frameParameters).redrawInScene()
                }
            })

        this.forkFolder
            .add(params, 'Offset (mm)', 0, 150, 1)
            .listen()
            .onChange((offset) => {
                this.frameParameters.fork.offset = offset
                if (this.initialized) {
                    this.frame.setParameters(this.frameParameters).redrawInScene()
                }
            })

        this.forkFolder
            .add(params, 'Diameter (mm)', 27, 49, 1)
            .listen()
            .onChange((diameter) => {
                this.frameParameters.fork.diameter = diameter
                if (this.initialized) {
                    this.frame.setParameters(this.frameParameters).redrawInScene()
                }
            })

        this.forkFolder
            .add(params, 'Width (mm)', 100, 400, 1)
            .listen()
            .onChange((width) => {
                this.frameParameters.fork.width = width
                if (this.initialized) {
                    this.frame.setParameters(this.frameParameters).redrawInScene()
                }
            })

        this.forkFolder.open()

        return this
    }
}
