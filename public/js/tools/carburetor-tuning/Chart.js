class Chart extends ChartElement{
    constructor(scene, renderer, camera, font, width, height, z) {
        super(scene, renderer, camera, font)

        this.width = width
        this.height = height
        this.z = z

        this.throttlePosition = new ThrottlePosition(scene, renderer, camera, font, this.height, z)
        this.idleCircuit = new IdleCircuit(scene, renderer, camera, font, this.width, this.height, z)
        this.mainFuelJet = new MainFuelJet(scene, renderer, camera, font, this.width, this.height, z)
        this.needleClipPosition = new NeedleClipPosition(scene, renderer, camera, font, this.width, this.height, z)
        this.needleDiameter = new NeedleDiameter(scene, renderer, camera, font, this.width, this.height, z)
        this.needleTaper = new NeedleTaper(scene, renderer, camera, font, this.width, this.height, z)

        this.intakeModVisibility = false
        this.intakeMod = null
        this.betterFilter = new BetterFilter(scene, renderer, camera, font, this.width, this.height, z)
        this.heavybreatherIntake = new HeavyBreatherIntake(scene, renderer, camera, font, this.width, this.height, z)
        this.podFilters = new PodFilters(scene, renderer, camera, font, this.width, this.height, z)

        this.exhaustModVisibility = false
        this.exhaustMod = null
        this.drilledStock = new DrilledStock(scene, renderer, camera, font, this.width, this.height, z)
        this.slipOns = new SlipOns(scene, renderer, camera, font, this.width, this.height, z)
        this.fullExhaust = new FullExhaust(scene, renderer, camera, font, this.width, this.height, z)

        this.fuelMap = new FuelMap(scene, renderer, camera, font, this.width, this.height, z, this)
    }

    drawYAxis() {
        let yAxis = this.buildLine(
            [
                this.buildPoint(0, 0, this.z),
                this.buildPoint(0, this.height, this.z),
            ],
            this.blackMaterial
        )
        this.scene.add(yAxis)

        let yAxisLineSpace = this.height / 4
        let yAxisLineWidth = 20
        let yAxisElements = []

        const yAxisLabels = ['Just Air', 'Lean', 'Optimal', 'Rich', 'Just Fuel']
        for (let i = 0; i <= 4; i++) {
            yAxisElements.push(
                this.buildLine(
                    [
                        this.buildPoint(-yAxisLineWidth/2, i*yAxisLineSpace, this.z),
                        this.buildPoint(yAxisLineWidth/2, i*yAxisLineSpace, this.z)
                    ],
                    this.blackMaterial
                )
            )
            yAxisElements.push(
                this.buildLabel(yAxisLabels[i], - 200,i*yAxisLineSpace, this.z, this.blackMaterial)
            )
        }
        yAxisElements.forEach((element) => this.scene.add(element))
    }

    drawXAxis() {
        let xAxisY = 0
        let xAxis = this.buildLine(
            [
                this.buildPoint(0, xAxisY, this.z),
                this.buildPoint(0 + this.width, xAxisY, this.z),
            ],
            this.blackMaterial
        )
        this.scene.add(xAxis)

        let xAxisLineSpace = this.width / 4
        let xAxisLineHeight = 20
        let xAxisElements = []

        const xAxisLabels = ['0%', '25%', '50%', '75%', '100%']
        for (let i = 0; i <= 4; i++) {
            xAxisElements.push(
                this.buildLine(
                    [
                        this.buildPoint(i*xAxisLineSpace, xAxisY-xAxisLineHeight, this.z),
                        this.buildPoint(i*xAxisLineSpace, xAxisY+xAxisLineHeight, this.z)
                    ],
                    this.blackMaterial
                )
            )
            xAxisElements.push(
                this.buildLabel(xAxisLabels[i], i*xAxisLineSpace,xAxisY - 100, this.z, this.blackMaterial)
            )
        }
        xAxisElements.forEach((element) => this.scene.add(element))

        let title = this.buildLabel(
            'Throttle Position',
            (2*xAxisLineSpace) - 120,
            xAxisY - 200,
            this.z,
            this.blackMaterial
        )
        this.scene.add(title)
    }

    drawOptimalLine() {
        this.scene.add(
            this.buildLine(
                [
                    this.buildPoint(0, this.height/2, this.z),
                    this.buildPoint(this.width, this.height/2, this.z)
                ],
                this.blackMaterial
            )
        )
    }

    drawChart() {
        this.throttlePosition.toggleVisible(true)
        this.idleCircuit.toggleVisible(true)
        this.mainFuelJet.toggleVisible(true)
        this.needleClipPosition.toggleVisible(true)
        this.needleDiameter.toggleVisible(true)
        this.needleTaper.toggleVisible(true)
        this.betterFilter.toggleVisible(true)
        this.heavybreatherIntake.toggleVisible(true)
        this.podFilters.toggleVisible(true)
        this.drilledStock.toggleVisible(true)
        this.slipOns.toggleVisible(true)
        this.fullExhaust.toggleVisible(true)
        this.fuelMap.toggleVisible(true)

        // hide the rest after fuel map is built
        this.idleCircuit.toggleVisible(false)
        this.mainFuelJet.toggleVisible(false)
        this.needleClipPosition.toggleVisible(false)
        this.needleDiameter.toggleVisible(false)
        this.needleTaper.toggleVisible(false)

        // hide mods
        this.betterFilter.toggleVisible(false)
        this.heavybreatherIntake.toggleVisible(false)
        this.podFilters.toggleVisible(false)
        this.drilledStock.toggleVisible(false)
        this.slipOns.toggleVisible(false)
        this.fullExhaust.toggleVisible(false)

        this.drawYAxis()
        this.drawXAxis()
        this.drawOptimalLine()
    }
}