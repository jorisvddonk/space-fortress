// Game constants
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 750;
const CENTER_X = 500;
const CENTER_Y = 375;
const PLAYER_START_X = 20;
const PLAYER_START_Y = 730;

// Shield ring configuration
const SHIELD_RADII = [300, 200, 100];
const SEGMENTS_PER_RING = 12;
const SEGMENT_SIZE = Math.PI * 2 / SEGMENTS_PER_RING;
const HITS_PER_SEGMENT = 2;