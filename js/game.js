class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        // Game objects
        this.player = null;
        this.cannon = null;
        this.shieldRings = [];
        this.mines = [];
        this.playerShots = [];
        this.cannonShots = [];
        this.scoreText = null;
        this.livesText = null;
        this.levelText = null;
    }

    preload() {
        // No assets needed for line art game
    }

    create() {
        // Clear any previous game state
        this.graphics = this.add.graphics();
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Initialize game state
        this.gameState = {
            lives: 3,
            score: 0,
            level: 1,
            cannonExposed: false,
            cannonDestroyed: false
        };

        this.shieldRings = [];
        this.mines = [];
        this.playerShots = [];
        this.cannonShots = [];

        // Create game objects
        this.createPlayer();
        this.createShieldRings();
        this.createCannon();
        this.createMines();

        // Create UI
        this.scoreText = this.add.text(20, 20, `Score: ${this.gameState.score}`, {
            fontSize: '16px',
            fill: '#ffffff'
        });
        this.livesText = this.add.text(20, 40, `Lives: ${this.gameState.lives}`, {
            fontSize: '16px',
            fill: '#ffffff'
        });
        this.levelText = this.add.text(20, 60, `Level: ${this.gameState.level}`, {
            fontSize: '16px',
            fill: '#ffffff'
        });

        // Pause menu
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.pause();
            this.scene.launch('PauseScene');
        });
    }

    update(time, delta) {
        if (this.gameState.lives <= 0) {
            this.scene.start('GameOverScene', {
                score: this.gameState.score,
                level: this.gameState.level
            });
            return;
        }

        // Clear graphics
        this.graphics.clear();

        // Update game objects
        this.updatePlayer(delta);
        this.updateShieldRings(delta);
        this.updateMines(delta);
        this.updateCannon(delta);
        this.updateShots(delta);
        this.checkCollisions();

        // Draw everything
        this.drawShieldRings();
        this.drawCannon();
        this.drawPlayer();
        this.drawMines();
        this.drawShots();

        // Check win condition
        if (this.gameState.cannonDestroyed) {
            this.nextLevel();
        }

        // Update UI
        this.scoreText.setText(`Score: ${this.gameState.score}`);
        this.livesText.setText(`Lives: ${this.gameState.lives}`);
        this.levelText.setText(`Level: ${this.gameState.level}`);
    }

    updatePlayer(delta) {
        // Handle input
        if (this.cursors.left.isDown) {
            this.player.angle -= this.player.rotationSpeed;
        }
        if (this.cursors.right.isDown) {
            this.player.angle += this.player.rotationSpeed;
        }
        if (this.cursors.up.isDown) {
            this.player.vx += Math.cos(this.player.angle) * this.player.thrust;
            this.player.vy += Math.sin(this.player.angle) * this.player.thrust;
        }

        // Apply friction
        this.player.vx *= 0.98;
        this.player.vy *= 0.98;

        // Update position
        this.player.x += this.player.vx;
        this.player.y += this.player.vy;

        // Keep within bounds
        this.player.x = Math.max(20, Math.min(CANVAS_WIDTH - 20, this.player.x));
        this.player.y = Math.max(20, Math.min(CANVAS_HEIGHT - 20, this.player.y));

        // Handle shooting
        if (this.player.shotCooldown > 0) {
            this.player.shotCooldown--;
        }
        if (this.spacebar.isDown && this.player.shotCooldown === 0) {
            this.firePlayerShot();
            this.player.shotCooldown = 30;
        }
    }

    updateShieldRings(delta) {
        this.shieldRings.forEach(ring => {
            ring.rotation += ring.rotationSpeed;
        });

        // Check if cannon is exposed
        const innerRing = this.shieldRings[2];
        this.gameState.cannonExposed = innerRing.segments.some(seg => !seg.active);
    }

    updateMines(delta) {
        this.mines.forEach((mine, index) => {
            if (mine.outward) {
                // Move outward
                mine.x += mine.vx * mine.speed;
                mine.y += mine.vy * mine.speed;

                // Check if passed through outer ring
                const dist = Math.sqrt(Math.pow(mine.x - CENTER_X, 2) + Math.pow(mine.y - CENTER_Y, 2));
                if (dist > SHIELD_RADII[0]) {
                    mine.outward = false;
                }
            } else {
                // Homing mode
                const dx = this.player.x - mine.x;
                const dy = this.player.y - mine.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > 0) {
                    mine.vx = (dx / dist) * mine.homingSpeed;
                    mine.vy = (dy / dist) * mine.homingSpeed;
                    mine.x += mine.vx;
                    mine.y += mine.vy;
                }
            }
        });
    }

    updateCannon(delta) {
        if (!this.gameState.cannonExposed || !this.cannon.active) return;

        this.cannon.fireTimer++;
        if (this.cannon.fireTimer >= this.cannon.fireRate) {
            this.fireCannonShot();
            this.cannon.fireTimer = 0;
        }
    }

    updateShots(delta) {
        // Update player shots
        this.playerShots = this.playerShots.filter(shot => {
            shot.x += shot.vx;
            shot.y += shot.vy;

            // Remove if out of bounds
            return shot.x > 0 && shot.x < CANVAS_WIDTH && shot.y > 0 && shot.y < CANVAS_HEIGHT;
        });

        // Update cannon shots
        this.cannonShots = this.cannonShots.filter(shot => {
            shot.x += shot.vx;
            shot.y += shot.vy;

            // Remove if out of bounds
            return shot.x > 0 && shot.x < CANVAS_WIDTH && shot.y > 0 && shot.y < CANVAS_HEIGHT;
        });
    }

    firePlayerShot() {
        this.playerShots.push({
            x: this.player.x + Math.cos(this.player.angle) * 15,
            y: this.player.y + Math.sin(this.player.angle) * 15,
            vx: Math.cos(this.player.angle) * 4,
            vy: Math.sin(this.player.angle) * 4,
            radius: 2
        });
    }

    fireCannonShot() {
        const dx = this.player.x - this.cannon.x;
        const dy = this.player.y - this.cannon.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            this.cannonShots.push({
                x: this.cannon.x,
                y: this.cannon.y,
                vx: (dx / dist) * 1.5,
                vy: (dy / dist) * 1.5,
                radius: 6
            });
        }
    }

    pointToLineDistance(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        if (lenSq !== 0) {
            param = dot / lenSq;
        }

        let xx, yy;
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

    checkCollisions() {
        // Player vs shield segments
        this.shieldRings.forEach(ring => {
            ring.segments.forEach((segment, segIndex) => {
                if (!segment.active) return;

                const angle = ring.rotation + segIndex * SEGMENT_SIZE;
                const x1 = CENTER_X + Math.cos(angle) * ring.radius;
                const y1 = CENTER_Y + Math.sin(angle) * ring.radius;
                const x2 = CENTER_X + Math.cos(angle + SEGMENT_SIZE) * ring.radius;
                const y2 = CENTER_Y + Math.sin(angle + SEGMENT_SIZE) * ring.radius;

                const dist = this.pointToLineDistance(this.player.x, this.player.y, x1, y1, x2, y2);
                if (dist < 10) { // Player radius approx 10
                    this.playerHit();
                }
            });
        });

        // Player shots vs shield segments
        this.playerShots.forEach((shot, shotIndex) => {
            this.shieldRings.forEach((ring, ringIndex) => {
                ring.segments.forEach((segment, segIndex) => {
                    if (!segment.active) return;

                    const angle = ring.rotation + segIndex * SEGMENT_SIZE;
                    const x1 = CENTER_X + Math.cos(angle) * ring.radius;
                    const y1 = CENTER_Y + Math.sin(angle) * ring.radius;
                    const x2 = CENTER_X + Math.cos(angle + SEGMENT_SIZE) * ring.radius;
                    const y2 = CENTER_Y + Math.sin(angle + SEGMENT_SIZE) * ring.radius;

                    // Check distance from bullet to line segment
                    const dist = this.pointToLineDistance(shot.x, shot.y, x1, y1, x2, y2);

                    if (dist < shot.radius + 2) { // Bullet radius + small buffer
                        segment.hits--;
                        if (segment.hits <= 0) {
                            segment.active = false;
                        }
                        this.playerShots.splice(shotIndex, 1);
                    }
                });
            });
        });

        // Player shots vs mines
        this.playerShots.forEach((shot, shotIndex) => {
            this.mines.forEach((mine, mineIndex) => {
                const dist = Math.sqrt(Math.pow(shot.x - mine.x, 2) + Math.pow(shot.y - mine.y, 2));
                if (dist < shot.radius + mine.radius) {
                    this.mines.splice(mineIndex, 1);
                    this.playerShots.splice(shotIndex, 1);
                    this.spawnMine();
                }
            });
        });

        // Player shots vs cannon
        this.playerShots.forEach((shot, shotIndex) => {
            if (this.gameState.cannonExposed && this.cannon.active) {
                const dist = Math.sqrt(Math.pow(shot.x - this.cannon.x, 2) + Math.pow(shot.y - this.cannon.y, 2));
                if (dist < 20) {
                    this.cannon.active = false;
                    this.gameState.cannonDestroyed = true;
                    this.gameState.score += 100;
                    this.playerShots.splice(shotIndex, 1);
                }
            }
        });

        // Cannon shots vs player
        this.cannonShots.forEach((shot, shotIndex) => {
            const dist = Math.sqrt(Math.pow(shot.x - this.player.x, 2) + Math.pow(shot.y - this.player.y, 2));
            if (dist < shot.radius + 10) {
                this.playerHit();
                this.cannonShots.splice(shotIndex, 1);
            }
        });

        // Mines vs player
        this.mines.forEach(mine => {
            const dist = Math.sqrt(Math.pow(mine.x - this.player.x, 2) + Math.pow(mine.y - this.player.y, 2));
            if (dist < mine.radius + 10) {
                this.playerHit();
            }
        });
    }

    playerHit() {
        this.gameState.lives--;
        if (this.gameState.lives <= 0) {
            this.scene.start('GameOverScene', {
                score: this.gameState.score,
                level: this.gameState.level
            });
        } else {
            // Respawn player
            this.player.x = PLAYER_START_X;
            this.player.y = PLAYER_START_Y;
            this.player.vx = 0;
            this.player.vy = 0;
            this.player.angle = Math.atan2(CENTER_Y - PLAYER_START_Y, CENTER_X - PLAYER_START_X);
        }
    }

    nextLevel() {
        this.gameState.level++;
        this.gameState.cannonDestroyed = false;
        this.gameState.cannonExposed = false;
        this.gameState.lives++;

        // Reset shields
        this.createShieldRings();

        // Reset cannon
        this.createCannon();

        // Clear shots
        this.playerShots = [];
        this.cannonShots = [];

        // Respawn player
        this.player.x = PLAYER_START_X;
        this.player.y = PLAYER_START_Y;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.angle = Math.atan2(CENTER_Y - PLAYER_START_Y, CENTER_X - PLAYER_START_X);
    }

    drawPlayer() {
        const cos = Math.cos(this.player.angle);
        const sin = Math.sin(this.player.angle);

        this.graphics.lineStyle(2, 0x00ff00);
        this.graphics.beginPath();

        // Calculate rotated triangle points
        const p1x = this.player.x + cos * 15 - sin * 0;
        const p1y = this.player.y + sin * 15 + cos * 0;
        const p2x = this.player.x + cos * -10 - sin * -8;
        const p2y = this.player.y + sin * -10 + cos * -8;
        const p3x = this.player.x + cos * -5 - sin * 0;
        const p3y = this.player.y + sin * -5 + cos * 0;
        const p4x = this.player.x + cos * -10 - sin * 8;
        const p4y = this.player.y + sin * -10 + cos * 8;

        this.graphics.moveTo(p1x, p1y);
        this.graphics.lineTo(p2x, p2y);
        this.graphics.lineTo(p3x, p3y);
        this.graphics.lineTo(p4x, p4y);
        this.graphics.closePath();
        this.graphics.strokePath();
    }

    drawShieldRings() {
        this.graphics.lineStyle(2, 0xffffff);

        this.shieldRings.forEach(ring => {
            ring.segments.forEach((segment, segIndex) => {
                if (!segment.active) return;

                const startAngle = ring.rotation + segIndex * SEGMENT_SIZE;
                const endAngle = startAngle + SEGMENT_SIZE;

                const x1 = CENTER_X + Math.cos(startAngle) * ring.radius;
                const y1 = CENTER_Y + Math.sin(startAngle) * ring.radius;
                const x2 = CENTER_X + Math.cos(endAngle) * ring.radius;
                const y2 = CENTER_Y + Math.sin(endAngle) * ring.radius;

                this.graphics.beginPath();
                this.graphics.moveTo(x1, y1);
                this.graphics.lineTo(x2, y2);
                this.graphics.strokePath();
            });
        });
    }

    drawCannon() {
        if (!this.cannon.active) return;

        // Calculate angle to player for aiming
        const dx = this.player.x - this.cannon.x;
        const dy = this.player.y - this.cannon.y;
        const angleToPlayer = Math.atan2(dy, dx);

        if (this.gameState.cannonExposed) {
            this.graphics.lineStyle(2, 0xff0000);

            // Draw main wedge body (triangular fortress shape)
            const wedgeSize = 25;
            this.graphics.beginPath();
            this.graphics.moveTo(this.cannon.x, this.cannon.y);
            this.graphics.lineTo(
                this.cannon.x + Math.cos(angleToPlayer - Math.PI/6) * wedgeSize,
                this.cannon.y + Math.sin(angleToPlayer - Math.PI/6) * wedgeSize
            );
            this.graphics.lineTo(
                this.cannon.x + Math.cos(angleToPlayer + Math.PI/6) * wedgeSize,
                this.cannon.y + Math.sin(angleToPlayer + Math.PI/6) * wedgeSize
            );
            this.graphics.closePath();
            this.graphics.strokePath();

            // Draw cannon barrel
            const barrelLength = 35;
            this.graphics.beginPath();
            this.graphics.moveTo(
                this.cannon.x + Math.cos(angleToPlayer - Math.PI/12) * 15,
                this.cannon.y + Math.sin(angleToPlayer - Math.PI/12) * 15
            );
            this.graphics.lineTo(
                this.cannon.x + Math.cos(angleToPlayer) * barrelLength,
                this.cannon.y + Math.sin(angleToPlayer) * barrelLength
            );
            this.graphics.lineTo(
                this.cannon.x + Math.cos(angleToPlayer + Math.PI/12) * 15,
                this.cannon.y + Math.sin(angleToPlayer + Math.PI/12) * 15
            );
            this.graphics.strokePath();

            // Draw fortress details (corner turrets)
            const turretSize = 8;
            const turretAngles = [Math.PI/4, 3*Math.PI/4, 5*Math.PI/4, 7*Math.PI/4];
            turretAngles.forEach(turretAngle => {
                this.graphics.beginPath();
                this.graphics.arc(
                    this.cannon.x + Math.cos(turretAngle) * 20,
                    this.cannon.y + Math.sin(turretAngle) * 20,
                    turretSize, 0, Math.PI * 2
                );
                this.graphics.strokePath();
            });
        } else {
            // Draw dormant fortress (always visible)
            this.graphics.lineStyle(2, 0x800000);

            // Draw central core
            this.graphics.beginPath();
            this.graphics.arc(this.cannon.x, this.cannon.y, 12, 0, Math.PI * 2);
            this.graphics.strokePath();

            // Draw fortress outline (octagon shape)
            this.graphics.beginPath();
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI) / 4;
                const x = this.cannon.x + Math.cos(angle) * 20;
                const y = this.cannon.y + Math.sin(angle) * 20;
                if (i === 0) {
                    this.graphics.moveTo(x, y);
                } else {
                    this.graphics.lineTo(x, y);
                }
            }
            this.graphics.closePath();
            this.graphics.strokePath();

            // Draw tracking indicator (small circle showing aim)
            this.graphics.lineStyle(1, 0x800000);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0) {
                const x = this.cannon.x + (dx / dist) * 25;
                const y = this.cannon.y + (dy / dist) * 25;
                this.graphics.beginPath();
                this.graphics.arc(x, y, 3, 0, Math.PI * 2);
                this.graphics.strokePath();
            }
        }
    }

    drawMines() {
        this.graphics.fillStyle(0xff0000);
        this.mines.forEach(mine => {
            this.graphics.beginPath();
            this.graphics.arc(mine.x, mine.y, mine.radius, 0, Math.PI * 2);
            this.graphics.fillPath();
        });
    }

    drawShots() {
        // Player shots
        this.graphics.fillStyle(0xffffff);
        this.playerShots.forEach(shot => {
            this.graphics.beginPath();
            this.graphics.arc(shot.x, shot.y, shot.radius, 0, Math.PI * 2);
            this.graphics.fillPath();
        });

                // Cannon shots
                this.graphics.fillStyle(0xff0000);
                this.cannonShots.forEach(shot => {
                    this.graphics.fillRect(shot.x - shot.radius, shot.y - shot.radius, shot.radius * 2, shot.radius * 2);
                });
    }

    createPlayer() {
        this.player = {
            x: PLAYER_START_X,
            y: PLAYER_START_Y,
            angle: Math.atan2(CENTER_Y - PLAYER_START_Y, CENTER_X - PLAYER_START_X),
            vx: 0,
            vy: 0,
            thrust: 0.075,
            rotationSpeed: 0.025,
            shotCooldown: 0
        };
    }

    createShieldRings() {
        this.shieldRings = [];
        for (let ringIndex = 0; ringIndex < 3; ringIndex++) {
            const radius = SHIELD_RADII[ringIndex];
            const segments = [];
            for (let segIndex = 0; segIndex < SEGMENTS_PER_RING; segIndex++) {
                segments.push({
                    hits: HITS_PER_SEGMENT,
                    active: true
                });
            }
            this.shieldRings.push({
                radius: radius,
                segments: segments,
                rotation: 0,
                rotationSpeed: 0.0025 * (this.gameState.level + ringIndex * 0.5)
            });
        }
    }

    createCannon() {
        this.cannon = {
            x: CENTER_X,
            y: CENTER_Y,
            active: true,
            fireTimer: 0,
            fireRate: 240 - this.gameState.level * 20
        };
    }

    createMines() {
        this.mines = [];
        for (let i = 0; i < 3; i++) {
            this.spawnMine();
        }
    }

    spawnMine() {
        const angle = Math.random() * Math.PI * 2;
        this.mines.push({
            x: CENTER_X,
            y: CENTER_Y,
            vx: Math.cos(angle) * 2,
            vy: Math.sin(angle) * 2,
            outward: true,
            speed: 0.5 + this.gameState.level * 0.125,
            homingSpeed: 0.375 + this.gameState.level * 0.075,
            radius: 5
        });
    }
}