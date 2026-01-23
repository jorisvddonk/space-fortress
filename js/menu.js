class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Title
        this.add.text(500, 200, 'SPACE FORTRESS', {
            fontSize: '48px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // Menu options
        this.menuOptions = [];
        this.selectedIndex = 0;

        const startText = this.add.text(500, 350, 'START GAME', {
            fontSize: '32px',
            fill: '#ffff00'
        }).setOrigin(0.5).setInteractive();
        this.menuOptions.push(startText);

        const helpText = this.add.text(500, 420, 'HELP', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();
        this.menuOptions.push(helpText);

        const creditsText = this.add.text(500, 490, 'CREDITS', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();
        this.menuOptions.push(creditsText);

        // Keyboard navigation
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Menu interactions
        startText.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        helpText.on('pointerdown', () => {
            this.scene.start('HelpScene');
        });

        creditsText.on('pointerdown', () => {
            this.scene.start('CreditsScene');
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
        switch (this.selectedIndex) {
            case 0: // Start Game
                this.scene.start('GameScene');
                break;
            case 1: // Help
                this.scene.start('HelpScene');
                break;
            case 2: // Credits
                this.scene.start('CreditsScene');
                break;
        }
    }
}