import { GUI } from 'three/gui';

export class ControlPanel {
    constructor(element, scene, fork) {
        this.gui = new GUI({
            container: element,
            width: 300,
            title: "Fork Parameters",
            closeFolders: true,
        })

        this.scene = scene
        this.fork = fork

        this.createViewFolder().createSettingsFolder()
    }

    createViewFolder() {
        let viewFolder = this.gui.addFolder('View')
        let params = {
            'Show Labels': true,
            'Transparent Objects': true,
        }

        viewFolder
            .add(params, 'Show Labels')
            .onChange((toggle) => {
                this.fork.setShowLabels(toggle)
                this.fork.redrawInScene()
            })

        viewFolder
            .add(params, 'Transparent Objects')
            .onChange((toggle) => {
                this.fork.setTransparency(toggle)
                this.fork.redrawInScene(this.scene)
            })

        return this
    }

    createSettingsFolder() {
        let settingsFolder = this.gui.addFolder('Settings')
        let params = {
            'Spring (N/mm)': 5.6,
            'Preload (mm)': 0,
            'Compression Damping': 0,
            'Rebound Damping': 0,
        }

        settingsFolder
            .add(params, 'Spring (N/mm)', 5, 9.5, 0.1)
            .onChange((spring) => {
                this.fork.spring = spring
                this.fork.redrawInScene(this.scene)
            })

        settingsFolder
            .add(params, 'Preload (mm)', 0, 100, 1)
            .onChange((preload) => {
                this.fork.preload = preload
                this.fork.redrawInScene(this.scene)
            })

        settingsFolder
            .add(params, 'Compression Damping', 0, 10, 1)
            .onChange((damping) => {
                this.fork.compressionDamping = damping
                this.fork.redrawInScene(this.scene)
            })

        settingsFolder
            .add(params, 'Rebound Damping', 0, 10, 1)
            .onChange((damping) => {
                this.fork.reboundDamping = damping
                this.fork.redrawInScene(this.scene)
            })

        return this
    }
}

export default {}