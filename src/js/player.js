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
        this.attackCooldown = 0;
        this.isAttacking = false;
        this.debugBox = null;
        this.lastSafePosition = new THREE.Vector3();

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
            case 'ArrowLeft':
                this.velocity.rotation = GAME_CONSTANTS.PLAYER.ROTATION_SPEED;
                break;
            case 'ArrowRight':
                this.velocity.rotation = -GAME_CONSTANTS.PLAYER.ROTATION_SPEED;
                break;
            case 'ArrowUp':
                this.velocity.z = -1;
                break;
            case 'ArrowDown':
                this.velocity.z = 1;
                break;
            case ' ': // Space
                this.jump();
                break;
            case 'f':
                this.attack();
                break;
            case 'w':
            case 's':
                // Check if we can start climbing
                const hitBox = this.getClimbingHitbox();
                const nearbyBuildings = this.checkBuildingCollisions(hitBox);
                console.log(nearbyBuildings);
                if (nearbyBuildings.length > 0) {
                    this.isClimbing = true;
                    this.climbingBuilding = nearbyBuildings[0];

                    // Set climbing velocity based on key
                    this.velocity.y = event.key === 'w' ?
                        GAME_CONSTANTS.PLAYER.CLIMBING_SPEED :
                        -GAME_CONSTANTS.PLAYER.CLIMBING_SPEED;
                }
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
            case 'w':
            case 's':
                if (this.isClimbing) {
                    this.velocity.y = 0;
                }
                break;
        }
    }

    jump() {
        if (!this.isJumping && !this.isClimbing &&
            this.position.y <= GAME_CONSTANTS.PLAYER.HEIGHT) {
            this.isJumping = true;
            this.velocity.y = GAME_CONSTANTS.PLAYER.JUMP_FORCE;
        }
    }

    attack() {
        if (this.attackCooldown > 0) return;

        this.isAttacking = true;
        this.attackCooldown = GAME_CONSTANTS.PLAYER.ATTACK_COOLDOWN;

        // Visual feedback for attack
        const attackEffect = new THREE.Mesh(
            new THREE.BoxGeometry(10, 10, 10),
            new THREE.MeshBasicMaterial({
                color: 0xff0000,
                transparent: true,
                opacity: 0.3
            })
        );

        // Position attack effect in front of player
        const forward = new THREE.Vector3(
            Math.sin(this.rotation),
            0,
            Math.cos(this.rotation)
        );
        attackEffect.position.copy(this.position).add(forward.multiplyScalar(10));

        this.mesh.add(attackEffect);

        // Remove effect after animation
        setTimeout(() => {
            this.mesh.remove(attackEffect);
        }, 200);

        // Check for building damage
        const buildingsHit = this.checkBuildingCollisions(this.getAttackHitbox());
        buildingsHit.forEach(building => {
            building.takeDamage(GAME_CONSTANTS.PLAYER.ATTACK_DAMAGE, this.position);
        });

        // Reset attack state after cooldown
        setTimeout(() => {
            this.isAttacking = false;
            this.attackCooldown = 0;
        }, GAME_CONSTANTS.PLAYER.ATTACK_COOLDOWN);
    }

    getAttackHitbox() {
        const hitBox = new THREE.Box3().setFromObject(this.mesh);
        hitBox.expandByScalar(GAME_CONSTANTS.PLAYER.ATTACK_RANGE);
        return hitBox;
    }

    getClimbingHitbox() {
        const hitBox = new THREE.Box3().setFromObject(this.mesh);
        // Create a narrower but deeper detection box in front of the player
        const forward = new THREE.Vector3(
            Math.sin(this.rotation),
            0,
            Math.cos(this.rotation)
        );

        hitBox.min.add(forward.multiplyScalar(2));
        hitBox.max.add(forward.multiplyScalar(2));
        hitBox.expandByScalar(2); // Small margin for easier detection

        return hitBox;
    }

    checkBuildingCollisions(hitBox) {
        const buildings = [];
        const buildingsInScene = this.getBuildingsFromScene();

        buildingsInScene.forEach(building => {
            console.log(building.instancedMesh);
            if (building && building.instancedMesh) {
                // For instanced meshes, we need to calculate the world position
                const position = new THREE.Vector3();
                const scale = new THREE.Vector3();
                const matrix = new THREE.Matrix4();

                // Get the instance matrix for this building
                building.instancedMesh.getMatrixAt(building.index, matrix);
                matrix.decompose(position, new THREE.Quaternion(), scale);

                // Create a box for this building instance
                const buildingBox = new THREE.Box3();
                buildingBox.setFromCenterAndSize(
                    position,
                    new THREE.Vector3(
                        GAME_CONSTANTS.BUILDING.WIDTH * scale.x,
                        building.height * scale.y,
                        GAME_CONSTANTS.BUILDING.DEPTH * scale.z
                    )
                );

                if (hitBox.intersectsBox(buildingBox)) {
                    buildings.push(building);

                    // Improve climbing detection
                    const playerForward = new THREE.Vector3(
                        Math.sin(this.rotation),
                        0,
                        Math.cos(this.rotation)
                    );

                    const toBuilding = new THREE.Vector3().subVectors(position, this.position).normalize();
                    const dot = playerForward.dot(toBuilding);

                    // Player is facing the building (within 45 degrees)
                    if (dot > 0.7) {
                        this.isClimbing = true;
                        this.climbingBuilding = building;
                        // Snap to building surface
                        this.position.x = position.x - playerForward.x * (GAME_CONSTANTS.BUILDING.WIDTH/2 + 2);
                        this.position.z = position.z - playerForward.z * (GAME_CONSTANTS.BUILDING.DEPTH/2 + 2);
                    }
                }
            }
        });

        if (buildings.length === 0) {
            this.isClimbing = false;
        }

        return buildings;
    }

    getBuildingsFromScene() {
        // This method needs to be connected to your game's building management
        // You can either:
        // 1. Pass buildings array to player
        // 2. Use a game state manager
        // 3. Use scene traversal (less efficient)
        return window.gameInstance.buildings || [];
    }

    update(delta) {
        // Store current position
        this.lastSafePosition = new THREE.Vector3(
            this.position.x,
            this.position.y,
            this.position.z
        );

        // Update rotation first
        this.rotation += this.velocity.rotation * delta;

        // Calculate movement
        const moveVector = new THREE.Vector3(0, 0, this.velocity.z);
        moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation);

        // Update position temporarily
        const nextPosition = {
            x: this.position.x + moveVector.x * GAME_CONSTANTS.PLAYER.MOVE_SPEED * delta,
            y: this.position.y + this.velocity.y * delta,
            z: this.position.z + moveVector.z * GAME_CONSTANTS.PLAYER.MOVE_SPEED * delta
        };

        // Apply gravity if not climbing
        if (!this.isClimbing) {
            this.velocity.y -= GAME_CONSTANTS.PLAYER.GRAVITY * delta;
        }

        // Get player bounding box at next position
        const playerBox = CollisionHelper.getPlayerBoundingBox(nextPosition);

        // Check collisions
        let hasCollision = false;
        window.gameInstance.buildings.forEach(building => {
            if (!building) return;

            const buildingBox = CollisionHelper.getBuildingBoundingBox(building);
            if (buildingBox && CollisionHelper.checkCollision(playerBox, buildingBox)) {
                hasCollision = true;
                if (!this.isClimbing || building !== this.climbingBuilding) {
                    nextPosition.x = this.lastSafePosition.x;
                    nextPosition.z = this.lastSafePosition.z;
                }
            }
        });

        // Ground collision check
        if (nextPosition.y <= GAME_CONSTANTS.PLAYER.HEIGHT) {
            nextPosition.y = GAME_CONSTANTS.PLAYER.HEIGHT;
            this.velocity.y = 0;
            this.isJumping = false;
        }

        // Update position if no collision or climbing
        this.position = nextPosition;

        // Stop climbing if we've reached the top of the building
        if (this.isClimbing && this.climbingBuilding) {
            if (this.position.y >= this.climbingBuilding.height) {
                this.position.y = this.climbingBuilding.height;
                this.velocity.y = 0;
            }
        }

        // Update mesh
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.mesh.rotation.y = this.rotation;

        // Update debug visualization if enabled
        if (GAME_CONSTANTS.PLAYER.COLLISION.DEBUG) {
            this.updateDebugBox(playerBox);
        }
    }

    updateDebugBox(playerBox) {
        if (this.debugBox) {
            this.mesh.remove(this.debugBox);
        }

        // Create debug box with proper positioning
        const size = new THREE.Vector3();
        playerBox.getSize(size);

        const debugGeometry = new THREE.BoxGeometry(
            GAME_CONSTANTS.PLAYER.COLLISION.BOX_WIDTH,
            GAME_CONSTANTS.PLAYER.COLLISION.BOX_HEIGHT,
            GAME_CONSTANTS.PLAYER.COLLISION.BOX_DEPTH
        );

        const debugMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });

        this.debugBox = new THREE.Mesh(debugGeometry, debugMaterial);

        // Position debug box relative to player mesh
        this.debugBox.position.set(0, 0, 0); // Center on player
        this.mesh.add(this.debugBox);
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        document.getElementById('health').textContent = `Health: ${this.health}%`;
    }
}