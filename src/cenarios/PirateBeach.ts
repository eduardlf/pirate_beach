import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water2.js';
import LoadModel from './../core/LoadModel';
import AbstractCena from './../core/AbstractCena';
import Player from '../core/Player';

const params = {
    color: '#ffffff',
    scale: 5,
    flowX: 0.5,
    flowY: 0.5
};

//ganbitos
let t = 0;
let a = false;

export default class PirateBeach extends AbstractCena {

    player = new Player(this.camera, this.renderer.domElement);
    audioListener = new THREE.AudioListener();
    loadModel?: LoadModel;

    //time
    deltaTime = 0;

    //gaivota
    gaivotaModel?: THREE.Group;
    gaivotaAnimation?: THREE.AnimationMixer;
    gaivotaAudio1?: THREE.PositionalAudio;
    gaivotaAudio2?: THREE.PositionalAudio;

    async loadCena(): Promise<void> {

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

        this.scene.add(this.player.getControl().getObject());
        this.loadModel = new LoadModel(loadingManager);

        // praia
        const beach = await this.loadModel.load('/models/pirate_beach.glb');
        beach.position.set(0, 1, 0);
        this.scene.add(beach);

        // gaivota
        await this.createSeagull();
        this.scene.add(this.gaivotaModel!);

        // agua
        const modelWater = await this.loadModel.load('/models/base_water.glb');
        const objWater = modelWater.getObjectByName('externo')!;
        const waterGeometry = await (await this.loadModel.getMesk(objWater)).geometry;
        const water = this.createWater(waterGeometry);
        water.position.set(0, -3.4, 0);
        water.rotation.x = getGraus(-90);
        this.scene.add(water);
    }

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

    async createSeagull() {

        const seagull = await this.loadModel!.loadGLTF('/models/seagull.glb');

        seagull.animations[0]
        this.gaivotaModel = seagull.scene;
        const escala = 0.09;
        this.gaivotaModel.scale.set(escala, escala, escala);
        this.gaivotaModel.position.set(0, 20, 0);
        this.gaivotaModel.rotation.y = getGraus(0);

        this.gaivotaAnimation = new THREE.AnimationMixer(this.gaivotaModel);
        this.gaivotaAnimation.clipAction(seagull.animations[0]).play();

        this.gaivotaAudio1 = await this.loadAudioSeagull(this.gaivotaModel, '/sounds/gaivota1.mp3');
        this.gaivotaAudio2 = await this.loadAudioSeagull(this.gaivotaModel, '/sounds/gaivota2.mp3');
    }

    async loadAudioSeagull(seagull: THREE.Group, audio: string): Promise<THREE.PositionalAudio> {
        let audioBuffer = await this.loadModel!.loadAudio(audio);

        const positionalAudio = new THREE.PositionalAudio(this.audioListener);
        positionalAudio.setBuffer(audioBuffer);
        positionalAudio.setRefDistance(10);
        positionalAudio.setDirectionalCone(90, 360, 0.3);

        seagull.add(positionalAudio);
        return positionalAudio;
    }

    preFrameCena(milliseconds: number): void {
        this.player.frameLoop(milliseconds);

        this.gaivotaAnimation!.update(milliseconds);

        this.deltaTime += 15 * milliseconds;
        let dist = 50;

        this.gaivotaModel!.rotation.y = getGraus(-this.deltaTime + 90);
        this.gaivotaModel!.position.x = Math.sin(getGraus(this.deltaTime)) * dist;
        this.gaivotaModel!.position.z = -Math.cos(getGraus(this.deltaTime)) * dist;
        if ((t + 400) <= Math.floor(this.deltaTime)) {
            t = Math.floor(this.deltaTime)
            if (a) {
                a = false;
                this.gaivotaAudio1!.play();
            } else {
                this.gaivotaAudio2!.play();
                a = true;
            }
        }
    }

    posFrameCena(): void {}
}

function getGraus(degrees: number): number {
    return degrees * (Math.PI / 180);
}
