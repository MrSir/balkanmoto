import { GUI } from 'three/gui';

export class ControlPanel {
    constructor(element, scene, frame) {
        this.gui = new GUI({
            container: element,
            width: 300,
            title: "Control Panel",
            closeFolders: true,
        })

        this.scene = scene
        this.frame = frame

        this.createSettingsFolder().createLoadFolder()
    }

    createSettingsFolder() {
        let folder = this.gui.addFolder('Settings')
        let params = {
            'Fork Tube Offset (mm)': 0.0,
            'Spring Rate (N/mm)': 6.0,
            'Preload (mm)': 0,
            'Compression Damping': 0,
            'Rebound Damping': 0,
        }

        folder
            .add(params, 'Fork Tube Offset (mm)', 0, 30, 1)
            .onChange((offset) => {
                this.frame.parameters.fork.offset = offset
                this.frame.redrawInScene(this.scene)
            })

        folder
            .add(params, 'Spring Rate (N/mm)', 5, 9.5, 0.1)
            .onChange((rate) => {
                this.frame.parameters.fork.spring.rate = rate
                this.frame.redrawInScene(this.scene)
            })

        folder
            .add(params, 'Preload (mm)', 0, 50, 1)
            .onChange((preload) => {
                this.frame.parameters.fork.preload = preload
                this.frame.redrawInScene(this.scene)
            })

        folder
            .add(params, 'Compression Damping', 0, 10, 1)
            .onChange((damping) => {
                this.frame.parameters.fork.compressionDamping = damping
                this.frame.redrawInScene(this.scene)
            })

        folder
            .add(params, 'Rebound Damping', 0, 10, 1)
            .onChange((damping) => {
                this.frame.parameters.fork.reboundDamping = damping
                this.frame.redrawInScene(this.scene)
            })

        return this
    }

    createLoadFolder() {
        let folder = this.gui.addFolder('Load')
        let params = {
            'Motorcycle Weight (kg)': 205.0,
            'Rider Weight (kg)': 95.0
        }

        folder
            .add(params, 'Motorcycle Weight (kg)', 0, 300, 1)
            .onChange((motorcycleWeight) => {
                this.frame.parameters.load.motorcycleWeight = motorcycleWeight
            })

        folder
            .add(params, 'Rider Weight (kg)', 0, 300, 1)
            .onChange((riderWeight) => {
                this.frame.parameters.load.riderWeight = riderWeight
            })

        return this
    }
}

export default {}