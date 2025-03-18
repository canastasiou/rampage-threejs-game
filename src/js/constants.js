const GAME_CONSTANTS = {
    BUILDING: {
        MIN_HEIGHT: 30,
        MAX_HEIGHT: 60,
        WIDTH: 20,
        DEPTH: 20,
        SEGMENTS: 6
    },
    PLAYER: {
        HEIGHT: 16,
        WIDTH: 8,
        DEPTH: 6,
        SPEED: 0.3,
        JUMP_FORCE: 0.8,
        MAX_HEALTH: 100,
        SCALE: 1.5,
        INITIAL_Y: 8 // Starting height off the ground
    },
    CAMERA: {
        FOV: 60,
        NEAR: 0.1,
        FAR: 1000,
        OFFSET: {
            x: 0,
            y: 15,
            z: 30  // This is our default/closest zoom
        },
        ZOOM: {
            SPEED: 2,
            MIN_MULTIPLIER: 1,    // Closest zoom (default position)
            MAX_MULTIPLIER: 3     // Furthest zoom (3x further than default)
        },
        LOOK_OFFSET: {
            x: 0,
            y: 5,
            z: 0
        }
    },
    GRID: {
        SIZE: 100,
        DIVISIONS: 10
    }
};