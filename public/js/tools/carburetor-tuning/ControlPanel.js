class ControlPanel {
    constructor(element, chart) {
        this.chart = chart

        this.gui = new THREE.GUI({
            width: 400,
            closeOnTop: true,
            scrollable: false,
        })
        element.appendChild(this.gui.domElement)

        this.createViewFolder()
            .createIdleCircuitFolder()
            .createMainCircuitFolder()
    }

    createViewFolder() {
        let viewFolder = this.gui.addFolder('View')
        let params = {
            'Show Throttle Position': true,
            'Show Idle Circuit': false,
            'Show Main Fuel Jet': false,
            'Show Needle Clip Position': false,
            'Show Needle Diameter': false,
            'Show Needle Taper': false,
        }

        viewFolder
            .add(params, 'Show Throttle Position')
            .listen()
            .onChange((toggle) => {
                this.chart.throttlePosition.toggleVisible(toggle)
            })

        viewFolder
            .add(params, 'Show Idle Circuit')
            .listen()
            .onChange((toggle) => {
                this.chart.idleCircuit.toggleVisible(toggle)
            })

        viewFolder
            .add(params, 'Show Main Fuel Jet')
            .listen()
            .onChange((toggle) => {
                this.chart.mainFuelJet.toggleVisible(toggle)
            })

        viewFolder
            .add(params, 'Show Needle Clip Position')
            .listen()
            .onChange((toggle) => {
                this.chart.needleClipPosition.toggleVisible(toggle)
            })

        viewFolder
            .add(params, 'Show Needle Diameter')
            .listen()
            .onChange((toggle) => {
                this.chart.needleDiameter.toggleVisible(toggle)
            })

        viewFolder
            .add(params, 'Show Needle Taper')
            .listen()
            .onChange((toggle) => {
                this.chart.needleTaper.toggleVisible(toggle)
            })

        viewFolder.open()

        return this
    }

    createIdleCircuitFolder() {
        let idleCircuitFolder = this.gui.addFolder('Idle Circuit')
        let params = {
            'Idle Speed (RPM)': 1100,
            'Pilot Fuel Jet Size': 17.5,
            'Pilot Mix Screw Out Turns': 2.50
        }

        idleCircuitFolder.add(params, 'Idle Speed (RPM)', 600, 1600, 10).onChange((position) => {
            this.chart.throttlePosition.position = position / 4
            this.chart.throttlePosition.redrawInScene()
        })

        idleCircuitFolder.add(params, 'Pilot Fuel Jet Size', 12, 22, 0.5).onChange((size) => {
            this.chart.idleCircuit.fuelJetSize = size
            this.chart.idleCircuit.redrawInScene()
            this.chart.fuelMap.redrawInScene()
        })

        idleCircuitFolder.add(params, 'Pilot Mix Screw Out Turns', 0, 5, 0.25).onChange((turns) => {
            this.chart.idleCircuit.mixScrewTurns = turns
            this.chart.idleCircuit.redrawInScene()
            this.chart.fuelMap.redrawInScene()
        })


        idleCircuitFolder.open()

        return this
    }

    createMainCircuitFolder() {
        let mainCircuitFolder = this.gui.addFolder('Main Circuit')
        let params = {
             'Main Fuel Jet Size': 112.5,
             'Jet Needle Clip Position': 2,
             'Jet Needle Diameter': 68,
             'Jet Needle Taper': 1,
        }

        mainCircuitFolder.add(params, 'Main Fuel Jet Size', 110, 170, 0.5).onChange((size) => {
            this.chart.mainFuelJet.fuelJetSize = size
            this.chart.mainFuelJet.redrawInScene()
            this.chart.fuelMap.redrawInScene()
        })

        mainCircuitFolder.add(params, 'Jet Needle Clip Position', 1, 5, 1).onChange((position) => {
            this.chart.needleClipPosition.position = position
            this.chart.needleClipPosition.redrawInScene()
            this.chart.fuelMap.redrawInScene()
        })

        mainCircuitFolder.add(params, 'Jet Needle Diameter', 65, 75, 1).onChange((diameter) => {
            this.chart.needleDiameter.diameter = diameter
            this.chart.needleDiameter.redrawInScene()
            this.chart.fuelMap.redrawInScene()
        })

        mainCircuitFolder.add(params, 'Jet Needle Taper', 1, 2, 0.1).onChange((taper) => {
            this.chart.needleTaper.taper = taper
            this.chart.needleTaper.redrawInScene()
            this.chart.fuelMap.redrawInScene()
        })

        mainCircuitFolder.open()

        return this
    }
}
