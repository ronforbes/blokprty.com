class BoardController {
    private board: Board;
    private phaserGame: Phaser.Game;
    private selectedBlock: Block;

    constructor(board: Board, phaserGame: Phaser.Game) {
        this.board = board;
        this.phaserGame = phaserGame;

        for(let x = 0; x < Board.Columns; x++) {
            for(let y = 0; y < Board.Rows; y++) {
                this.board.Blocks[x][y].Sprite.inputEnabled = true;
                this.board.Blocks[x][y].Sprite.events.onInputDown.add(this.OnInputDown, this, 0, this.board.Blocks[x][y]);
                this.board.Blocks[x][y].Sprite.events.onInputUp.add(this.OnInputUp, this, 0, this.board.Blocks[x][y]);
            }
        }
    }

    private OnInputDown(sprite: Phaser.Sprite, pointer: Phaser.Pointer, block: Block) {
        this.selectedBlock = block;
    }

    private OnInputUp(sprite: Phaser.Sprite, pointer: Phaser.Pointer, block: Block) {
        this.selectedBlock = null;
    }

    Update() {
        if(this.selectedBlock != null) {
            let leftEdge: number = this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2 + this.selectedBlock.X * BlockRenderer.Width;
            let rightEdge: number = this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2 + this.selectedBlock.X * BlockRenderer.Width + BlockRenderer.Width;

            let leftBlock: Block;
            let rightBlock: Block;

            let pointerPosition: Phaser.Point = this.phaserGame.input.activePointer.position;

            if(pointerPosition.x < leftEdge &&
                this.selectedBlock.State == BlockState.Idle &&
                this.selectedBlock.X - 1 >= 0 &&
                (this.board.Blocks[this.selectedBlock.X - 1][this.selectedBlock.Y].State == BlockState.Idle ||
                this.board.Blocks[this.selectedBlock.X - 1][this.selectedBlock.Y].State == BlockState.Empty) &&
                (this.selectedBlock.Y - 1 == 0 || (this.selectedBlock.Y - 1 > 0 &&
                this.board.Blocks[this.selectedBlock.X - 1][this.selectedBlock.Y - 1].State != BlockState.Falling &&
                this.board.Blocks[this.selectedBlock.X - 1][this.selectedBlock.Y - 1].State != BlockState.WaitingToFall))) {
                    leftBlock = this.board.Blocks[this.selectedBlock.X - 1][this.selectedBlock.Y];
                    rightBlock = this.selectedBlock;
                    this.selectedBlock = leftBlock;
            }

            if(pointerPosition.x > rightEdge &&
                this.selectedBlock.State == BlockState.Idle &&
                this.selectedBlock.X + 1 < Board.Columns &&
                (this.board.Blocks[this.selectedBlock.X + 1][this.selectedBlock.Y].State == BlockState.Idle ||
                this.board.Blocks[this.selectedBlock.X + 1][this.selectedBlock.Y].State == BlockState.Empty) &&
                (this.selectedBlock.Y - 1 == 0 || (this.selectedBlock.Y - 1 > 0 &&
                this.board.Blocks[this.selectedBlock.X + 1][this.selectedBlock.Y - 1].State != BlockState.Falling &&
                this.board.Blocks[this.selectedBlock.X + 1][this.selectedBlock.Y - 1].State != BlockState.WaitingToFall))) {
                    leftBlock = this.selectedBlock;
                    rightBlock = this.board.Blocks[this.selectedBlock.X + 1][this.selectedBlock.Y];
                    this.selectedBlock = rightBlock;
            }

            if(leftBlock != null && rightBlock != null) {
                this.SetupSlide(leftBlock, SlideDirection.Right);
                this.SetupSlide(rightBlock, SlideDirection.Left);

                leftBlock.Slider.Slide(SlideDirection.Right);
                rightBlock.Slider.Slide(SlideDirection.Left);
            }
        }
    }

    private SetupSlide(block: Block, direction: SlideDirection) {
        // Save the state of the block that this one will swap with
        let targetBlock: Block;
        if(direction == SlideDirection.Left) {
            targetBlock = this.board.Blocks[block.X - 1][block.Y];
        }

        if(direction == SlideDirection.Right) {
            targetBlock = this.board.Blocks[block.X + 1][block.Y];
        }

        block.Slider.TargetState = targetBlock.State;
        block.Slider.TargetType = targetBlock.Type;
    }
}