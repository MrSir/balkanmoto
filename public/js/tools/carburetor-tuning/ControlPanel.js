class ControlPanel {
    constructor(element, chart) {
        this.previousInitialized = false
        this.initialized = false

        this.chart = chart

        this.gui = new THREE.GUI({
            width: 400,
            closeOnTop: true,
            scrollable: false,
        })
        element.appendChild(this.gui.domElement)

        this.createViewFolder()
            .createIdleCircuitFolder()
    }

    cleanUpGui() {
        // this.gui.removeFolder(this.frontTireFolder)
        // this.gui.removeFolder(this.rearTireFolder)
        // this.gui.removeFolder(this.frameFolder)
        // this.gui.removeFolder(this.tripleTreeFolder)
        // this.gui.removeFolder(this.forkFolder)
    }

    createViewFolder() {
        let viewFolder = this.gui.addFolder('View')
        let params = {
            'Show Throttle Position': true,
        }

        viewFolder
            .add(params, 'Show Throttle Position')
            .listen()
            .onChange((toggle) => {
                this.chart.throttlePosition.toggleVisible(toggle)
            })

        viewFolder.open()

        return this
    }

    createIdleCircuitFolder() {
        this.idleCircuitFolder = this.gui.addFolder('Idle Circuit')
        let params = {
            'Idle Speed (RPM)': this.chart.throttlePosition.position * 4,
            'Pilot Fuel Jet Size': 17.5,
            'Pilot Air/Fuel Mix Screw Turns': 2.50
        }

        this.idleCircuitFolder.add(params, 'Idle Speed (RPM)', 600, 1600, 10).onChange((position) => {
            this.chart.throttlePosition.position = position / 4
            this.chart.throttlePosition.redrawInScene()
        })

        this.idleCircuitFolder.add(params, 'Pilot Fuel Jet Size', 12, 22, 0.5).onChange((position) => {
            //TBD
        })

        this.idleCircuitFolder.add(params, 'Pilot Air/Fuel Mix Screw Turns', 0, 5, 0.25).onChange((position) => {
            //TBD
        })


        this.idleCircuitFolder.open()

        return this
    }
}
