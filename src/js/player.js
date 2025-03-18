class Player {
    constructor(type = 'george') {
        this.type = type;
        this.mesh = this.createPlayerMesh();
        this.position = { x: 0, y: 0, z: 0 };
        this.velocity = { x: 0, y: 0 };
        this.isJumping = false;
        this.isClimbing = false;
        this.health = GAME_CONSTANTS.PLAYER.MAX_HEALTH;
        this.direction = 1; // 1 for right, -1 for left
        this.setupControls();
    }

    createPlayerMesh() {
        // Temporary geometry - will be replaced with proper monster models later
        const geometry = new THREE.BoxGeometry(
            GAME_CONSTANTS.PLAYER.WIDTH,
            GAME_CONSTANTS.PLAYER.HEIGHT,
            1
        );
        const material = new THREE.MeshPhongMaterial({ color: this.getPlayerColor() });
        return new THREE.Mesh(geometry, material);
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
                this.velocity.x = -GAME_CONSTANTS.PLAYER.SPEED;
                this.direction = -1;
                break;
            case 'ArrowRight':
                this.velocity.x = GAME_CONSTANTS.PLAYER.SPEED;
                this.direction = 1;
                break;
            case 'ArrowUp':
                if (this.isClimbing) {
                    this.velocity.y = GAME_CONSTANTS.PLAYER.SPEED;
                }
                break;
            case 'ArrowDown':
                if (this.isClimbing) {
                    this.velocity.y = -GAME_CONSTANTS.PLAYER.SPEED;
                }
                break;
            case ' ': // Spacebar
                this.jump();
                break;
        }
    }

    handleKeyUp(event) {
        switch(event.key) {
            case 'ArrowLeft':
            case 'ArrowRight':
                this.velocity.x = 0;
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                if (this.isClimbing) {
                    this.velocity.y = 0;
                }
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
        // Apply gravity if not climbing
        if (!this.isClimbing) {
            this.velocity.y -= 0.01 * delta; // Gravity
        }

        // Update position
        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;

        // Update mesh position
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);

        // Update mesh rotation based on direction
        this.mesh.rotation.y = this.direction > 0 ? 0 : Math.PI;

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