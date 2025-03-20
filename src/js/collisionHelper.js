class CollisionHelper {
    static getPlayerBoundingBox(position) {
        const box = new THREE.Box3();
        const size = new THREE.Vector3(
            GAME_CONSTANTS.PLAYER.COLLISION.BOX_WIDTH,
            GAME_CONSTANTS.PLAYER.COLLISION.BOX_HEIGHT,
            GAME_CONSTANTS.PLAYER.COLLISION.BOX_DEPTH
        );
        box.setFromCenterAndSize(
            new THREE.Vector3(position.x, position.y, position.z),
            size
        );
        return box;
    }

    static getBuildingBoundingBox(building) {
        const instancedMesh = Building.getInstancedMesh();
        if (!instancedMesh) return null;

        const matrix = new THREE.Matrix4();
        instancedMesh.getMatrixAt(building.index, matrix);

        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();
        matrix.decompose(position, quaternion, scale);

        const box = new THREE.Box3();
        box.setFromCenterAndSize(
            position,
            new THREE.Vector3(
                GAME_CONSTANTS.BUILDING.WIDTH,
                building.height,
                GAME_CONSTANTS.BUILDING.DEPTH
            )
        );
        return box;
    }

    static checkCollision(box1, box2) {
        return box1.intersectsBox(box2);
    }

    static createDebugBox(box, color = 0xff0000) {
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
        mesh.position.copy(center);

        return mesh;
    }
}