class Building {
    constructor(x = 0, height = GAME_CONSTANTS.BUILDING.MAX_HEIGHT, z = 0) {
        // Create shared geometry and materials
        if (!Building.geometry) {
            Building.geometry = new THREE.BoxGeometry(
                GAME_CONSTANTS.BUILDING.WIDTH,
                GAME_CONSTANTS.BUILDING.MAX_HEIGHT,
                GAME_CONSTANTS.BUILDING.DEPTH
            );
        }
        if (!Building.material) {
            Building.material = new THREE.MeshPhongMaterial({
                color: 0x808080,
                flatShading: true
            });
        }

        this.mesh = new THREE.Mesh(Building.geometry, Building.material);
        this.mesh.position.set(x, height/2, z);
        this.mesh.scale.y = height/GAME_CONSTANTS.BUILDING.MAX_HEIGHT;

        // Optimize shadows
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.frustumCulled = true; // Enable frustum culling
    }
}