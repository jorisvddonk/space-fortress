class HelpScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HelpScene' });
    }

    create() {
        // Title
        this.add.text(500, 100, 'HOW TO PLAY', {
            fontSize: '36px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // Game elements
        this.add.text(500, 140, 'GAME ELEMENTS:', {
            fontSize: '20px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // Draw visual examples and labels (vertically stacked)
        this.graphics = this.add.graphics();

        // Player example and label
        this.add.text(500, 170, 'Player: Green triangular ship', { fontSize: '16px', fill: '#ffffff', align: 'center' }).setOrigin(0.5);
        const playerX = 500, playerY = 195;
        const cos = 1, sin = 0; // facing right
        this.graphics.lineStyle(2, 0x00ff00);
        this.graphics.beginPath();
        const p1x = playerX + cos * 15 - sin * 0;
        const p1y = playerY + sin * 15 + cos * 0;
        const p2x = playerX + cos * -10 - sin * -8;
        const p2y = playerY + sin * -10 + cos * -8;
        const p3x = playerX + cos * -5 - sin * 0;
        const p3y = playerY + sin * -5 + cos * 0;
        const p4x = playerX + cos * -10 - sin * 8;
        const p4y = playerY + sin * -10 + cos * 8;
        this.graphics.moveTo(p1x, p1y);
        this.graphics.lineTo(p2x, p2y);
        this.graphics.lineTo(p3x, p3y);
        this.graphics.lineTo(p4x, p4y);
        this.graphics.closePath();
        this.graphics.strokePath();

        // Shield ring example
        this.add.text(500, 240, 'Shield Rings: Rotating white segments protecting the center', { fontSize: '16px', fill: '#ffffff', align: 'center' }).setOrigin(0.5);
        this.graphics.lineStyle(2, 0xffffff);
        const centerX = 500, centerY = 290, radius = 25;
        const segmentSize = Math.PI * 2 / 12;
        for (let segIndex = 0; segIndex < 12; segIndex++) {
            if (segIndex % 4 !== 0) continue; // only draw every 4th for example
            const startAngle = segIndex * segmentSize;
            const endAngle = startAngle + segmentSize;
            const x1 = centerX + Math.cos(startAngle) * radius;
            const y1 = centerY + Math.sin(startAngle) * radius;
            const x2 = centerX + Math.cos(endAngle) * radius;
            const y2 = centerY + Math.sin(endAngle) * radius;
            this.graphics.beginPath();
            this.graphics.moveTo(x1, y1);
            this.graphics.lineTo(x2, y2);
            this.graphics.strokePath();
        }

        // Mine example
        this.add.text(500, 350, 'Mines: Red circles that chase you after passing through shields', { fontSize: '16px', fill: '#ffffff', align: 'center' }).setOrigin(0.5);
        this.graphics.fillStyle(0xff0000);
        this.graphics.beginPath();
        this.graphics.arc(500, 375, 8, 0, Math.PI * 2);
        this.graphics.fillPath();

        // Cannon example (dormant)
        this.add.text(500, 410, 'Cannon: Red fortress in center that shoots when exposed', { fontSize: '16px', fill: '#ffffff', align: 'center' }).setOrigin(0.5);
        const cannonX = 500, cannonY = 435;
        this.graphics.lineStyle(2, 0x800000);
        // Central core
        this.graphics.beginPath();
        this.graphics.arc(cannonX, cannonY, 8, 0, Math.PI * 2);
        this.graphics.strokePath();
        // Octagon outline
        this.graphics.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const x = cannonX + Math.cos(angle) * 15;
            const y = cannonY + Math.sin(angle) * 15;
            if (i === 0) {
                this.graphics.moveTo(x, y);
            } else {
                this.graphics.lineTo(x, y);
            }
        }
        this.graphics.closePath();
        this.graphics.strokePath();

        // Instructions
        this.add.text(500, 490, 'Use arrow keys to navigate menus, SPACE/ENTER to select', {
            fontSize: '16px',
            fill: '#888888',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(500, 520, 'Use arrow keys to move, SPACE to shoot', {
            fontSize: '16px',
            fill: '#888888',
            align: 'center'
        }).setOrigin(0.5);

        // Objective
        this.add.text(500, 550, 'OBJECTIVE: Destroy the cannon in the center by shooting the shield rings', {
            fontSize: '16px',
            fill: '#888888',
            align: 'center'
        }).setOrigin(0.5);

        // Back button
        const backText = this.add.text(500, 600, 'BACK TO MENU', {
            fontSize: '24px',
            fill: '#ffff00'
        }).setOrigin(0.5).setInteractive();

        // Keyboard navigation
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        backText.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }

    update() {
        // Handle back navigation
        if (Phaser.Input.Keyboard.JustDown(this.spacebar) ||
            Phaser.Input.Keyboard.JustDown(this.enterKey) ||
            Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
            this.scene.start('MenuScene');
        }
    }
}