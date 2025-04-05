import { GUI } from 'three/gui';

export class SceneControlPanel {
    constructor(element, scene, objects) {
        this.gui = new GUI({
            container: element,
            width: 300,
            title: "Scene Control Panel",
            closeFolders: true,
        })

        this.scene = scene
        this.objects = objects

        this.createViewFolder().createInteractionFolder()
    }

    createViewFolder() {
        let folder = this.gui.addFolder('View')
        let params = {
            // 'Show Labels': true,
            'Show Geometry': true,
            'Transparent Objects': true,
        }

        // folder
        //     .add(params, 'Show Labels')
        //     .onChange((toggle) => {
        //         this.objects.forEach((element) => {
        //             element.setShowLabels(toggle)
        //             element.redrawInScene(this.scene)
        //         })
        //     })

        folder
            .add(params, 'Show Geometry')
            .onChange((toggle) => {
                this.objects.forEach((element) => {
                    element.showGeometry = toggle
                    element.redrawInScene(this.scene)
                })
            })

        folder
            .add(params, 'Transparent Objects')
            .onChange((toggle) => {
                this.objects.forEach((element) => {
                    element.transparentObjects = toggle
                    element.redrawInScene(this.scene)
                })
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
                this.objects.forEach((element) => {
                    element.parameters.fork.compression = compression
                    element.redrawInScene(this.scene)
                })
            })
    }
}

export default {}