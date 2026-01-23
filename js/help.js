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

        // Instructions
        this.add.text(500, 580, 'Use arrow keys to navigate menus, SPACE/ENTER to select', {
            fontSize: '16px',
            fill: '#888888',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(500, 610, 'Use arrow keys to move, SPACE to shoot', {
            fontSize: '16px',
            fill: '#888888',
            align: 'center'
        }).setOrigin(0.5);

        // Back button
        const backText = this.add.text(500, 650, 'BACK TO MENU', {
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