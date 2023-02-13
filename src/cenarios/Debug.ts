import * as THREE from 'three';
import { ViewHelper } from 'three/examples/jsm/helpers/ViewHelper';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import Player from "./../core/Player";
import LoadModel from './../core/LoadModel';
import AbstractCena from './../core/AbstractCena';
import { PositionalAudio } from 'three';

let delta: number;
let mixer: THREE.AnimationMixer;
let gaivota: THREE.Group;
let t = 0;
let a = false;
let helper: PositionalAudioHelper;
let positionalAudio: PositionalAudio;

const listener = new THREE.AudioListener();
// const audio = new THREE.Audio( listener );
// let gaivota1 = document.querySelector<HTMLMediaElement>('#gaivota1')!;
// let gaivota2 = document.querySelector<HTMLMediaElement>('#gaivota2')!;

export default class Debug extends AbstractCena {

    player = new Player(this.camera, this.renderer.domElement);
    helper = new ViewHelper(this.camera, this.renderer.domElement);
    controls = this.player.getControl();
    stats = Stats();

    async loadCena(): Promise<void> {

        delta = 0;
        this.renderer.domElement.ownerDocument.body.appendChild(this.stats.dom);

        this.helper.controls = this.controls;

        this.scene.add(this.controls.getObject());

        const size = 100;
        const divisions = 100;

        const gridHelper = new THREE.GridHelper(size, divisions, 0x808080, 0xFFFFFF);
        gridHelper.position.set(0, 0, 0)

        this.scene.add(gridHelper);

        // geometry
        const geometry = new THREE.SphereGeometry(1, 10, 10);

        // material
        const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });

        // mesh
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = -10;
        mesh.position.y = 2;

        // this.scene.add(mesh);

        const loadingManager = new THREE.LoadingManager();

        loadingManager.onStart = function (url) {
            console.log(`arquvio carregando: ${url} `)
        }

        const loadModel = new LoadModel(loadingManager);

        let seagull = await loadModel.loadGLTF('/models/seagull.glb');

        seagull.animations[0]
        gaivota = seagull.scene;
        // gaivota = mesh;
        let escala = 0.09;
        // let escala = 0.01;
        gaivota.scale.set(escala, escala, escala);
        gaivota.position.set(0, 10, 0);
        gaivota.rotation.y = getGraus(0);

        mixer = new THREE.AnimationMixer(gaivota);
        mixer.clipAction(seagull.animations[0]).play();
        // listener.setMasterVolume
        this.camera.add(listener);

        var sound = new THREE.Audio(listener);

        // var audioLoader = new THREE.AudioLoader();
        // audioLoader.load('/sounds/shotgun-fire.mp3', function (buffer) {
        //     sound.setBuffer(buffer);
        //     sound.setVolume(1);
        // });

        // this.renderer.domElement.ownerDocument.addEventListener('keydown', function(keyCode){

        //     if(keyCode.code == "KeyF"){
        //         console.log('fire');
        //         // sound.play()
        //     }

        // });

        positionalAudio = new THREE.PositionalAudio(listener);

        // positionalAudio.set
        // positionalAudio.setMediaElementSource(gaivota1);
        positionalAudio.setRefDistance(10);
        positionalAudio.setDirectionalCone(90, 360, 0.3);

        const positionalAudio2 = new THREE.PositionalAudio(listener);
        // positionalAudio2.setMediaElementSource(gaivota2);
        positionalAudio2.setRefDistance(10);
        positionalAudio2.setDirectionalCone(90, 360, 0.3);


        gaivota.add(positionalAudio);
        gaivota.add(positionalAudio2);

        this.scene.add(gaivota);

        // gaivota1.play();
        // gaivota2.play();

        // gaivota1.play();

    }

    preFrameCena(milliseconds: number) {
        if (this.controls.isLocked === true) {
            this.stats.update();
            helper.update();
            mixer.update(milliseconds);
            this.player.frameLoop(milliseconds);

            delta += 20 * milliseconds;
            let dist = 20;

            gaivota.rotation.y = getGraus(-delta + 90);
            gaivota.position.x = Math.sin(getGraus(delta)) * dist;
            gaivota.position.z = -Math.cos(getGraus(delta)) * dist;
            if ((t + 100) <= Math.floor(delta)) {
                t = Math.floor(delta)
                if (a) {
                    a = false;
                    // gaivota1.play();
                } else {
                    // gaivota2.play();
                    a = true;
                }
            }
        }
    }

    posFrameCena(milliseconds: number) {
        if (this.controls.isLocked === true) {
            if (this.helper.animating) this.helper.update(milliseconds);
        }
        this.helper.render(this.renderer);
    }

    // scene: THREE.Scene;
    // camera: THREE.Camera;
    // render: THREE.WebGLRenderer;

    // constructor(
    //     render: THREE.WebGLRenderer,
    //     scene: THREE.Scene,
    //     camera: THREE.Camera,
    //     background: HTMLDivElement
    // ) {

    // this.scene = scene;
    // this.camera = camera;
    // this.render = render;
    // const back = document.createElement('div');
    // back.id = 'background_menu';
    // back.style.position = 'absolute';
    // back.style.right = '0';
    // back.style.bottom = '0';
    // back.style.height = '1208px';
    // back.style.width = '1280px';

    // render.domElement.appendChild(back);

    // console.log(background);


    // render.domElement.addEventListener('click', function () {
    //     controls.lock();
    // });

    // controls.addEventListener('lock', function () {
    // blocker.style.display = 'none';
    // });
    // controls.addEventListener('unlock', function () {
    // if (myObject.menu) {
    // blocker.style.display = 'block';
    // }
    // });
    // let a = path resolve('');
    // }

    loadScene() {
        // let controlsTranform: TransformControls;
        // controlsTranform = new TransformControls(this.camera, this.render.domElement);
        // controlsTranform.attach(mesh);
        // this.scene.add(controlsTranform);

        // controlsTranform.addEventListener( 'change', this.render );
        // .scene.add(mesh);
        // window.addEventListener('',)
        // window.addEventListener('keydown', function (event) {

        //     switch (event.keyCode) {

        //         case 84: // T
        //             controlsTranform.setMode('translate');
        //             break;

        //         case 82: // R
        //             controlsTranform.setMode('rotate');
        //             break;

        //         case 69: // E
        //             controlsTranform.setMode('scale');
        //             break;
        //     }
        // });
    }



}
function getGraus(degrees: number): number {
    return degrees * (Math.PI / 180);
}