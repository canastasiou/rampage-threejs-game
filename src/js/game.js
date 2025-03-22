class Game {
    constructor() {
        this.score = 0;
        this.buildings = [];
        this.enemies = [];
        this.isGameOver = false;
        window.gameInstance = this;  // Make game instance globally accessible
    }

    init() {
        // Calculate building count based on world size and density
        const worldArea = GAME_CONSTANTS.WORLD.SIZE * GAME_CONSTANTS.WORLD.SIZE;
        const buildingCount = Math.floor(worldArea * GAME_CONSTANTS.WORLD.BUILDING_DENSITY);

        // Initialize instanced mesh for buildings
        const buildingMesh = Building.initializeInstancedMesh(buildingCount);
        gameScene.scene.add(buildingMesh);

        // Calculate the area where buildings can be placed
        const spread = GAME_CONSTANTS.WORLD.SIZE * 0.4; // Use 80% of world size (40% from center)

        // Create buildings with minimum distance check
        let placedBuildings = 0;
        let attempts = 0;
        const maxAttempts = buildingCount * 10; // Prevent infinite loops

        while (placedBuildings < buildingCount && attempts < maxAttempts) {
            const x = (Math.random() - 0.5) * spread * 2;
            const z = (Math.random() - 0.5) * spread * 2;

            // Check distance from other buildings
            let tooClose = false;
            for (let building of this.buildings) {
                const dx = x - building.position.x;
                const dz = z - building.position.z;
                const distance = Math.sqrt(dx * dx + dz * dz);

                if (distance < GAME_CONSTANTS.WORLD.MIN_BUILDING_DISTANCE) {
                    tooClose = true;
                    break;
                }
            }

            if (!tooClose) {
                const height = Math.random() *
                    (GAME_CONSTANTS.BUILDING.MAX_HEIGHT - GAME_CONSTANTS.BUILDING.MIN_HEIGHT) +
                    GAME_CONSTANTS.BUILDING.MIN_HEIGHT;

                const building = new Building(x, height, z, placedBuildings);
                this.buildings.push(building);
                building.updateMatrix(placedBuildings);
                placedBuildings++;
            }

            attempts++;
        }

        console.log(`Placed ${placedBuildings} buildings in ${attempts} attempts`);

        // Create optimized ground plane
        const groundGeometry = new THREE.PlaneGeometry(
            GAME_CONSTANTS.WORLD.SIZE,
            GAME_CONSTANTS.WORLD.SIZE,
            1,  // Reduced segment count
            1   // Reduced segment count
        );
        const groundMaterial = new THREE.MeshPhongMaterial({
            color: 0x404040,
            side: THREE.DoubleSide
        });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
        gameScene.scene.add(this.ground);

        this.setupGameLoop();
    }

    setupGameLoop() {
        // Check win/lose conditions
        setInterval(() => {
            if (this.buildings.filter(b => b.health > 0).length === 0) {
                this.gameWin();
            }
        }, 1000);
    }

    gameWin() {
        if (!this.isGameOver) {
            this.isGameOver = true;
            alert(`You won! Final score: ${this.score}`);
            location.reload();
        }
    }

    gameLose() {
        if (!this.isGameOver) {
            this.isGameOver = true;
            alert(`Game Over! Score: ${this.score}`);
            location.reload();
        }
    }

    updateScore(points) {
        this.score += points;
        document.getElementById('score').textContent = `Score: ${this.score}`;
    }
}