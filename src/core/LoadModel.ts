import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { lastValueFrom, Observable } from 'rxjs';
import THREE, { AudioLoader, LoadingManager } from 'three';

export default class LoadModel {

    private loaderGLB: GLTFLoader;
    private loaderAudio: AudioLoader;
    private loaderDRACO: DRACOLoader;

    constructor(manager: LoadingManager) {
        this.loaderGLB = new GLTFLoader(manager);
        this.loaderDRACO = new DRACOLoader(manager);
        this.loaderDRACO.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
        this.loaderGLB.setDRACOLoader(this.loaderDRACO);
        this.loaderAudio = new AudioLoader(manager);
    }

    async loadGLTF(nameModel: string): Promise<GLTF> {
        return await lastValueFrom(new Observable(
            (subscriber) => this.loaderGLB.load(nameModel, (gltf) => {
                subscriber.next(gltf);
                subscriber.complete();
            }, undefined, function (e) {
                subscriber.error(e);
                console.error(e);
            })
        ));
    }

    async load(nameModel: string): Promise<THREE.Group> {
        return await lastValueFrom(new Observable(
            (subscriber) => this.loaderGLB.load(nameModel, (gltf) => {
                subscriber.next(gltf.scene);
                subscriber.complete();
            }, undefined, function (e) {
                subscriber.error(e);
                console.error(e);
            })
        ));
    }

    async loadAudio(nameModel: string): Promise<AudioBuffer> {
        return await lastValueFrom(new Observable(
            (subscriber) => this.loaderAudio.load(nameModel, function (buffer) {
                subscriber.next(buffer);
                subscriber.complete();
            }, undefined, function (e) {
                subscriber.error(e);
                console.error(e);
            })
        ));
    }

    async getMesk(model: THREE.Group | THREE.Object3D): Promise<THREE.Mesh> {
        return await lastValueFrom(new Observable<THREE.Mesh>(
            (subscriber) => model.traverse(function (child: THREE.Object3D) {
                console.log(child.type);
                if (child.type == 'Mesh') {
                    let mesh = child as THREE.Mesh;
                    subscriber.next(mesh);
                    subscriber.complete();
                }
            })
        ));
    }

}