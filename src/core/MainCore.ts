import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

import GUI from 'lil-gui';
import { Water } from 'three/examples/jsm/objects/Water2.js';
import LoadModel from './LoadModel';
import { Clock } from 'three';
import Debug from './../cenarios/Debug';
import AbstractCena from './AbstractCena';
import PirateBeach from './../cenarios/PirateBeach';

let clock = new Clock();

let renderer = new THREE.WebGLRenderer({ antialias: true });
let camera: THREE.PerspectiveCamera;
let controls: PointerLockControls;

let scene: THREE.Scene;

let gui: GUI;
const myObject = {
    menu: false
};
const params = {
    color: '#ffffff',
    scale: 5,
    flowX: 0.5,
    flowY: 0.5
};

export default class MainCore {

    divGame: HTMLElement;

    constructor(divGame: HTMLElement, altura: number, largura: number) {
        this.divGame = divGame!;

        //render
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(largura, altura);
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.autoClear = false;
        this.divGame.appendChild(renderer.domElement);

        //scene
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xbfe3dd);
        scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.fog = new THREE.Fog(0xffffff, 0, 500);

        //camera
        camera = new THREE.PerspectiveCamera(75, largura / altura, 1, 2000);
        // camera.rotation.y = Math.PI;
        // camera.rotateX(getGraus(-90));
        camera.position.y = 2;
        camera.position.x = 0;
        camera.position.z = 0;

    }

    onResize(altura: number, largura: number) {
        camera.aspect = largura / altura;
        camera.updateProjectionMatrix();
        renderer.setSize(largura, altura);
    };

    async inicio(cena: string) {

        let cenario: AbstractCena|null = null;

        switch (cena) {
            case "praia":
                cenario = new PirateBeach(renderer, camera, scene);
                break;
            case "debug":
                cenario = new Debug(renderer, camera, scene);
                break;
            default:
                console.log('erro');
                break;
        }

        if(cenario != null){

            await cenario.loadCena();

            //render loop
            renderer.setAnimationLoop(() => {
                const msTime = clock.getDelta();
                renderer.clear();
                cenario!.preFrameCena(msTime);
                renderer.render(scene, camera);
                cenario!.posFrameCena(msTime);
            });
        }
    }

    // ------------legado------------
    // ------------legado------------
    // ------------legado------------
    createWater(waterGeometry: THREE.BufferGeometry): Water {
        
        const textureLoader = new THREE.TextureLoader();
        const normalMap0 = textureLoader.load('/images/Water_1_M_Normal.jpg');
        const normalMap1 = textureLoader.load('/images/Water_2_M_Normal.jpg');

        let water = new Water(waterGeometry, {
            color: params.color,
            scale: params.scale,
            flowDirection: new THREE.Vector2(params.flowX, params.flowY),
            normalMap0: normalMap0,
            normalMap1: normalMap1,
            textureWidth: 1024,
            textureHeight: 1024
        });
        return water
    }

    loadWater(waterGeometry: THREE.BufferGeometry): Water {
        let water = this.createWater(waterGeometry);

        // const debug = true;
        // if (debug) {
        // para debug da agua
        // const mat = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
        // water = new THREE.Mesh(waterGeometry, mat) as unknown as Water;
        // }

        return water;
    }

    debug() {
        gui = new GUI({ container: this.divGame });
        const axesHelper = new THREE.AxesHelper(5);
        axesHelper.position.set(0, 3, 0)
        // this.scene.add(axesHelper)

        const size = 100;
        const divisions = 100;

        const gridHelper = new THREE.GridHelper(size, divisions, 0x808080, 0xFFFFFF);
        gridHelper.position.set(0, 0, 0)
        // this.scene.add(gridHelper);
    }

    comandWater(water: Water) {

        gui.add(myObject, 'menu').onChange(function (value: boolean) {
            if (value) {
                // blocker.style.display = 'block';

            } else {
                // blocker.style.display = 'none';
            }
        });

        gui.addColor(params, 'color').onChange(function (value: any) {

            water.material.uniforms['color'].value.set(value);

        });
        gui.add(params, 'scale', 0.1, 10).onChange(function (value: any) {

            water.material.uniforms['config'].value.w = value;

        });
        gui.add(params, 'flowX', - 1, 1).step(0.01).onChange(function (value: any) {

            water.material.uniforms['flowDirection'].value.x = value;
            water.material.uniforms['flowDirection'].value.normalize();

        });
        gui.add(params, 'flowY', - 1, 1).step(0.01).onChange(function (value: any) {

            water.material.uniforms['flowDirection'].value.y = value;
            water.material.uniforms['flowDirection'].value.normalize();

        });

        gui.add(params, 'flowY', - 1, 1).step(0.01).onChange(function (value: any) {

            water.material.uniforms['flowDirection'].value.y = value;
            water.material.uniforms['flowDirection'].value.normalize();

        });
    }

    async init(debug = false) {
        if (debug) {
            this.debug();
        }

        // controlsTranform = new TransformControls(camera, renderer.domElement);
        // controlsTranform.addEventListener( 'change', renderer );

        //controles

        // const back = document.createElement('div');
        // back.id = 'background_menu';
        // back.style.position = 'absolute';
        // back.style.right = '0';
        // back.style.bottom = '0';
        // back.style.height = '1208px';
        // back.style.width = '1280px';

        // renderer.domElement.appendChild(back);

        // player = new Player(camera, renderer.domElement, back);
        // controls = player.getControl();

        controls.addEventListener('lock', function () {
            // blocker.style.display = 'none';
        });
        controls.addEventListener('unlock', function () {
            // if (myObject.menu) {
            // blocker.style.display = 'block';
            // }
        });
        scene.add(controls.getObject());

        const loadingManager = new THREE.LoadingManager();

        loadingManager.onStart = function (url) {
            console.log(`arquvio carregando: ${url} `)
        }

        loadingManager.onProgress = function (url, loader, total) {
            console.log(` carregando: ${url} load: ${loader} total: ${total} `)
        }

        loadingManager.onLoad = function () {
            console.log('carregado')
        }


        const loadModel = new LoadModel(loadingManager);

        let beach = await loadModel.load('/models/pirate_beach_2.glb');
        beach.position.set(0, 1, 0);
        scene.add(beach);

        // let planeModel4 = await loadModel.load('/models/try.glb');

        let externo = await loadModel.load('/models/base_water_remaster.glb');
        let pla = externo.getObjectByName('externo')!;
        const waterGeometry2 = await (await loadModel.getMesk(pla)).geometry;
        let water2 = this.loadWater(waterGeometry2);
        water2.position.set(0, -3.4, 0);
        // water2.rotation.x = getGraus(-90);
        if (debug) {
            gui.add(water2.position, 'y', -5, 5).step(0.1).onChange(function (value: any) {
                water2.position.y = value;
            });
        }
        scene.add(water2);

        // let tri = planeModel4.getObjectByName('try')!;


        // const waterGeometry4 = await (await loadModel.getMesk(tri)).geometry;

        // console.log(waterGeometry2);
        // console.log(waterGeometry4);


        // let water4 = this.loadWater(waterGeometry4);

        // water4.rotation.x = getGraus(-90);



        // let vnh2 = new VertexNormalsHelper(water2, 1);
        // // let vnh4 = new VertexNormalsHelper(water4, 1);

        // this.scene.add(vnh2);

        // this.scene.add(water4);
        // this.scene.add(vnh4);

        if (debug) {
            this.comandWater(water2);
        }
        // gui.open();


    }
    // ------------legado------------
    // ------------legado------------
    // ------------legado------------
}