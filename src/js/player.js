class Player {
    constructor(type = 'george') {
        this.type = type;
        this.mesh = this.createPlayerMesh();

        // Set initial position at origin, on the ground
        this.position = {
            x: 0,
            y: GAME_CONSTANTS.PLAYER.HEIGHT, // Changed from HEIGHT/2 to HEIGHT
            z: 0
        };

        this.velocity = { x: 0, y: 0, z: 0, rotation: 0 };
        this.direction = 1;
        this.isJumping = false;
        this.isClimbing = false;
        this.health = GAME_CONSTANTS.PLAYER.MAX_HEALTH;
        this.rotation = 0; // Current rotation angle
        this.moveDirection = new THREE.Vector3(); // Movement direction vector

        // Apply initial position to mesh
        this.mesh.position.set(
            this.position.x,
            this.position.y,
            this.position.z
        );

        this.setupControls();
    }

    createPlayerMesh() {
        const group = new THREE.Group();

        // Add an invisible platform under the character for better shadow
        const shadowCatcher = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10),
            new THREE.ShadowMaterial({ opacity: 0.3 })
        );
        shadowCatcher.rotation.x = -Math.PI / 2;
        shadowCatcher.position.y = -GAME_CONSTANTS.PLAYER.HEIGHT / 2;
        shadowCatcher.receiveShadow = true;
        group.add(shadowCatcher);

        switch(this.type) {
            case 'george':
                return this.createGorilla(group);
            case 'lizzie':
                return this.createLizard(group);
            case 'ralph':
                return this.createWolf(group);
            default:
                return this.createGorilla(group);
        }
    }

    createGorilla(group) {
        // Body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(8, 12, 6),
            new THREE.MeshPhongMaterial({ color: 0x8B4513 })
        );
        group.add(body);

        // Head
        const head = new THREE.Mesh(
            new THREE.BoxGeometry(6, 6, 6),
            new THREE.MeshPhongMaterial({ color: 0x8B4513 })
        );
        head.position.y = 9;
        group.add(head);

        // Arms
        const armGeometry = new THREE.BoxGeometry(3, 10, 3);
        const armMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });

        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-5.5, 2, 0);
        group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(5.5, 2, 0);
        group.add(rightArm);

        // Legs
        const legGeometry = new THREE.BoxGeometry(3, 6, 3);
        const legMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });

        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-2, -9, 0);
        group.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(2, -9, 0);
        group.add(rightLeg);

        // Face features
        this.addFaceFeatures(head);

        group.position.y = GAME_CONSTANTS.PLAYER.HEIGHT;  // Changed from HEIGHT/2 to HEIGHT
        group.rotation.y = Math.PI; // Rotate 180 degrees
        group.castShadow = true;

        return group;
    }

    createLizard(group) {
        // Body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(6, 12, 6),
            new THREE.MeshPhongMaterial({ color: 0x228B22 })
        );
        group.add(body);

        // Head (more elongated for lizard)
        const head = new THREE.Mesh(
            new THREE.BoxGeometry(4, 4, 8),
            new THREE.MeshPhongMaterial({ color: 0x228B22 })
        );
        head.position.y = 8;
        group.add(head);

        // Tail
        const tail = new THREE.Mesh(
            new THREE.BoxGeometry(2, 8, 2),
            new THREE.MeshPhongMaterial({ color: 0x228B22 })
        );
        tail.position.set(0, -6, 3);
        tail.rotation.x = Math.PI / 4;
        group.add(tail);

        // Arms and legs similar to gorilla but thinner
        const limbGeometry = new THREE.BoxGeometry(2, 8, 2);
        const limbMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });

        const leftArm = new THREE.Mesh(limbGeometry, limbMaterial);
        leftArm.position.set(-4, 2, 0);
        group.add(leftArm);

        const rightArm = new THREE.Mesh(limbGeometry, limbMaterial);
        rightArm.position.set(4, 2, 0);
        group.add(rightArm);

        group.position.y = GAME_CONSTANTS.PLAYER.HEIGHT;  // Changed from HEIGHT/2 to HEIGHT
        group.castShadow = true;

        return group;
    }

    createWolf(group) {
        // Body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(7, 10, 8),
            new THREE.MeshPhongMaterial({ color: 0x808080 })
        );
        group.add(body);

        // Head (wolf-like)
        const head = new THREE.Mesh(
            new THREE.BoxGeometry(5, 5, 7),
            new THREE.MeshPhongMaterial({ color: 0x808080 })
        );
        head.position.y = 7.5;
        head.position.z = 1;
        group.add(head);

        // Ears
        const earGeometry = new THREE.ConeGeometry(1, 3, 4);
        const earMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });

        const leftEar = new THREE.Mesh(earGeometry, earMaterial);
        leftEar.position.set(-1.5, 10, 0);
        group.add(leftEar);

        const rightEar = new THREE.Mesh(earGeometry, earMaterial);
        rightEar.position.set(1.5, 10, 0);
        group.add(rightEar);

        // Arms
        const armGeometry = new THREE.BoxGeometry(3, 10, 3);
        const armMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });

        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-5.5, 2, 0);
        group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(5.5, 2, 0);
        group.add(rightArm);

        // Legs
        const legGeometry = new THREE.BoxGeometry(3, 6, 3);
        const legMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });

        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-2, -9, 0);
        group.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(2, -9, 0);
        group.add(rightLeg);

        group.position.y = GAME_CONSTANTS.PLAYER.HEIGHT;  // Changed from HEIGHT/2 to HEIGHT
        group.castShadow = true;

        return group;
    }

    addFaceFeatures(head) {
        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.5);
        const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-1.5, 1, -3); // Changed Z from 3 to -3
        head.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(1.5, 1, -3); // Changed Z from 3 to -3
        head.add(rightEye);

        // Mouth
        const mouth = new THREE.Mesh(
            new THREE.BoxGeometry(3, 1, 1),
            new THREE.MeshPhongMaterial({ color: 0x000000 })
        );
        mouth.position.set(0, -1, -3); // Changed Z from 3 to -3
        head.add(mouth);
    }

    getPlayerColor() {
        const colors = {
            george: 0x8B4513,  // Brown for gorilla
            lizzie: 0x228B22,  // Green for lizard
            ralph: 0x808080    // Gray for wolf
        };
        return colors[this.type];
    }

    setupControls() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(event) {
        switch(event.key) {
            case 'ArrowUp':
                this.velocity.z = -GAME_CONSTANTS.PLAYER.MOVE_SPEED;
                break;
            case 'ArrowDown':
                this.velocity.z = GAME_CONSTANTS.PLAYER.MOVE_SPEED;
                break;
            case 'ArrowLeft':
                this.velocity.rotation = GAME_CONSTANTS.PLAYER.ROTATION_SPEED;
                break;
            case 'ArrowRight':
                this.velocity.rotation = -GAME_CONSTANTS.PLAYER.ROTATION_SPEED;
                break;
            case ' ':
                this.jump();
                break;
        }
    }

    handleKeyUp(event) {
        switch(event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
                this.velocity.z = 0;
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
                this.velocity.rotation = 0;
                break;
        }
    }

    jump() {
        if (!this.isJumping && !this.isClimbing) {
            this.isJumping = true;
            this.velocity.y = GAME_CONSTANTS.PLAYER.JUMP_FORCE;
        }
    }

    update(delta) {
        // Update rotation
        this.rotation += this.velocity.rotation * delta;

        // Calculate movement based on rotation
        this.moveDirection.set(0, 0, this.velocity.z);
        this.moveDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation);

        // Update position
        this.position.x += this.moveDirection.x * delta;
        this.position.z += this.moveDirection.z * delta;

        // Apply gravity if not climbing
        if (!this.isClimbing) {
            this.velocity.y -= 0.01 * delta; // Gravity
        }

        // Update position
        this.position.y = Math.max(
            GAME_CONSTANTS.PLAYER.HEIGHT, // Changed from HEIGHT/2 to HEIGHT
            this.position.y + this.velocity.y * delta
        );

        // Update mesh position and rotation
        this.mesh.position.set(
            this.position.x,
            this.position.y,
            this.position.z
        );
        this.mesh.rotation.y = this.rotation;

        // Ground collision (temporary)
        if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y = 0;
            this.isJumping = false;
        }
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        document.getElementById('health').textContent = `Health: ${this.health}%`;
    }
}