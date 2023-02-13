import { Camera, Vector3 } from "three";
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

let controls: PointerLockControls;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

export default class Player {

    velocity: Vector3;
    direction: Vector3;

    constructor(camera: Camera, domRender: HTMLCanvasElement) {
        
        this.velocity = new Vector3();
        this.direction = new Vector3();
        controls = new PointerLockControls(camera, domRender);
        
        domRender.ownerDocument.addEventListener('keydown', this.onKeyDown);
        domRender.ownerDocument.addEventListener('keyup', this.onKeyUp);

        let background = domRender.ownerDocument.querySelector<HTMLDivElement>('#background_menu')!;
        let instructions = background.querySelector<HTMLDivElement>('#instructions')!;
        let pause = background.querySelector<HTMLDivElement>('#pause')!;

        background.addEventListener('click', function () {
            instructions.style.display = 'none';
            controls.lock();
        });

        controls.addEventListener('lock', function () {
            pause.style.display = 'none';
        });
        controls.addEventListener('unlock', function () {
            pause.style.display = '';
        });
    }

    getControl() {
        return controls
    }

    private onKeyDown(event: { code: any; }) {
        switch (event.code) {
            case "IntlBackslash":
                // controls.lock();
                break;
            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;
            case 'Space':
                moveUp = true;
                break;
            case 'ShiftLeft':
                moveDown = true;
                break;
        }
    };

    private onKeyUp(event: { code: any; }) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;
            case 'Space':
                moveUp = false;
                break;
            case 'ShiftLeft':
                moveDown = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;
        }
    };

    frameLoop(delta: number) {
        if (controls.isLocked === true) { 
            this.velocity.x -= this.velocity.x * 10.0 * delta;
            this.velocity.z -= this.velocity.z * 10.0 * delta;
            this.velocity.y -= this.velocity.y * 10.0 * delta;

            this.direction.z = Number(moveForward) - Number(moveBackward);
            this.direction.x = Number(moveRight) - Number(moveLeft);
            this.direction.y = Number(moveDown) - Number(moveUp);
            this.direction.normalize(); // this ensures consistent movements in all directions

            if (moveForward || moveBackward) this.velocity.z -= this.direction.z * 200.0 * delta;
            if (moveLeft || moveRight) this.velocity.x -= this.direction.x * 200.0 * delta;
            if (moveUp || moveDown) this.velocity.y -= this.direction.y * 200.0 * delta;

            controls.moveRight(- this.velocity.x * delta);
            controls.moveForward(- this.velocity.z * delta);
            controls.getObject().position.y += (this.velocity.y * delta); // new behavior
        }
    }
}