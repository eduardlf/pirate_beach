declare module 'three/examples/jsm/helpers/ViewHelper' {
    export class ViewHelper extends Object3D {

        constructor(camera: Object3D, domElement: HTMLCanvasElement)

        animating = false;
        center = new Vector3();
        controls: OrbitControls;

        handleClick: (arg0: PointerEvent) => any;
        update(delta: number): void;
        render(renderer: THREE.WebGLRenderer): void;
    }
}
