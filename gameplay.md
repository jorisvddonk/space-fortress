# Space Fortress Gameplay Documentation

This document describes the gameplay for a faithful HTML5 clone of the classic arcade game *Star Castle*, to be implemented with Phaser.js using line art graphics.

## Overview
*Space Fortress* is a multidirectional shooter where the player pilots a spaceship to destroy a central enemy cannon protected by rotating energy shield rings. The player must navigate around the screen, avoid homing mines, and breach the shields to attack the cannon directly.

## Objective
- Breach all three shield rings to expose the central cannon.
- Destroy the cannon to complete the level and score points.
- Survive increasing difficulty across levels.
- Earn extra lives for each cannon destroyed.

## Controls
- **Left Arrow**: Rotate player ship counterclockwise.
- **Right Arrow**: Rotate player ship clockwise.
- **Up Arrow**: Thrust forward (accelerate ship in facing direction).
- **Spacebar**: Fire small projectiles outward from the ship's front.

## Screen Layout
- **Canvas Size**: 800x600 pixels.
- **Center**: (400, 300) - location of the cannon and shield rings.
- **Player Ship**: Starts at (400, 350), can move freely around the screen (with screen boundaries).

## Gameplay Elements

### Player Ship
- **Appearance**: Green triangle (line art), pointing in movement direction.
- **Movement**: Free 2D movement. Rotate with left/right arrows, thrust with up arrow.
- **Firing**: Shoots small white projectiles (dots or lines) in facing direction. Cooldown between shots.
- **Lives**: Player starts with 3 ships. Extra ship awarded for each cannon destroyed.
- **Collision**: If hit by cannon projectiles or mines, lose one life and respawn at starting position (400, 350).

### Shield Rings
- **Structure**: Three concentric rings centered at (400, 300).
  - Outer ring: Radius 240
  - Middle ring: Radius 160
  - Inner ring: Radius 80
- **Segments**: Each ring has 12 equal segments (30 degrees each).
- **Hits Required**: Each segment takes 2 hits to destroy.
- **Rotation**: Rings rotate continuously around the center at increasing speeds per level.
- **Appearance**: Drawn as arcs (white lines). Only intact segments are visible.
- **Destruction**: Player projectiles destroy segments on contact. Rings regenerate partially if outer ring is fully destroyed (expand middle to outer, inner to middle, new inner from center).

### Cannon (Enemy)
- **Location**: Fixed at center (400, 300).
- **Appearance**: Red square or circle (line art).
- **Protection**: Hidden behind shield rings. Only exposed after inner ring is fully breached.
- **Destruction**: Once exposed, hit with projectiles to destroy. Awards 100 points, extra life, advances level, resets shields.
- **Tracking**: The cannon core tracks player movement at all times.
- **Firing**: When shields are breached, periodically fires large red projectiles toward the player. Audio effect: loud hissing noise when fired.

### Homing Mines
- **Count**: 3 active at all times.
- **Behavior**:
  - Spawn at center (400, 300).
  - Move outward in straight lines, passing through the energy shield rings.
  - After passing through the rings, switch to homing mode: actively track and pursue the player.
  - Get progressively faster with each level, forcing constant player movement.
- **Appearance**: Small red circles (filled).
- **Destruction**: Can be shot by player. Respawns immediately from center when destroyed.
- **Threat**: Destroy player ship on contact (lose one life).

### Projectiles
- **Player Shots**: Small white projectiles. Move straight in firing direction. Destroy on ring/mine/cannon contact or screen edge.
- **Cannon Shots**: Large red squares. Fired from center toward player when shields breached. Move slowly, destroy on contact with player (reset player) or screen edge.

## Levels and Progression
- **Starting Level**: 1
- **Advancement**: Destroying the cannon advances to next level.
- **Difficulty Scaling**:
  - Ring rotation speed increases.
  - Mine outward and homing speeds increase.
  - Cannon firing rate increases.
- **Reset on Level Up**: Shields fully restored, cannon respawns at center.

## Scoring
- **Cannon Destruction**: 100 points per level.
- **Shield Segments**: Points may be awarded (original game specifics vary by version).
- **Mines**: Points may be awarded in some versions (original specifics vary by version).
- **Extra Lives**: Awarded for each cannon destroyed.

## Game Over / Survival
- **Lives System**: Player starts with 3 lives. Game ends when all lives are lost.
- **Focus**: Survival and high score achievement.
- **Penalties**: Cannon shots and mine collisions cost one life. Respawn at (400, 350).

## Technical Implementation Notes
- **Framework**: Phaser.js 3.x (CDN: https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js)
- **Graphics**: All elements use Phaser.Graphics for line art (no sprites/textures). Simplified from original vector graphics with color overlay.
- **Physics**: Manual collision detection (distance checks).
- **Audio**: Hissing sound effect when cannon fires large projectiles.
- **Performance**: Designed for single HTML file, runs in browser.
- **Boundaries**: Player and projectiles constrained to 800x600 canvas.
- **Randomness**: Mine spawn directions, cannon firing timing.
- **Player Tracking**: Cannon core continuously tracks player position for aiming.

## Original Game Reference
Based on Cinematronics' 1980 arcade game *Star Castle*. Key differences: Simplified for HTML5, no color overlays, focus on core mechanics.</content>
<parameter name="filePath">/var/home/joris/projects/spacefortress/gameplay.md