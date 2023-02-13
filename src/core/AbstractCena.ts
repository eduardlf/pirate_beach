import * as THREE from 'three';

export default abstract class AbstractCena {
    
    constructor(
        protected renderer: THREE.WebGLRenderer,
        protected camera: THREE.PerspectiveCamera,
        protected scene: THREE.Scene
    ) { }

    abstract loadCena(): Promise<void>;

    abstract preFrameCena(milliseconds: number): void; 
    
    abstract posFrameCena(milliseconds: number): void; 

}
