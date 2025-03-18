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
        INITIAL_Y: 8, // Starting height off the ground
        ROTATION_SPEED: 0.002,  // Much slower rotation
        MOVE_SPEED: 0.5      // Speed of forward/backward movement
    },
    CAMERA: {
        FOV: 75,              // Increased field of view
        NEAR: 0.1,
        FAR: 1000,
        OFFSET: {
            x: 0,
            y: 30,
            z: 60
        },
        ZOOM: {
            SPEED: 2,
            MIN_MULTIPLIER: 0.5,  // Allows zooming in to original close position
            MAX_MULTIPLIER: 2     // Allows zooming out to 2x the new default position
        },
        LOOK_OFFSET: {
            x: 0,
            y: 5,
            z: 0
        },
        LERP_FACTOR: 0.1,    // Increased for more responsive camera movement
        LOOK_AHEAD: 20  // Distance to look ahead of player
    },
    GRID: {
        SIZE: 100,
        DIVISIONS: 10
    },
    WORLD: {
        SIZE: 500,            // Size of the game plane
        BUILDING_SPREAD: 150, // How far buildings can spawn from center
        BUILDING_COUNT: 20    // Number of buildings to create
    },
    RENDERER: {
        SHADOW_MAP_SIZE: 512,  // Reduced for better performance
        MAX_LIGHTS: 2,
        BATCH_SIZE: 100,
        PERFORMANCE: {
            UPDATE_INTERVAL: 16,  // ~60fps
            SHADOW_UPDATE_INTERVAL: 500,  // Update shadows every 500ms
            FRUSTUM_CULLING_MARGIN: 1.5,
            FRUSTUM_MARGIN: 2.0,    // Increased margin for smoother culling
            VIEW_DISTANCE: 300      // Maximum distance to render buildings
        }
    }
};