import * as THREE from 'three';

export class Spring extends THREE.Mesh{
    constructor(radius, thickness, turns, segmentsPerTurn, height, growth){
        let g = new THREE.CylinderGeometry(thickness, thickness, 1, 16, segmentsPerTurn * turns).translate(0, 0.5, 0).rotateX(Math.PI * 0.5);
        let initPos = g.attributes.position.clone();

        let material = new THREE.MeshPhysicalMaterial({
            color: 0x121212121,
            roughness: 0,
            metalness: 1,
            reflectivity: 0.2,
            depthWrite: true,
            side: THREE.DoubleSide,
            transparent: false,
            opacity: 0.5,
            //wireframe: true,
        })

        super(g, material);
        this.radius = radius;
        this.turns = turns;
        this.segmentsPerTurn = segmentsPerTurn;
        this.height = height;
        this.growth = growth;
        this.castShadow = true

        this.update = () => {
            let _n = new THREE.Vector3(0, 1, 0)
            let _v3 = new THREE.Vector3()
            let _s = new THREE.Vector3()
            let pos = g.attributes.position

            for(let i = 0; i < initPos.count; i++){
                let ratio = initPos.getZ(i) * this.growth;
                let angle = this.turns * Math.PI * 2 * ratio;

                _v3.fromBufferAttribute(initPos, i).setZ(0);
                _v3.applyAxisAngle(_n, angle + Math.PI * 0.5);
                _v3.add(_s.setFromCylindricalCoords(this.radius, angle, this.height * ratio));

                pos.setXYZ(i, ... _v3);
            }

            g.computeVertexNormals();

            pos.needsUpdate = true;
        }
    }
}

export default {}