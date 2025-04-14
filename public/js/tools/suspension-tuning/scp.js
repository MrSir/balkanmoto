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
                    element.showGeometry = toggle
                    element.update()
                    element.updateGeometry()
                })
            })

        folder
            .add(params, 'Show Dimensions')
            .onChange((toggle) => {
                this.objects.forEach((element) => {
                    element.showDimensions = toggle
                    element.update()
                    element.updateGeometry()
                })
            })

        folder
            .add(params, 'Transparent Objects')
            .onChange((toggle) => {
                this.objects.forEach((element) => {
                    element.transparentObjects = toggle
                    element.update()
                    element.updateGeometry()
                })
            })

        folder.close()

        return this
    }

    createSimulationFolder() {
        let folder = this.gui.addFolder('Simulation')

        let simulateButton = {
            simulate: () => {
                this.objects.forEach((element) => {
                    let restingStroke = element.restingStroke
                    element.fork.stroke = restingStroke

                    let springSqueeze = new Tween(element, false)
                        .to({fork: {stroke: 100}}, 1000 * (element.fork.spring.rate / 6))
                        .onUpdate(
                            (frame) => {
                                frame.redrawInScene(this.scene)
                            }
                        )

                    let springStretch = new Tween(element, false)
                        .to({fork: {stroke: restingStroke}}, 1000 * (element.fork.spring.rate / 6))
                        .onUpdate(
                            (frame) => {
                                frame.redrawInScene(this.scene)
                            }
                        )

                    springSqueeze.chain(springStretch)
                    springSqueeze.start()

                    function animate(time) {
                        springSqueeze.update(time)
                        springStretch.update(time)

                        requestAnimationFrame(animate)
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