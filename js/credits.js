class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreditsScene' });
    }

    create() {
        // Title
        this.add.text(500, 150, 'CREDITS', {
            fontSize: '36px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // Credits text
        const credits = [
            'Space Fortress Clone',
            'Based on the classic arcade game Star Castle',
            '',
            'Built with Phaser.js',
            'https://phaser.io/',
            '',
            'Original game by Cinematronics, 1980',
            '',
            'This clone created for educational purposes'
        ];

        credits.forEach((line, index) => {
            this.add.text(500, 220 + index * 30, line, {
                fontSize: '18px',
                fill: '#888888',
                align: 'center'
            }).setOrigin(0.5);
        });

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