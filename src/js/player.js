class Player {
    constructor(type = 'george') {
        this.type = type;
        this.rightArm = null;  // Reference to the arm mesh
        this.mesh = this.createPlayerMesh();

        // Set initial position at origin, on the ground
        this.position = {
            x: 0,
            y: GAME_CONSTANTS.PLAYER.HEIGHT, // Changed from HEIGHT/2 to HEIGHT
            z: 0
        };

        this.velocity = { x: 0, y: 0, z: 0, rotation: 0 };
        this.direction = 1;
        this.isClimbing = false;
        this.health = GAME_CONSTANTS.PLAYER.MAX_HEALTH;
        this.rotation = 0; // Current rotation angle
        this.moveDirection = new THREE.Vector3(); // Movement direction vector
        this.attackCooldown = 0;
        this.isAttacking = false;
        this.debugBox = null;
        this.lastSafePosition = new THREE.Vector3();
        this.isClimbing = false;
        this.isLatched = false;
        this.latchTargetY = null;
        this.ignoreInput = false;
        this.isAttacking = false;
        this.attackStartTime = 0;
        this.attackProgress = 0;

        // Apply initial position to mesh
        this.mesh.position.set(
            this.position.x,
            this.position.y,
            this.position.z
        );

        this.setupControls();
    }

    createPlayerMesh() {
        this.mesh = new THREE.Group();

        // Add shadow catcher
        const shadowCatcher = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10),
            new THREE.ShadowMaterial({ opacity: 0.3 })
        );
        shadowCatcher.rotation.x = -Math.PI / 2;
        shadowCatcher.position.y = -GAME_CONSTANTS.PLAYER.HEIGHT / 2;
        shadowCatcher.receiveShadow = true;
        this.mesh.add(shadowCatcher);

        // Create character based on type
        switch (this.type) {
            case 'george':
                this.createGorilla(this.mesh);
                break;
            case 'lizzie':
                this.createLizard(this.mesh);
                break;
            case 'ralph':
                this.createWolf(this.mesh);
                break;
            default:
                this.createGorilla(this.mesh);
        }

        // Set initial mesh properties
        this.mesh.position.y = GAME_CONSTANTS.PLAYER.HEIGHT;
        this.mesh.rotation.y = Math.PI;
        this.mesh.castShadow = true;

        console.log("Mesh: ", this.mesh);

        return this.mesh;
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

        this.createRightArm(group, armMaterial);

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
    }

    createLizard(group) {
        // Body - made slightly larger to match arm scale
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(8, 12, 6),  // Wider to match arm connection
            new THREE.MeshPhongMaterial({ color: 0x228B22 })
        );
        group.add(body);

        // Head (elongated for lizard look)
        const head = new THREE.Mesh(
            new THREE.BoxGeometry(6, 5, 8),  // Adjusted proportions
            new THREE.MeshPhongMaterial({ color: 0x228B22 })
        );
        head.position.y = 8;
        group.add(head);

        // Tail - thicker to match new proportions
        const tail = new THREE.Mesh(
            new THREE.BoxGeometry(3, 8, 3),
            new THREE.MeshPhongMaterial({ color: 0x228B22 })
        );
        tail.position.set(0, -6, 3);
        tail.rotation.x = Math.PI / 4;
        group.add(tail);

        // Left arm - match right arm dimensions
        const leftArmGeometry = new THREE.BoxGeometry(3, 10, 3);
        const limbMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
        const leftArm = new THREE.Mesh(leftArmGeometry, limbMaterial);
        leftArm.position.set(-5.5, 2, 0);
        group.add(leftArm);

        // Right arm created through createRightArm
        this.createRightArm(group, limbMaterial);

        // Add lizard legs
        const legGeometry = new THREE.BoxGeometry(3, 6, 3);

        const leftLeg = new THREE.Mesh(legGeometry, limbMaterial);
        leftLeg.position.set(-2, -9, 0);
        group.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, limbMaterial);
        rightLeg.position.set(2, -9, 0);
        group.add(rightLeg);

        group.position.y = GAME_CONSTANTS.PLAYER.HEIGHT;
        group.castShadow = true;
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

        this.createRightArm(group, armMaterial);

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
    }

    createRightArm(group, armMaterial) {
        const rightArmGeometry = new THREE.BoxGeometry(3, 10, 3);
        this.rightArm = new THREE.Mesh(rightArmGeometry, armMaterial);

        // Move geometry origin to top of arm (shoulder)
        rightArmGeometry.translate(0, -5, 0);

        // Position arm at shoulder height
        this.rightArm.position.set(5.5, 7, 0);

        // Add to group
        group.add(this.rightArm);
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
        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'ArrowUp':
            case 'ArrowDown':
            case 'w':
                if (this.ignoreInput) return;
                break;
        }

        switch (event.key) {
            case 'ArrowLeft':
                if (!this.isLatched && !this.isClimbing)
                    this.velocity.rotation = GAME_CONSTANTS.PLAYER.ROTATION_SPEED;
                break;
            case 'ArrowRight':
                if (!this.isLatched && !this.isClimbing)
                    this.velocity.rotation = -GAME_CONSTANTS.PLAYER.ROTATION_SPEED;
                break;
            case 'ArrowUp':
                if (!this.isLatched && !this.isClimbing)
                    this.velocity.z = -1;
                break;
            case 'ArrowDown':
                if (!this.isLatched && !this.isClimbing)
                    this.velocity.z = 1;
                break;
            case 'f':
                this.attack();
                break;
            case 'w':
                if (!this.isLatched && !this.isClimbing && this.velocity.z === 0) {
                    const hitBox = this.getClimbingHitbox();
                    const buildings = this.checkBuildingCollisions(hitBox);
                    if (buildings.length > 0) {
                        const building = buildings[0];
                        const targetY = building.position.y + building.height / 2;

                        this.isClimbing = true;
                        this.ignoreInput = true;
                        this.climbingBuilding = building;
                        this.latchTargetY = targetY;

                        this.velocity = { x: 0, y: 0.5, z: 0, rotation: 0 };
                    }
                }
                break;
            case 's':
                if (this.isLatched) {
                    this.position.y = GAME_CONSTANTS.PLAYER.HEIGHT;
                    this.velocity.y = 0;
                    this.isClimbing = false;
                    this.isLatched = false;
                    this.ignoreInput = false;
                    this.climbingBuilding = null;
                }
                break;
        }
    }

    handleKeyUp(event) {
        if (this.ignoreInput) return;
        switch (event.key) {
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

    attack() {
        if (this.attackCooldown > 0 || this.isAttacking) return;

        this.isAttacking = true;
        this.attackCooldown = GAME_CONSTANTS.PLAYER.ATTACK.COOLDOWN;
        this.attackStartTime = Date.now();

        // Check for building damage immediately
        const buildingsHit = this.checkBuildingCollisions(this.getAttackHitbox());
        buildingsHit.forEach(building => {
            building.takeDamage(GAME_CONSTANTS.PLAYER.ATTACK.DAMAGE, this.position);
        });

        // Reset arm position and attack state after animation completes
        setTimeout(() => {
            if (this.rightArm) {
                this.rightArm.rotation.x = 0;
                this.isAttacking = false;
                this.attackProgress = 0;
            }
        }, GAME_CONSTANTS.PLAYER.ATTACK.ANIMATION_DURATION);

        // Reset cooldown separately
        setTimeout(() => {
            this.attackCooldown = 0;
        }, GAME_CONSTANTS.PLAYER.ATTACK.COOLDOWN);
    }

    // Simplified attack hitbox check without visualization
    getAttackHitbox() {
        const forward = this.getForwardDirection();
        const center = new THREE.Vector3()
            .copy(this.position)
            .add(forward.multiplyScalar(10));

        const attackBox = new THREE.Box3();
        attackBox.setFromCenterAndSize(
            center,
            new THREE.Vector3(14, 16, 14)
        );

        return attackBox;
    }

    // New helper method to ensure consistent forward direction
    getForwardDirection() {
        // Account for the 180° rotation of the mesh
        return new THREE.Vector3(
            Math.sin(this.rotation + Math.PI),
            0,
            Math.cos(this.rotation + Math.PI)
        ).normalize();
    }

    // Improved debug box creation
    createDebugBox(box, color) {
        const size = new THREE.Vector3();
        box.getSize(size);

        const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });

        const mesh = new THREE.Mesh(geometry, material);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // Position relative to player
        mesh.position.copy(center.sub(this.position));

        return mesh;
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
        const distances = [];
        const buildingsInScene = this.getBuildingsFromScene();

        buildingsInScene.forEach(building => {
            if (building && !building.destroyed) {
                const buildingBox = new THREE.Box3();
                buildingBox.setFromCenterAndSize(
                    building.position,
                    new THREE.Vector3(
                        GAME_CONSTANTS.BUILDING.WIDTH,
                        building.height,
                        GAME_CONSTANTS.BUILDING.DEPTH
                    )
                );

                const distance = new THREE.Vector3(this.position.x, building.position.y, this.position.z)
                    .distanceTo(building.position);

                distances.push(distance);

                if (distance <= GAME_CONSTANTS.PLAYER.CLIMBING_CHECK_DISTANCE) {
                    buildings.push(building);

                    // Check if player is facing the building
                    const playerForward = new THREE.Vector3(
                        Math.sin(this.rotation),
                        0,
                        Math.cos(this.rotation)
                    );

                    const toBuilding = new THREE.Vector3().subVectors(building.position, this.position).normalize();
                    const dot = playerForward.dot(toBuilding);

                    if (dot > 0.7) {
                        // We are facing the building
                        this.climbingBuilding = building;
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
        // Store current position for collision check
        const previousPosition = {
            x: this.position.x,
            y: this.position.y,
            z: this.position.z
        };

        // Update rotation and calculate next position
        this.rotation += this.velocity.rotation * delta;

        // Calculate movement
        const moveVector = new THREE.Vector3(0, 0, this.velocity.z);
        moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation);

        const nextPosition = {
            x: this.position.x + moveVector.x * GAME_CONSTANTS.PLAYER.MOVE_SPEED * delta,
            y: this.position.y + this.velocity.y * delta,
            z: this.position.z + moveVector.z * GAME_CONSTANTS.PLAYER.MOVE_SPEED * delta
        };

        // Check world boundaries
        const halfWorldSize = GAME_CONSTANTS.WORLD.SIZE / 2;
        const playerHalfWidth = GAME_CONSTANTS.PLAYER.COLLISION.BOX_WIDTH / 2;
        const playerHalfDepth = GAME_CONSTANTS.PLAYER.COLLISION.BOX_DEPTH / 2;

        // X-axis boundary check with debug logging
        if (Math.abs(nextPosition.x) + playerHalfWidth > halfWorldSize) {
            nextPosition.x = Math.sign(nextPosition.x) * (halfWorldSize - playerHalfWidth);
        }

        // Z-axis boundary check with debug logging
        if (Math.abs(nextPosition.z) + playerHalfDepth > halfWorldSize) {
            nextPosition.z = Math.sign(nextPosition.z) * (halfWorldSize - playerHalfDepth);
        }

        // Create player bounding box for building collision detection
        const playerBox = new THREE.Box3();
        const playerSize = new THREE.Vector3(
            GAME_CONSTANTS.PLAYER.COLLISION.BOX_WIDTH,
            GAME_CONSTANTS.PLAYER.COLLISION.BOX_HEIGHT,
            GAME_CONSTANTS.PLAYER.COLLISION.BOX_DEPTH
        );
        playerBox.setFromCenterAndSize(
            new THREE.Vector3(nextPosition.x, nextPosition.y, nextPosition.z),
            playerSize
        );

        // Check building collisions
        const buildings = this.getBuildingsFromScene();
        buildings.forEach(building => {
            if (!building || building.destroyed) return;

            const buildingBox = new THREE.Box3();
            buildingBox.setFromCenterAndSize(
                building.position,
                new THREE.Vector3(
                    GAME_CONSTANTS.BUILDING.WIDTH,
                    building.height,
                    GAME_CONSTANTS.BUILDING.DEPTH
                )
            );

            if (playerBox.intersectsBox(buildingBox)) {
                if (!this.isClimbing || building !== this.climbingBuilding) {
                    nextPosition.x = previousPosition.x;
                    nextPosition.z = previousPosition.z;
                }
            }
        });

        // Update position if no collision or climbing
        this.position = nextPosition;

        // Complete climbing to midpoint
        if (this.isClimbing && this.latchTargetY !== null) {
            if (this.position.y >= this.latchTargetY) {
                this.position.y = this.latchTargetY;
                this.velocity.y = 0;
                this.isClimbing = false;
                this.isLatched = true;
                this.latchTargetY = null;
            }
        }

        // Prevent movement while latched
        if (this.isLatched || this.isClimbing) {
            this.velocity.x = 0;
            this.velocity.z = 0;
            this.velocity.rotation = 0;
        }


        // Keep y position constant when not climbing
        if (!this.isClimbing && !this.isLatched && this.latchTargetY === null) {
            this.position.y = GAME_CONSTANTS.PLAYER.HEIGHT;
        }

        // Update mesh position and rotation
        this.mesh.position.copy(this.position);
        this.mesh.rotation.y = this.rotation;

        // Update attack animation
        if (this.isAttacking && this.rightArm) {
            const elapsed = Date.now() - this.attackStartTime;
            const duration = GAME_CONSTANTS.PLAYER.ATTACK.ANIMATION_DURATION;
            const progress = Math.min(elapsed / duration, 1);

            // Full animation cycle using sine, with positive rotation to swing forward
            const swingAngle = Math.sin(progress * Math.PI) * (Math.PI / 4);

            // Remove the negative sign to reverse the swing direction
            this.rightArm.rotation.x = swingAngle;
        } else if (this.rightArm) {
            // Ensure arm is at rest position when not attacking
            this.rightArm.rotation.x = 0;
        }

        // Update debug visualization
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