import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { Water } from 'three/examples/jsm/objects/Water2.js';
import LoadModel from './LoadModel';
import { Observable } from 'rxjs';

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let camera: THREE.Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
let controls = new PointerLockControls(camera, document.body);
const blocker = document.getElementById('background_menu')!;
const instructions = document.getElementById('instructions_menu')!;

export default class MainCore {
    
    renderer: THREE.WebGLRenderer;
    divGame: HTMLElement;
    camera: THREE.Camera;
    scene: THREE.Scene;
    
    constructor() {
        this.divGame = document.getElementById('main_game')!;
        
        //render
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 100);
        this.camera.position.set(0, 0, 5);
        
        this.divGame.appendChild(this.renderer.domElement);
        
        //scene
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xbfe3dd);
        this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
        this.scene.fog = new THREE.Fog(0xffffff, 0, 500);        

    }

    personagem() {
        camera.rotation.y = Math.PI;
        camera.position.y = 2;
        camera.position.x = 5;
        camera.position.z = 22;
    
        blocker.addEventListener('click', function () {
            controls.lock();
        });
        instructions.addEventListener('click', function () {
            controls.lock();
        });
    
        controls.addEventListener('lock', function () {
            instructions.style.display = 'none';
            blocker.style.display = 'none';
            
        });
        
        controls.addEventListener('unlock', function () {
            blocker.style.display = 'block';
            instructions.style.display = '';
    
        });
    
        this.scene.add(controls.getObject());
    
        const onKeyDown = function (event: { code: any; }) {
    
            console.log(event.code);
            switch (event.code) {
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
    
            }
    
        };
    
        const onKeyUp = function (event: { code: any; }) {
    
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
    
                case 'ArrowRight':
                case 'KeyD':
                    moveRight = false;
                    break;
    
            }
    
        };
    
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
    
    }

    water(waterGeometry: THREE.BufferGeometry){

        const params = {
            color: '#ffffff',
            scale: 3,
            flowX: 0.5,
            flowY: 0.5
        };

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

        // para debug da agua
        // const mat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true });
        // water = new THREE.Mesh(waterGeometry, mat) as unknown as Water;

        water.position.set(5, -4.4, 25);
        water.scale.set(0.05, 0.05, 0.05);
        water.rotation.x = Math.PI * - 0.5;

        this.scene.add(water);
    }

    async init() {

        const loadModel = new LoadModel();

        let beach = await loadModel.load('/models/pirate_beach.glb');
        beach.position.set(0, 0, 0);
        this.scene.add( beach );

        let water = await loadModel.load('/models/base_water.glb');
        let waterGeometry = new Observable<THREE.BufferGeometry>(
            (subscriber) =>water.traverse(function (child: THREE.Object3D) {
                if (child.type == 'Mesh') {
                    let mesh = child as THREE.Mesh;
                    subscriber.next(mesh.geometry as THREE.BufferGeometry);
                    subscriber.complete();
                }
            })
        );
        waterGeometry.subscribe((val)=>{
            this.water(val);
        })

        this.personagem();

        this.renderer.setAnimationLoop(()=>{

            const time = performance.now();
            if (controls.isLocked === true) {
                const delta = (time - prevTime) / 1000;
                velocity.x -= velocity.x * 10.0 * delta;
                velocity.z -= velocity.z * 10.0 * delta;
        
                direction.z = Number(moveForward) - Number(moveBackward);
                direction.x = Number(moveRight) - Number(moveLeft);
                direction.normalize(); // this ensures consistent movements in all directions
        
                if (moveForward || moveBackward) velocity.z -= direction.z * 200.0 * delta;
                if (moveLeft || moveRight) velocity.x -= direction.x * 200.0 * delta;
        
                controls.moveRight(- velocity.x * delta);
                controls.moveForward(- velocity.z * delta);
                controls.getObject().position.y += (velocity.y * delta); // new behavior
            }
            prevTime = time;

            this.renderer.render(this.scene, camera);
        });
    }
}