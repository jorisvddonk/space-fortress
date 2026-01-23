const config = {
    type: Phaser.AUTO,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#000000',
    scene: [MenuScene, HelpScene, CreditsScene, GameScene, GameOverScene, PauseScene]
};

const game = new Phaser.Game(config);