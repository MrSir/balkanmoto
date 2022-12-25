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
            .createModificationsFolder()
            .createProblemsFolder()
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
            'Show Intake Mod': false,
            'Show Exhaust Mod': false,
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

        viewFolder
            .add(params, 'Show Intake Mod')
            .listen()
            .onChange((toggle) => {
                this.chart.intakeModVisibility = toggle
                if (this.chart.intakeMod !== null) {
                    this.chart.intakeMod.toggleVisible(this.chart.intakeModVisibility)
                }
            })

        viewFolder
            .add(params, 'Show Exhaust Mod')
            .listen()
            .onChange((toggle) => {
                this.chart.exhaustModVisibility = toggle
                if (this.chart.exhaustMod !== null) {
                    this.chart.exhaustMod.toggleVisible(this.chart.exhaustModVisibility)
                }
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

        idleCircuitFolder.add(params, 'Pilot Mix Screw Out Turns', 0, 5, 0.125).onChange((turns) => {
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

    createModificationsFolder() {
        let modificationsFolder = this.gui.addFolder('Modifications')
        let params = {
            'Intake': 'Stock',
            'Exhaust': 'Stock',
        }

        modificationsFolder
            .add(params, 'Intake')
            .options(['Stock', 'Better Breathing Filter', 'Heavy Breather/Intake', 'POD Filters'])
            .listen()
            .onChange((intake) => {
                let oldIntakeMod = this.chart.intakeMod

                if (oldIntakeMod !== null) {
                    oldIntakeMod.removeFromScene()
                }

                switch(intake) {
                    case 'Better Breathing Filter':
                        this.chart.intakeMod = this.chart.betterFilter
                        this.chart.intakeMod.toggleVisible(this.chart.intakeModVisibility)

                        break;
                    case 'Heavy Breather/Intake':
                        this.chart.intakeMod = this.chart.heavybreatherIntake
                        this.chart.intakeMod.toggleVisible(this.chart.intakeModVisibility)

                        break;
                    case 'POD Filters':
                        this.chart.intakeMod = this.chart.podFilters
                        this.chart.intakeMod.toggleVisible(this.chart.intakeModVisibility)

                        break;
                    default:
                        this.chart.intakeMod.removeFromScene()
                        this.chart.intakeMod = null
                }

                this.chart.fuelMap.redrawInScene()
            })

        modificationsFolder
            .add(params, 'Exhaust')
            .options(['Stock', 'Drilled Stock', 'Slip-ons', 'Full Exhaust'])
            .listen()
            .onChange((exhaust) => {
                let oldExhaustMod = this.chart.exhaustMod

                if (oldExhaustMod !== null) {
                    oldExhaustMod.removeFromScene()
                }

                switch(exhaust) {
                    case 'Drilled Stock':
                        this.chart.exhaustMod = this.chart.drilledStock
                        this.chart.exhaustMod.toggleVisible(this.chart.exhaustModVisibility)

                        break;
                    case 'Slip-ons':
                        this.chart.exhaustMod = this.chart.slipOns
                        this.chart.exhaustMod.toggleVisible(this.chart.exhaustModVisibility)

                        break;
                    case 'Full Exhaust':
                        this.chart.exhaustMod = this.chart.fullExhaust
                        this.chart.exhaustMod.toggleVisible(this.chart.exhaustModVisibility)

                        break;
                    default:
                        this.chart.exhaustMod.removeFromScene()
                        this.chart.exhaustMod = null
                }

                this.chart.fuelMap.redrawInScene()
            })

        modificationsFolder.open()

        return this
    }

    createProblemsFolder() {
        let modificationsFolder = this.gui.addFolder('Problems')
        let params = {
            'Problem': 'None'
        }

        modificationsFolder
            .add(params, 'Problem')
            .options(['None', 'Air Leak In Air Box', 'Air Leak In Carburetor Boots', 'Air Leak In Exhaust'])
            .listen()
            .onChange((problem) => {
                console.log(problem)
            })

        modificationsFolder.open()

        return this
    }
}
