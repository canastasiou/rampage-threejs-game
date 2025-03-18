class Building {
    static initializeInstancedMesh(count) {
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
                flatShading: true,
                vertexColors: false,
                fog: false,
                specular: 0x000000,
                shininess: 0
            });
        }

        // Create instanced mesh
        Building.instancedMesh = new THREE.InstancedMesh(
            Building.geometry,
            Building.material,
            count
        );

        // Setup transform matrix for each instance
        Building.dummy = new THREE.Object3D();
        Building.matrix = new THREE.Matrix4();

        Building.instancedMesh.castShadow = true;
        Building.instancedMesh.receiveShadow = true;
        Building.instancedMesh.frustumCulled = true;

        return Building.instancedMesh;
    }

    constructor(x = 0, height = GAME_CONSTANTS.BUILDING.MAX_HEIGHT, z = 0) {
        this.position = new THREE.Vector3(x, height/2, z);
        this.height = height;
        this.scale = new THREE.Vector3(
            1,
            height/GAME_CONSTANTS.BUILDING.MAX_HEIGHT,
            1
        );
    }

    updateMatrix(index) {
        Building.dummy.position.copy(this.position);
        Building.dummy.scale.copy(this.scale);
        Building.dummy.updateMatrix();

        Building.instancedMesh.setMatrixAt(index, Building.dummy.matrix);

        if (index === GAME_CONSTANTS.WORLD.BUILDING_COUNT - 1) {
            Building.instancedMesh.instanceMatrix.needsUpdate = true;
        }
    }
}