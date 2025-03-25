const GAME_CONSTANTS = {
    BUILDING: {
        MIN_HEIGHT: 48,  // 3x player height
        MAX_HEIGHT: 96,  // 6x player height
        WIDTH: 20,
        DEPTH: 20,
        SEGMENTS: 6,
        MAX_HEALTH: 100,
        SECTIONS: 5,  // Number of destructible sections
        DEBRIS_COUNT: 15,
        DAMAGE_POINTS: 10
    },
    PLAYER: {
        HEIGHT: 16,
        WIDTH: 8,
        DEPTH: 6,
        SPEED: 0.3,
        MAX_HEALTH: 100,
        SCALE: 1.5,
        INITIAL_Y: 8, // Starting height off the ground
        ROTATION_SPEED: 0.002,  // Much slower rotation
        MOVE_SPEED: 0.5,      // Speed of forward/backward movement
        ATTACK_DAMAGE: 20,
        ATTACK_RANGE: 35,
        ATTACK_COOLDOWN: 300, // milliseconds
        CLIMBING_SPEED: 0.3,
        CLIMBING_CHECK_DISTANCE: 35,
        COLLISION: {
            BOX_WIDTH: 14,      // Increased from 10 to accommodate arms
            BOX_HEIGHT: 16,     // Kept the same
            BOX_DEPTH: 8,       // Kept the same
            DETECTION_MARGIN: 1, // Extra margin for collision detection
            DEBUG: true         // Set to true to see collision boxes
        },
        ATTACK: {
            DAMAGE: 20,
            RANGE: 35,
            COOLDOWN: 500,
            ANIMATION_DURATION: 300,  // Increased for more visible animation
            SWING_ANGLE: Math.PI / 2  // 90 degrees total swing
        }
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
        SIZE: 5000,           // Reduced from 50000 to 5000
        MIN_BUILDING_DISTANCE: 100,  // Minimum distance between buildings
        BUILDING_DENSITY: 0.00004,    // Buildings per square unit
        BUILDING_SPREAD: 150, // This won't be needed anymore
        BUILDING_COUNT: 20    // This will be determined by buildings config
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
    },
    GAME: {
        SCORE: {
            BUILDING_DESTROY: 1000,
            DAMAGE_BONUS: 100
        }
    }
};