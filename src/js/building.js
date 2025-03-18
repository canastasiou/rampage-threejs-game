class Building {
    constructor(x = 0, height = GAME_CONSTANTS.BUILDING.MAX_HEIGHT) {
        this.mesh = this.createBuildingMesh(height);
        this.mesh.position.x = x;
        this.mesh.position.y = height / 2;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }

    createBuildingMesh(height) {
        const geometry = new THREE.BoxGeometry(
            GAME_CONSTANTS.BUILDING.WIDTH,
            height,
            GAME_CONSTANTS.BUILDING.DEPTH
        );

        // Create windows texture
        const windowPattern = this.createWindowPattern();
        const material = new THREE.MeshPhongMaterial({
            color: 0x808080,
            map: windowPattern,
            flatShading: true
        });

        return new THREE.Mesh(geometry, material);
    }

    createWindowPattern() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        // Draw window pattern
        ctx.fillStyle = '#555';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#888';
        ctx.fillRect(2, 2, 12, 12);
        ctx.fillRect(18, 2, 12, 12);
        ctx.fillRect(2, 18, 12, 12);
        ctx.fillRect(18, 18, 12, 12);

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 4);

        return texture;
    }
}