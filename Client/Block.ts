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
    Sprite: Phaser.Sprite;
    private renderer: BlockRenderer;
    Slider: BlockSlider;
    Matcher: BlockMatcher;
    Clearer: BlockClearer;
    Emptier: BlockEmptier;
    Faller: BlockFaller;
    Chainer: BlockChainer;

    constructor(board: Board, group: Phaser.Group, scoreboard: Scoreboard, signManager: SignManager) {
        this.Sprite = group.create(0, 0, "Block");

        this.renderer = new BlockRenderer(this);
        this.Slider = new BlockSlider(this, board.MatchDetector);
        this.Matcher = new BlockMatcher(this);
        this.Clearer = new BlockClearer(this, scoreboard, signManager);
        this.Emptier = new BlockEmptier(this);
        this.Faller = new BlockFaller(this);
        this.Chainer = new BlockChainer();
    }

    Update(elapsedGameTime: number) {
        this.renderer.Update();
        this.Slider.Update(elapsedGameTime);
        this.Matcher.Update(elapsedGameTime);
        this.Clearer.Update(elapsedGameTime);
        this.Emptier.Update(elapsedGameTime);
        this.Faller.Update(elapsedGameTime);
    }
}