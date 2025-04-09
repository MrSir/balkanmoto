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

        this.createViewFolder().createManualFolder().createStaticFolder().createDynamicFolder()
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

    createManualFolder() {
        let folder = this.gui.addFolder('Manual Simulation')
        let params = {
            'Fork Stroke (%)': 0.0,
        }

        folder
            .add(params, 'Fork Stroke (%)', 0, 100, 1)
            .onChange((stroke) => {
                this.objects.forEach((element) => {
                    element.fork.stroke = stroke
                    element.redrawInScene(this.scene)
                })
            })

        return this
    }

    createStaticFolder() {
        let folder = this.gui.addFolder('Static Simulation')

        let simulateButton = {
            simulate: () => {
                this.objects.forEach((element) => {
                    element.fork.stroke = 0
                    element.redrawInScene(this.scene)

                    let springSqueeze = new Tween(element, false)
                        .to({fork: {stroke: 100}}, 2500)
                        .onUpdate(
                            (frame) => {
                                if (!element.isAtEquilibrium()) {
                                    frame.redrawInScene(this.scene)
                                }
                            }
                        )
                        .start()

                    function animate(time) {
                        springSqueeze.update(time)

                        requestAnimationFrame(animate)
                    }
                    requestAnimationFrame(animate)
                })

                // this.objects.forEach((element) => {
                //     element.fork.stroke = element.restingStroke
                //     element.redrawInScene(this.scene)
                // })
            },
        }

        folder.add(simulateButton, 'simulate').name('Simulate')

        return this
    }

    createDynamicFolder() {
        let folder = this.gui.addFolder('Dynamic Simulation')

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