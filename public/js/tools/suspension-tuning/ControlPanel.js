import { GUI } from 'three/gui';

export class ControlPanel {
    constructor(element, scene, fork) {
        this.gui = new GUI({
            container: element,
            width: 200,
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
            'Preload (mm)': 0,
        }

        settingsFolder
            .add(params, 'Preload (mm)', 0, 100, 1, true)
            .onChange((preload) => {
                this.fork.preload = preload
                this.fork.redrawInScene(this.scene)
            })

        return this
    }
}

export default {}