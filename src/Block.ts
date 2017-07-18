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
    Slider: BlockSlider;
    Matcher: BlockMatcher;
    Clearer: BlockClearer;
    Emptier: BlockEmptier;

    constructor(phaserGame: Phaser.Game, board: Board) {
        this.phaserGame = phaserGame;

        this.Sprite = this.phaserGame.add.sprite(0, 0, BlockRenderer.Key);

        this.renderer = new BlockRenderer(this, this.phaserGame);
        this.Slider = new BlockSlider(this, this.phaserGame, board.MatchDetector);
        this.Matcher = new BlockMatcher(this, this.phaserGame);
        this.Clearer = new BlockClearer(this, this.phaserGame);
        this.Emptier = new BlockEmptier(this, this.phaserGame);
    }

    Update() {
        this.renderer.Update();
        this.Slider.Update();
        this.Matcher.Update();
        this.Clearer.Update();
        this.Emptier.Update();
    }
}