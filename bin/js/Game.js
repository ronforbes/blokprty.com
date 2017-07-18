var BlockState;
(function (BlockState) {
    BlockState[BlockState["Empty"] = 0] = "Empty";
    BlockState[BlockState["Idle"] = 1] = "Idle";
    BlockState[BlockState["Sliding"] = 2] = "Sliding";
    BlockState[BlockState["WaitingToFall"] = 3] = "WaitingToFall";
    BlockState[BlockState["Falling"] = 4] = "Falling";
    BlockState[BlockState["Matched"] = 5] = "Matched";
    BlockState[BlockState["WaitingToClear"] = 6] = "WaitingToClear";
    BlockState[BlockState["Clearing"] = 7] = "Clearing";
    BlockState[BlockState["WaitingToEmpty"] = 8] = "WaitingToEmpty";
})(BlockState || (BlockState = {}));
var Block = (function () {
    function Block(phaserGame, boardController) {
        this.phaserGame = phaserGame;
        this.Sprite = this.phaserGame.add.sprite(0, 0, BlockRenderer.Key);
        this.renderer = new BlockRenderer(this, this.phaserGame);
        this.Slider = new BlockSlider(this, this.phaserGame);
    }
    Block.prototype.Update = function () {
        this.renderer.Update();
        this.Slider.Update();
    };
    Block.TypeCount = 6;
    return Block;
}());
var BlockRenderer = (function () {
    function BlockRenderer(block, phaserGame) {
        this.colors = [
            0xff0000,
            0x00ff00,
            0x0000ff,
            0xffff00,
            0xff00ff,
            0x00ffff
        ];
        this.block = block;
        this.phaserGame = phaserGame;
        this.block.Sprite.scale.setTo(45, 45);
    }
    BlockRenderer.prototype.Update = function () {
        var timePercentage = 0;
        switch (this.block.State) {
            case BlockState.Idle:
                this.block.Sprite.position.setTo(this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2 + this.block.X * BlockRenderer.Width, this.phaserGame.height / 2 - Board.Rows * BlockRenderer.Height / 2 + this.block.Y * BlockRenderer.Height);
                this.block.Sprite.tint = this.colors[this.block.Type];
                break;
            case BlockState.Sliding:
                var destination = 0;
                if (this.block.Slider.Direction == SlideDirection.Left) {
                    destination = -BlockRenderer.Width;
                }
                if (this.block.Slider.Direction == SlideDirection.Right) {
                    destination = BlockRenderer.Width;
                }
                timePercentage = this.block.Slider.Elapsed / BlockSlider.Duration;
                this.block.Sprite.position.setTo(this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2 + this.block.X * BlockRenderer.Width + destination * timePercentage, this.phaserGame.height / 2 - Board.Rows * BlockRenderer.Height / 2 + this.block.Y * BlockRenderer.Height);
                if (this.block.Type == -1) {
                    this.block.Sprite.visible = false;
                }
                else {
                    this.block.Sprite.visible = true;
                    this.block.Sprite.tint = this.colors[this.block.Type];
                }
                break;
        }
    };
    BlockRenderer.Key = "block";
    BlockRenderer.Url = "assets/sprites/pixel.png";
    BlockRenderer.Width = 50;
    BlockRenderer.Height = 50;
    return BlockRenderer;
}());
var SlideDirection;
(function (SlideDirection) {
    SlideDirection[SlideDirection["Left"] = 0] = "Left";
    SlideDirection[SlideDirection["Right"] = 1] = "Right";
    SlideDirection[SlideDirection["None"] = 2] = "None";
})(SlideDirection || (SlideDirection = {}));
var BlockSlider = (function () {
    function BlockSlider(block, phaserGame) {
        this.block = block;
        this.phaserGame = phaserGame;
        //matchDetector = blah blah blah
    }
    BlockSlider.prototype.Slide = function (direction) {
        this.block.State = BlockState.Sliding;
        // Reset the sliding timer
        this.Elapsed = 0;
        this.Direction = direction;
    };
    BlockSlider.prototype.Update = function () {
        if (this.block.State == BlockState.Sliding) {
            this.Elapsed += this.phaserGame.time.elapsed;
            if (this.Elapsed >= BlockSlider.Duration) {
                this.block.State = this.TargetState;
                this.block.Type = this.TargetType;
                this.Direction = SlideDirection.None;
                if (this.block.State == BlockState.Idle) {
                    // match detector request match detection (block)
                }
            }
        }
    };
    BlockSlider.Duration = 100;
    return BlockSlider;
}());
var Board = (function () {
    function Board(phaserGame) {
        this.phaserGame = phaserGame;
        this.Blocks = [];
        for (var x = 0; x < Board.Columns; x++) {
            this.Blocks[x] = [];
            for (var y = 0; y < Board.Rows; y++) {
                this.Blocks[x][y] = new Block(this.phaserGame, this.controller);
                this.Blocks[x][y].X = x;
                this.Blocks[x][y].Y = y;
                var type = void 0;
                do {
                    type = this.phaserGame.rnd.integerInRange(0, Block.TypeCount - 1);
                } while ((x != 0 && this.Blocks[x - 1][y].Type == type) || (y != 0 && this.Blocks[x][y - 1].Type == type));
                this.Blocks[x][y].Type = type;
                this.Blocks[x][y].State = BlockState.Idle;
            }
        }
        this.controller = new BoardController(this, this.phaserGame);
        ;
    }
    Board.prototype.Update = function () {
        for (var x = 0; x < Board.Columns; x++) {
            for (var y = 0; y < Board.Rows; y++) {
                this.Blocks[x][y].Update();
            }
        }
        this.controller.Update();
    };
    Board.Columns = 6;
    Board.Rows = 11;
    return Board;
}());
var BoardController = (function () {
    function BoardController(board, phaserGame) {
        this.board = board;
        this.phaserGame = phaserGame;
        for (var x = 0; x < Board.Columns; x++) {
            for (var y = 0; y < Board.Rows; y++) {
                this.board.Blocks[x][y].Sprite.inputEnabled = true;
                this.board.Blocks[x][y].Sprite.events.onInputDown.add(this.OnInputDown, this, 0, this.board.Blocks[x][y]);
                this.board.Blocks[x][y].Sprite.events.onInputUp.add(this.OnInputUp, this, 0, this.board.Blocks[x][y]);
            }
        }
    }
    BoardController.prototype.OnInputDown = function (sprite, pointer, block) {
        this.selectedBlock = block;
    };
    BoardController.prototype.OnInputUp = function (sprite, pointer, block) {
        this.selectedBlock = null;
    };
    BoardController.prototype.Update = function () {
        if (this.selectedBlock != null) {
            var leftEdge = this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2 + this.selectedBlock.X * BlockRenderer.Width;
            var rightEdge = this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2 + this.selectedBlock.X * BlockRenderer.Width + BlockRenderer.Width;
            var leftBlock = void 0;
            var rightBlock = void 0;
            var pointerPosition = this.phaserGame.input.activePointer.position;
            if (pointerPosition.x < leftEdge &&
                this.selectedBlock.State == BlockState.Idle &&
                this.selectedBlock.X - 1 >= 0 &&
                (this.board.Blocks[this.selectedBlock.X - 1][this.selectedBlock.Y].State == BlockState.Idle ||
                    this.board.Blocks[this.selectedBlock.X - 1][this.selectedBlock.Y].State == BlockState.Empty) &&
                (this.selectedBlock.Y + 1 == Board.Rows || (this.selectedBlock.Y + 1 < Board.Rows &&
                    this.board.Blocks[this.selectedBlock.X - 1][this.selectedBlock.Y + 1].State != BlockState.Falling &&
                    this.board.Blocks[this.selectedBlock.X - 1][this.selectedBlock.Y + 1].State != BlockState.WaitingToFall))) {
                leftBlock = this.board.Blocks[this.selectedBlock.X - 1][this.selectedBlock.Y];
                rightBlock = this.selectedBlock;
                this.selectedBlock = leftBlock;
            }
            if (pointerPosition.x > rightEdge &&
                this.selectedBlock.State == BlockState.Idle &&
                this.selectedBlock.X + 1 < Board.Columns &&
                (this.board.Blocks[this.selectedBlock.X + 1][this.selectedBlock.Y].State == BlockState.Idle ||
                    this.board.Blocks[this.selectedBlock.X + 1][this.selectedBlock.Y].State == BlockState.Empty) &&
                (this.selectedBlock.Y + 1 == Board.Rows || (this.selectedBlock.Y + 1 < Board.Rows &&
                    this.board.Blocks[this.selectedBlock.X + 1][this.selectedBlock.Y + 1].State != BlockState.Falling &&
                    this.board.Blocks[this.selectedBlock.X + 1][this.selectedBlock.Y + 1].State != BlockState.WaitingToFall))) {
                leftBlock = this.selectedBlock;
                rightBlock = this.board.Blocks[this.selectedBlock.X + 1][this.selectedBlock.Y];
                this.selectedBlock = rightBlock;
            }
            if (leftBlock != null && rightBlock != null) {
                this.SetupSlide(leftBlock, SlideDirection.Right);
                this.SetupSlide(rightBlock, SlideDirection.Left);
                leftBlock.Slider.Slide(SlideDirection.Right);
                rightBlock.Slider.Slide(SlideDirection.Left);
            }
        }
    };
    BoardController.prototype.SetupSlide = function (block, direction) {
        // Save the state of the block that this one will swap with
        var targetBlock;
        if (direction == SlideDirection.Left) {
            targetBlock = this.board.Blocks[block.X - 1][block.Y];
        }
        if (direction == SlideDirection.Right) {
            targetBlock = this.board.Blocks[block.X + 1][block.Y];
        }
        block.Slider.TargetState = targetBlock.State;
        block.Slider.TargetType = targetBlock.Type;
    };
    return BoardController;
}());
var Game = (function () {
    function Game() {
        this.game = new Phaser.Game("100%", "100%", Phaser.AUTO, 'game', { preload: this.preload, create: this.create, update: this.update });
    }
    Game.prototype.preload = function () {
        this.game.load.image(BlockRenderer.Key, BlockRenderer.Url);
    };
    Game.prototype.create = function () {
        this.board = new Board(this.game);
    };
    Game.prototype.update = function () {
        this.board.Update();
    };
    return Game;
}());
window.onload = function () {
    var game = new Game();
};
