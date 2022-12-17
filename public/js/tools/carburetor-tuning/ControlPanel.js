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
            // .createDefaultsFolder()
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
}
