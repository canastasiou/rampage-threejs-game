class Game {
    constructor() {
        this.score = 0;
        this.buildings = [];
        this.enemies = [];
        this.isGameOver = false;
    }

    init() {
        // Create initial buildings
        for (let i = -30; i <= 30; i += 15) {
            const height = Math.random() *
                (GAME_CONSTANTS.BUILDING.MAX_HEIGHT - GAME_CONSTANTS.BUILDING.MIN_HEIGHT) +
                GAME_CONSTANTS.BUILDING.MIN_HEIGHT;
            const building = new Building(i, height);
            this.buildings.push(building);
            gameScene.scene.add(building.mesh);
        }
    }

    updateScore(points) {
        this.score += points;
        document.getElementById('score').textContent = `Score: ${this.score}`;
    }
}