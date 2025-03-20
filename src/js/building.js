class Building {
    static initializeInstancedMesh(count) {
        // Initialize geometry if not exists
        if (!Building.geometry) {
            Building.geometry = new THREE.BoxGeometry(
                GAME_CONSTANTS.BUILDING.WIDTH,
                GAME_CONSTANTS.BUILDING.MAX_HEIGHT,
                GAME_CONSTANTS.BUILDING.DEPTH
            );
        }

        // Initialize material if not exists
        if (!Building.material) {
            Building.material = new THREE.MeshPhongMaterial({
                color: 0x808080,
                flatShading: true
            });
        }

        // Initialize dummy object for matrix calculations
        Building.dummy = new THREE.Object3D();

        // Create instanced mesh
        Building.instancedMesh = new THREE.InstancedMesh(
            Building.geometry,
            Building.material,
            count
        );

        Building.instancedMesh.castShadow = true;
        Building.instancedMesh.receiveShadow = true;

        return Building.instancedMesh;
    }

    static getInstancedMesh() {
        return Building.instancedMesh;
    }

    constructor(x = 0, height = GAME_CONSTANTS.BUILDING.MAX_HEIGHT, z = 0, index) {
        this.position = new THREE.Vector3(x, height/2, z);
        this.height = height;
        this.scale = new THREE.Vector3(
            1,
            height/GAME_CONSTANTS.BUILDING.MAX_HEIGHT,
            1
        );
        this.health = GAME_CONSTANTS.BUILDING.MAX_HEALTH;
        this.damaged = false;
        this.sections = [];
        this.index = index;  // Store the instance index
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

    takeDamage(amount, hitPoint) {
        this.health -= amount;
        if (this.health <= 0) {
            return this.destroy();
        }
        this.showDamage(hitPoint);
    }

    showDamage(hitPoint) {
        // Create damage effect (cracks, broken windows)
        const damageMarker = new THREE.Mesh(
            new THREE.SphereGeometry(2),
            new THREE.MeshBasicMaterial({ color: 0x000000 })
        );
        damageMarker.position.copy(hitPoint);
        this.mesh.add(damageMarker);
    }

    destroy() {
        // Add destruction animation and debris
        this.createDebris();
        return true; // Building destroyed
    }
}