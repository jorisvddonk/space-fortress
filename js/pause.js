class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene', active: false });
    }

    create() {
        // Semi-transparent overlay
        this.add.rectangle(500, 375, 1000, 750, 0x000000, 0.7);

        // Pause text
        this.add.text(500, 300, 'PAUSED', {
            fontSize: '48px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // Menu options
        this.menuOptions = [];
        this.selectedIndex = 0;

        const resumeText = this.add.text(500, 400, 'RESUME', {
            fontSize: '32px',
            fill: '#ffff00'
        }).setOrigin(0.5).setInteractive();
        this.menuOptions.push(resumeText);

        const menuText = this.add.text(500, 470, 'MAIN MENU', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();
        this.menuOptions.push(menuText);

        // Keyboard navigation
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        resumeText.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('GameScene');
        });

        menuText.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('MenuScene');
        });

        // Update visual selection
        this.updateMenuSelection();
    }

    update() {
        // Handle keyboard navigation
        if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
            this.selectedIndex = (this.selectedIndex + 1) % this.menuOptions.length;
            this.updateMenuSelection();
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            this.selectedIndex = (this.selectedIndex - 1 + this.menuOptions.length) % this.menuOptions.length;
            this.updateMenuSelection();
        }

        // Handle selection
        if (Phaser.Input.Keyboard.JustDown(this.spacebar) || Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.selectCurrentOption();
        }

        // ESC to resume
        if (Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
            this.scene.stop();
            this.scene.resume('GameScene');
        }
    }

    updateMenuSelection() {
        this.menuOptions.forEach((option, index) => {
            if (index === this.selectedIndex) {
                option.setFill('#ffff00');
            } else {
                option.setFill('#ffffff');
            }
        });
    }

    selectCurrentOption() {
        if (this.selectedIndex === 0) {
            this.scene.stop();
            this.scene.resume('GameScene'); // Resume
        } else {
            this.scene.stop();
            this.scene.start('MenuScene'); // Main Menu
        }
    }
}