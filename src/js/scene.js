class GameScene {
    constructor() {
        this.scene = new THREE.Scene();

        // Initialize camera
        this.camera = new THREE.PerspectiveCamera(
            GAME_CONSTANTS.CAMERA.FOV,
            window.innerWidth / window.innerHeight,
            GAME_CONSTANTS.CAMERA.NEAR,
            GAME_CONSTANTS.CAMERA.FAR
        );

        // Optimize renderer for GPU usage
        this.renderer = new THREE.WebGLRenderer({
            powerPreference: "high-performance",
            antialias: false,
            stencil: false,
            depth: true,
            alpha: false
        });

        // Force GPU rendering settings
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(1); // Force 1:1 pixel ratio
        this.renderer.setClearColor(0x87CEEB);

        // Optimize shadow settings
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;
        this.renderer.shadowMap.autoUpdate = false;

        // Disable CPU-intensive features
        this.renderer.physicallyCorrectLights = false;
        this.renderer.toneMappingExposure = 1;
        this.renderer.toneMapping = THREE.NoToneMapping;
        this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

        // Enable culling and depth testing
        this.renderer.sortObjects = false;
        this.scene.matrixWorldAutoUpdate = false;
        this.scene.autoUpdate = false;

        document.getElementById('game-container').appendChild(this.renderer.domElement);

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const canvas = this.renderer.domElement;

        canvas.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, this.camera);

            const intersects = raycaster.intersectObject(Building.getInstancedMesh());

            if (intersects.length > 0 && player) {
                const instanceId = intersects[0].instanceId;
                const building = game.buildings[instanceId];

                const distance = building.position.distanceTo(new THREE.Vector3(
                    player.position.x,
                    building.position.y,
                    player.position.z
                ));

                console.log(`Distance to building [${instanceId}]: ${distance.toFixed(2)}`);
                showDebugDistance(`Distance to building: ${distance.toFixed(2)}`);
            }
        });

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

        // Setup FPS tracking
        this.fpsCounter = {
            lastTime: performance.now(),
            frames: 0,
            current: 0,
            updateInterval: 1000 // Update FPS display every second
        };

        // Create frustum for culling calculations
        this.frustum = new THREE.Frustum();
        this.projScreenMatrix = new THREE.Matrix4();

        // Disable automatic frustum culling
        this.scene.traverse(object => {
            if (object.isMesh) {
                object.frustumCulled = false;
            }
        });
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Optimize directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(-50, 100, 50);

        // Optimize shadow camera
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 200;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.bias = -0.001;

        this.scene.add(directionalLight);
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
        if (player) {
            // Update only necessary matrices
            player.mesh.updateMatrix();
            this.updateCamera(player);
            this.updateFrustumCulling();
        }

        // Manual matrix updates
        this.camera.updateMatrixWorld();
        this.scene.updateMatrixWorld();

        // Update shadows only when needed
        if (this.shadowsNeedUpdate) {
            this.renderer.shadowMap.needsUpdate = true;
            this.shadowsNeedUpdate = false;
        }

        // Render with optimized settings
        this.renderer.render(this.scene, this.camera);

        this.updateFPS();
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

    updateFPS() {
        this.fpsCounter.frames++;
        const currentTime = performance.now();

        if (currentTime > this.fpsCounter.lastTime + this.fpsCounter.updateInterval) {
            this.fpsCounter.current = Math.round(
                (this.fpsCounter.frames * 1000) / (currentTime - this.fpsCounter.lastTime)
            );
            document.getElementById('fps').textContent = `FPS: ${this.fpsCounter.current}`;

            this.fpsCounter.frames = 0;
            this.fpsCounter.lastTime = currentTime;
        }
    }

    updateFrustumCulling() {
        this.projScreenMatrix.multiplyMatrices(
            this.camera.projectionMatrix,
            this.camera.matrixWorldInverse
        );
        this.frustum.setFromProjectionMatrix(this.projScreenMatrix);

        const viewDistance = GAME_CONSTANTS.RENDERER.PERFORMANCE.VIEW_DISTANCE;
        const buildingPositions = Building.instancedMesh.instanceMatrix.array;

        // Expand frustum boundaries
        const expandedFrustum = new THREE.Frustum();
        const expandedMatrix = this.projScreenMatrix.clone();
        expandedMatrix.elements[0] *= 0.8;  // Widen frustum
        expandedMatrix.elements[5] *= 0.8;  // Increase height
        expandedFrustum.setFromProjectionMatrix(expandedMatrix);

        for (let i = 0; i < GAME_CONSTANTS.WORLD.BUILDING_COUNT; i++) {
            const idx = i * 16;
            const position = new THREE.Vector3(
                buildingPositions[idx + 12],
                buildingPositions[idx + 13],
                buildingPositions[idx + 14]
            );

            // Check distance and expanded frustum
            const inRange = position.distanceTo(this.camera.position) < viewDistance;
            const inFrustum = this.frustum.containsPoint(position);
            const inExpandedFrustum = expandedFrustum.containsPoint(position);

            // Keep building visible if it's in main frustum or expanded frustum
            if (!inRange || (!inFrustum && !inExpandedFrustum)) {
                Building.instancedMesh.setColorAt(i, new THREE.Color(0x808080).multiplyScalar(0.5));
            } else {
                Building.instancedMesh.setColorAt(i, new THREE.Color(0x808080));
            }
        }

        Building.instancedMesh.instanceColor.needsUpdate = true;
    }
}