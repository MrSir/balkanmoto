import { GUI } from 'three/gui';

export class ControlPanel {
    constructor(element, scene, fork) {
        this.gui = new GUI({
            container: element,
            width: 300,
            title: "Control Panel",
            closeFolders: true,
        })

        this.scene = scene
        this.fork = fork

        this.createSettingsFolder()
    }

    createViewFolder() {
        let folder = this.gui.addFolder('View')
        let params = {
            'Show Labels': true,
            'Transparent Objects': true,
        }

        folder
            .add(params, 'Show Labels')
            .onChange((toggle) => {
                this.fork.setShowLabels(toggle)
                this.fork.redrawInScene()
            })

        folder
            .add(params, 'Transparent Objects')
            .onChange((toggle) => {
                this.fork.setTransparency(toggle)
                this.fork.redrawInScene(this.scene)
            })

        return this
    }

    createSettingsFolder() {
        let folder = this.gui.addFolder('Settings')
        let params = {
            'Spring (N/mm)': 6.0,
            'Preload (mm)': 0,
            'Compression Damping': 0,
            'Rebound Damping': 0,
        }

        folder
            .add(params, 'Spring (N/mm)', 5, 9.5, 0.1)
            .onChange((spring) => {
                this.fork.spring = spring
                this.fork.redrawInScene(this.scene)
            })

        folder
            .add(params, 'Preload (mm)', 0, 50, 1)
            .onChange((preload) => {
                this.fork.preload = preload
                this.fork.redrawInScene(this.scene)
            })

        folder
            .add(params, 'Compression Damping', 0, 10, 1)
            .onChange((damping) => {
                this.fork.compressionDamping = damping
                this.fork.redrawInScene(this.scene)
            })

        folder
            .add(params, 'Rebound Damping', 0, 10, 1)
            .onChange((damping) => {
                this.fork.reboundDamping = damping
                this.fork.redrawInScene(this.scene)
            })

        return this
    }

    createInteractionFolder() {
        let folder = this.gui.addFolder('Interactions')
        let params = {
            'Compression (mm)': 0.0,
        }

        folder
            .add(params, 'Compression (mm)', 0, 210, 1)
            .onChange((compression) => {
                this.fork.compression = compression
                this.fork.redrawInScene(this.scene)
            })
    }
}

export default {}