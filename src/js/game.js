class Game {
    constructor() {
        this.score = 0;
        this.buildings = [];
        this.enemies = [];
        this.isGameOver = false;
    }

    init() {
        // Create buildings in random positions
        for (let i = 0; i < GAME_CONSTANTS.WORLD.BUILDING_COUNT; i++) {
            const x = (Math.random() - 0.5) * GAME_CONSTANTS.WORLD.BUILDING_SPREAD * 2;
            const z = (Math.random() - 0.5) * GAME_CONSTANTS.WORLD.BUILDING_SPREAD * 2;
            const height = Math.random() *
                (GAME_CONSTANTS.BUILDING.MAX_HEIGHT - GAME_CONSTANTS.BUILDING.MIN_HEIGHT) +
                GAME_CONSTANTS.BUILDING.MIN_HEIGHT;

            const building = new Building(x, height, z);
            this.buildings.push(building);
            gameScene.scene.add(building.mesh);
        }

        // Create larger ground plane
        const groundGeometry = new THREE.PlaneGeometry(
            GAME_CONSTANTS.WORLD.SIZE,
            GAME_CONSTANTS.WORLD.SIZE
        );
        const groundMaterial = new THREE.MeshPhongMaterial({
            color: 0x404040,
            side: THREE.DoubleSide
        });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
        gameScene.scene.add(this.ground);
    }

    updateScore(points) {
        this.score += points;
        document.getElementById('score').textContent = `Score: ${this.score}`;
    }
}