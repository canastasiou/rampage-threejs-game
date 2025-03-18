class GameScene {
    constructor() {
        this.scene = new THREE.Scene();

        // Switch to perspective camera
        this.camera = new THREE.PerspectiveCamera(
            GAME_CONSTANTS.CAMERA.FOV,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x87CEEB); // Sky blue background
        this.renderer.shadowMap.enabled = true;

        document.getElementById('game-container').appendChild(this.renderer.domElement);

        this.setupLights();
        this.setupCamera();
        this.setupGround();

        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(-50, 100, 50);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    }

    setupCamera() {
        this.camera.position.set(
            -GAME_CONSTANTS.CAMERA.DISTANCE,
            GAME_CONSTANTS.CAMERA.HEIGHT,
            GAME_CONSTANTS.CAMERA.DISTANCE
        );
        this.camera.lookAt(0, 20, 0);
    }

    setupGround() {
        const groundGeometry = new THREE.PlaneGeometry(500, 500);
        const groundMaterial = new THREE.MeshPhongMaterial({
            color: 0x404040,
            side: THREE.DoubleSide
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update() {
        this.renderer.render(this.scene, this.camera);
    }
}