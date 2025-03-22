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

        // Generate random dark color
        this.color = new THREE.Color().setHSL(
            Math.random(),          // Random hue
            0.5,                    // Medium saturation
            0.2 + Math.random() * 0.2  // Dark luminance (0.2-0.4)
        );
    }

    updateMatrix(index) {
        Building.dummy.position.copy(this.position);
        Building.dummy.scale.copy(this.scale);
        Building.dummy.updateMatrix();

        Building.instancedMesh.setMatrixAt(index, Building.dummy.matrix);
        Building.instancedMesh.setColorAt(index, this.color);

        if (index === GAME_CONSTANTS.WORLD.BUILDING_COUNT - 1) {
            Building.instancedMesh.instanceMatrix.needsUpdate = true;
            Building.instancedMesh.instanceColor.needsUpdate = true;
        }
    }

    takeDamage(amount, hitPoint) {
        this.health -= amount;

        // Visual feedback for damage
        const damageColor = new THREE.Color(0xff0000);
        Building.instancedMesh.setColorAt(this.index, damageColor);
        Building.instancedMesh.instanceColor.needsUpdate = true;

        // Reset to building's original color after damage
        setTimeout(() => {
            Building.instancedMesh.setColorAt(this.index, this.color);
            Building.instancedMesh.instanceColor.needsUpdate = true;
        }, 200);

        if (this.health <= 0) {
            return this.destroy();
        }

        return false;
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