class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.finalLevel = data.level || 1;
    }

    create() {
        // Game Over title
        this.add.text(500, 200, 'GAME OVER', {
            fontSize: '48px',
            fill: '#ff0000',
            align: 'center'
        }).setOrigin(0.5);

        // Final stats
        this.add.text(500, 300, `Final Score: ${this.finalScore}`, {
            fontSize: '32px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(500, 350, `Level Reached: ${this.finalLevel}`, {
            fontSize: '24px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // Menu buttons
        this.menuOptions = [];
        this.selectedIndex = 0;

        const restartText = this.add.text(400, 450, 'PLAY AGAIN', {
            fontSize: '28px',
            fill: '#ffff00'
        }).setOrigin(0.5).setInteractive();
        this.menuOptions.push(restartText);

        const menuText = this.add.text(600, 450, 'MAIN MENU', {
            fontSize: '28px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();
        this.menuOptions.push(menuText);

        // Keyboard navigation
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        restartText.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        menuText.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });

        // Update visual selection
        this.updateMenuSelection();
    }

    update() {
        // Handle keyboard navigation
        if (Phaser.Input.Keyboard.JustDown(this.cursors.right) || Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
            this.selectedIndex = (this.selectedIndex + 1) % this.menuOptions.length;
            this.updateMenuSelection();
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.left) || Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            this.selectedIndex = (this.selectedIndex - 1 + this.menuOptions.length) % this.menuOptions.length;
            this.updateMenuSelection();
        }

        // Handle selection
        if (Phaser.Input.Keyboard.JustDown(this.spacebar) || Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.selectCurrentOption();
        }
    }

    updateMenuSelection() {
        this.menuOptions.forEach((option, index) => {
            if (index === this.selectedIndex) {
                option.setFill('#ffff00');
            } else {
                option.setFill(index === 0 ? '#00ff00' : '#ffffff');
            }
        });
    }

    selectCurrentOption() {
        if (this.selectedIndex === 0) {
            this.scene.start('GameScene'); // Play Again
        } else {
            this.scene.start('MenuScene'); // Main Menu
        }
    }
}