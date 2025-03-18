class GameScene {
    constructor() {
        this.scene = new THREE.Scene();

        // Update camera settings
        this.camera = new THREE.PerspectiveCamera(
            60, // Lower FOV for better depth perception
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        // Create renderer with proper settings
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x87CEEB, 1);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Enable shadow mapping
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        document.getElementById('game-container').appendChild(this.renderer.domElement);

        this.setupLights();
        // Remove or comment out the old setupCamera method
        // this.setupCamera();
        this.setupGround();

        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        // Add zoom control properties
        this.zoomSpeed = 2;
        this.minZoom = 20;
        this.maxZoom = 150;

        // Setup controls
        this.setupControls();

        this.currentTarget = new THREE.Vector3();
        this.currentPosition = new THREE.Vector3();
        this.cameraOffset = new THREE.Vector3(
            GAME_CONSTANTS.CAMERA.OFFSET.x,
            GAME_CONSTANTS.CAMERA.OFFSET.y,
            GAME_CONSTANTS.CAMERA.OFFSET.z
        );

        this.zoomLevel = 1;
        this.setupZoomControls();

        // Initialize camera position behind where player will spawn (180 degrees from current)
        const initialAngleX = Math.sin(Math.PI); // Start rotated 180 degrees
        const initialAngleZ = Math.cos(Math.PI);

        this.camera.position.set(
            0 - (initialAngleX * GAME_CONSTANTS.CAMERA.OFFSET.z),
            GAME_CONSTANTS.CAMERA.OFFSET.y,
            0 - (initialAngleZ * GAME_CONSTANTS.CAMERA.OFFSET.z)
        );

        // Initialize look target
        const initialTarget = new THREE.Vector3(
            0 + (initialAngleX * GAME_CONSTANTS.CAMERA.LOOK_AHEAD),
            GAME_CONSTANTS.CAMERA.LOOK_OFFSET.y,
            0 + (initialAngleZ * GAME_CONSTANTS.CAMERA.LOOK_AHEAD)
        );

        this.camera.lookAt(initialTarget);

        // Initialize tracking variables
        this.currentTarget = initialTarget.clone();
        this.currentPosition = this.camera.position.clone();
        this.zoomLevel = 1;
    }

    setupLights() {
        // Ambient light for overall scene brightness
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Main directional light with shadows
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(-10, 50, 30);
        mainLight.castShadow = true;

        // Adjust shadow properties
        mainLight.shadow.camera.left = -50;
        mainLight.shadow.camera.right = 50;
        mainLight.shadow.camera.top = 50;
        mainLight.shadow.camera.bottom = -50;
        mainLight.shadow.camera.near = 0.1;
        mainLight.shadow.camera.far = 200;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;

        this.scene.add(mainLight);

        // Additional fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(10, 20, -30);
        this.scene.add(fillLight);
    }


    setupGround() {
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshPhongMaterial({
            color: 0x404040,
            side: THREE.DoubleSide
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Add grid helper for better spatial reference
        const gridHelper = new THREE.GridHelper(200, 20, 0x000000, 0x808080);
        gridHelper.position.y = 0.1;
        this.scene.add(gridHelper);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update(player) {
        this.updateCamera(player);
        this.renderer.render(this.scene, this.camera);
    }

    setupControls() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    handleKeyDown(event) {
        switch(event.key) {
            case 'PageUp':
                this.zoomCamera(-this.zoomSpeed);
                break;
            case 'PageDown':
                this.zoomCamera(this.zoomSpeed);
                break;
        }
    }

    zoomCamera(delta) {
        // Calculate new position
        const direction = new THREE.Vector3();
        direction.subVectors(this.camera.position, new THREE.Vector3(0, 20, 0));
        direction.normalize();

        // Update position
        const newDistance = this.camera.position.distanceTo(new THREE.Vector3(0, 20, 0)) + delta;

        if (newDistance >= this.minZoom && newDistance <= this.maxZoom) {
            this.camera.position.addScaledVector(direction, delta);
            this.camera.lookAt(0, 20, 0);
        }
    }

    setupZoomControls() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'PageUp':
                    this.zoom(-GAME_CONSTANTS.CAMERA.ZOOM.SPEED);
                    break;
                case 'PageDown':
                    this.zoom(GAME_CONSTANTS.CAMERA.ZOOM.SPEED);
                    break;
            }
        });
    }

    zoom(delta) {
        const newZoom = this.zoomLevel + (delta * 0.1);
        this.zoomLevel = Math.max(
            GAME_CONSTANTS.CAMERA.ZOOM.MIN_MULTIPLIER,
            Math.min(GAME_CONSTANTS.CAMERA.ZOOM.MAX_MULTIPLIER, newZoom)
        );
    }

    updateCamera(player) {
        if (!player) return;

        // Calculate angles based on player rotation (add PI to rotate 180 degrees)
        const angleX = Math.sin(player.rotation + Math.PI);
        const angleZ = Math.cos(player.rotation + Math.PI);

        // Position camera directly behind player
        this.currentPosition.set(
            player.position.x - (angleX * GAME_CONSTANTS.CAMERA.OFFSET.z * this.zoomLevel),
            player.position.y + GAME_CONSTANTS.CAMERA.OFFSET.y * this.zoomLevel,
            player.position.z - (angleZ * GAME_CONSTANTS.CAMERA.OFFSET.z * this.zoomLevel)
        );

        // Look ahead of player
        this.currentTarget.set(
            player.position.x + (angleX * GAME_CONSTANTS.CAMERA.LOOK_AHEAD),
            player.position.y + GAME_CONSTANTS.CAMERA.LOOK_OFFSET.y,
            player.position.z + (angleZ * GAME_CONSTANTS.CAMERA.LOOK_AHEAD)
        );

        // Update camera immediately without interpolation
        this.camera.position.copy(this.currentPosition);
        this.camera.lookAt(this.currentTarget);
    }
}