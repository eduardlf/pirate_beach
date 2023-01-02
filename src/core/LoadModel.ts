import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { lastValueFrom, Observable } from 'rxjs';

export default class LoadModel {

    private loaderGLB: GLTFLoader;
    private loaderDRACO: DRACOLoader;

    constructor() {
        this.loaderGLB = new GLTFLoader();
        this.loaderDRACO = new DRACOLoader();
        this.loaderDRACO.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
        this.loaderGLB.setDRACOLoader(this.loaderDRACO);
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

}