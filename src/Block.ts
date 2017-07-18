enum BlockState {
    Empty,
    Idle,
    Sliding,
    WaitingToFall,
    Falling,
    Matched,
    WaitingToClear,
    Clearing,
    WaitingToEmpty
}

class Block {
    X: number;
    Y: number;
    Type: number;
    static readonly TypeCount: number = 6;
    State: BlockState;
    private phaserGame: Phaser.Game;
    Sprite: Phaser.Sprite;
    private renderer: BlockRenderer;
    public Slider: BlockSlider;

    constructor(phaserGame: Phaser.Game, boardController: BoardController) {
        this.phaserGame = phaserGame;

        this.Sprite = this.phaserGame.add.sprite(0, 0, BlockRenderer.Key);

        this.renderer = new BlockRenderer(this, this.phaserGame);
        this.Slider = new BlockSlider(this, this.phaserGame);
    }

    Update() {
        this.renderer.Update();
        this.Slider.Update();
    }
}