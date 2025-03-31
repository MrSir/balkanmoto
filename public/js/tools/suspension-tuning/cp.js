import { GUI } from 'three/gui';

export class ControlPanel {
    constructor(element, scene, geometry) {
        this.gui = new GUI({
            container: element,
            width: 300,
            title: "Control Panel",
            closeFolders: true,
        })

        this.scene = scene
        this.geometry = geometry

        this.createMotorcycleFolder().createRiderFolder().createTuningFolder()
    }

    createMotorcycleFolder() {
        let folder = this.gui.addFolder('Motorcycle')
        let params = {
            'Weight (kg)': this.geometry.frame.dimensions.weight,
        }

        folder
            .add(params, 'Weight (kg)', 0, 300, 1)
            .onChange((weight) => {
                this.geometry.parameters.weight = weight
                this.geometry.update()
                this.geometry.updateGeometry()
            })

        folder.close()

        return this
    }

    createRiderFolder() {
        let folder = this.gui.addFolder('Rider')
        let params = {
            'Weight (kg)': this.geometry.rider.dimensions.weight,
            'Gear Weight (kg)': this.geometry.rider.dimensions.gearWeight,
        }

        folder
            .add(params, 'Weight (kg)', 0, 200, 1)
            .onChange((weight) => {
                this.geometry.parameters.rider.weight = weight
                this.geometry.update()
                this.geometry.updateGeometry()
            })

        folder
            .add(params, 'Gear Weight (kg)', 0, 50, 1)
            .onChange((weight) => {
                this.geometry.parameters.rider.gearWeight = weight
                this.geometry.update()
                this.geometry.updateGeometry()
            })

        return this
    }

    createTuningFolder() {
        let folder = this.gui.addFolder('Tuning')
        let params = {
            'Fork Tube Offset (mm)': this.geometry.fork.dimensions.offset,
            'Spring Rate (N/mm)': this.geometry.spring.dimensions.rate,
            'Spring Preload (mm)':this.geometry.spring.dimensions.preload,
            'Compression Damping': this.geometry.fork.dimensions.compressionDamping,
            'Rebound Damping': this.geometry.fork.dimensions.reboundDamping,
            'Oil Weight': this.geometry.fork.dimensions.oilWeight,
        }

        folder
            .add(params, 'Fork Tube Offset (mm)', 0, 30, 1)
            .onChange((offset) => {
                this.geometry.parameters.fork.offset = offset
                this.geometry.update()
                this.geometry.updateGeometry()
            })

        folder
            .add(params, 'Spring Rate (N/mm)', 5, 9.5, 0.1)
            .onChange((rate) => {
                this.geometry.parameters.fork.spring.rate = rate
                this.geometry.update()
                this.geometry.updateGeometry()
            })

        folder
            .add(params, 'Spring Preload (mm)', 0, 15, 0.5)
            .onChange((preload) => {
                this.geometry.parameters.fork.spring.preload = preload
                this.geometry.update()
                this.geometry.updateGeometry()
            })

        folder
            .add(params, 'Compression Damping', 0, 10, 1)
            .onChange((damping) => {
                this.geometry.parameters.fork.compressionDamping = damping
                this.geometry.update()
                this.geometry.updateGeometry()
            })

        folder
            .add(params, 'Rebound Damping', 0, 10, 1)
            .onChange((damping) => {
                this.geometry.parameters.fork.reboundDamping = damping
                this.geometry.update()
                this.geometry.updateGeometry()
            })

        folder
            .add(params, 'Oil Weight', 5, 15, 2.5)
            .onChange((weight) => {
                this.geometry.parameters.fork.oilWeight = weight
                this.geometry.update()
                this.geometry.updateGeometry()
            })

        return this
    }
}

export default {}