import { GUI } from 'three/gui';
import {Tween, Easing} from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js'

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

        this.createViewFolder().createSimulationFolder()
    }

    createViewFolder() {
        let folder = this.gui.addFolder('View')
        let params = {
            'Show Geometry Lines': false,
            'Show Dimensions': true,
            'Transparent Objects': true,
        }

        folder
            .add(params, 'Show Geometry Lines')
            .onChange((toggle) => {
                this.objects.forEach((element) => {
                    element.toggleGeometry(toggle)
                })
            })

        folder
            .add(params, 'Show Dimensions')
            .onChange((toggle) => {
                this.objects.forEach((element) => {
                    element.toggleDimensions(toggle)
                })
            })

        folder
            .add(params, 'Transparent Objects')
            .onChange((toggle) => {
                this.objects.forEach((element) => {
                    element.toggleTransparency(toggle)
                })
            })

        folder.close()

        return this
    }

    createSimulationFolder() {
        let folder = this.gui.addFolder('Simulation')

        let params = {
            'Drop Height(mm)': 0,
        }

        folder
            .add(params, 'Drop Height(mm)', 0, 1500, 100)
            .onChange((height) => {
                this.objects.forEach((element) => {
                    element.stop = true
                    element.dropHeight = height
                    element.pivot.position.y = height
                })
            })


        let simulateButton = {
            simulate: () => {
                this.objects.forEach((element) => {
                    element.reset()

                    let animate = (time) => {
                        element.simulate(time)

                        if (!element.stop) {
                            requestAnimationFrame(animate)
                        }
                    }

                    requestAnimationFrame(animate)
                })
            },
        }

        folder.add(simulateButton, 'simulate').name('Simulate')

        return this
    }
}

export default {}