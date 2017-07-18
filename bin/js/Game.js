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
    function Block(phaserGame, board) {
        this.phaserGame = phaserGame;
        this.Sprite = this.phaserGame.add.sprite(0, 0, BlockRenderer.Key);
        this.renderer = new BlockRenderer(this, this.phaserGame);
        this.Slider = new BlockSlider(this, this.phaserGame, board.MatchDetector);
        this.Matcher = new BlockMatcher(this, this.phaserGame);
        this.Clearer = new BlockClearer(this, this.phaserGame);
        this.Emptier = new BlockEmptier(this, this.phaserGame);
    }
    Block.prototype.Update = function () {
        this.renderer.Update();
        this.Slider.Update();
        this.Matcher.Update();
        this.Clearer.Update();
        this.Emptier.Update();
    };
    Block.TypeCount = 6;
    return Block;
}());
var BlockClearer = (function () {
    function BlockClearer(block, phaserGame) {
        this.block = block;
        this.phaserGame = phaserGame;
    }
    BlockClearer.prototype.Clear = function () {
        this.block.State = BlockState.WaitingToClear;
        this.delayElapsed = 0;
    };
    BlockClearer.prototype.Update = function () {
        // if the game hasn't started or has finished, return immediately
        if (this.block.State == BlockState.WaitingToClear) {
            this.delayElapsed += this.phaserGame.time.elapsed;
            if (this.delayElapsed >= this.DelayDuration) {
                this.block.State = BlockState.Clearing;
                this.Elapsed = 0;
            }
        }
        if (this.block.State == BlockState.Clearing) {
            this.Elapsed += this.phaserGame.time.elapsed;
            if (this.Elapsed >= BlockClearer.Duration) {
                this.block.Emptier.Empty();
            }
        }
    };
    BlockClearer.DelayInterval = 250;
    BlockClearer.Duration = 250;
    return BlockClearer;
}());
var BlockEmptier = (function () {
    function BlockEmptier(block, phaserGame) {
        this.block = block;
        this.phaserGame = phaserGame;
    }
    BlockEmptier.prototype.Empty = function () {
        this.block.State = BlockState.WaitingToEmpty;
        this.delayElapsed = 0;
    };
    BlockEmptier.prototype.Update = function () {
        // todo: if the game hasn't started or has already endd, return immediately
        if (this.block.State == BlockState.WaitingToEmpty) {
            this.delayElapsed += this.phaserGame.time.elapsed;
            if (this.delayElapsed >= this.DelayDuration) {
                this.block.State = BlockState.Empty;
                this.block.Type = -1;
            }
        }
    };
    BlockEmptier.DelayInterval = 250;
    return BlockEmptier;
}());
var BlockMatcher = (function () {
    function BlockMatcher(block, phaserGame) {
        this.duration = 1000;
        this.block = block;
        this.phaserGame = phaserGame;
    }
    BlockMatcher.prototype.Match = function (matchedBlockCount, delayCounter) {
        this.block.State = BlockState.Matched;
        this.elapsed = 0;
        this.block.Clearer.DelayDuration = (matchedBlockCount - delayCounter) * BlockClearer.DelayInterval;
        this.block.Emptier.DelayDuration = delayCounter * BlockEmptier.DelayInterval;
    };
    BlockMatcher.prototype.Update = function () {
        // to do: return immediately if the game hasn't started or is over
        if (this.block.State == BlockState.Matched) {
            this.elapsed += this.phaserGame.time.elapsed;
            if (this.elapsed >= this.duration) {
                this.block.Clearer.Clear();
            }
        }
    };
    return BlockMatcher;
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
            case BlockState.Empty:
                this.block.Sprite.position.setTo(this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2 + this.block.X * BlockRenderer.Width, this.phaserGame.height / 2 - Board.Rows * BlockRenderer.Height / 2 + this.block.Y * BlockRenderer.Height);
                this.block.Sprite.scale.setTo(45, 45);
                this.block.Sprite.visible = false;
                break;
            case BlockState.Idle:
                this.block.Sprite.position.setTo(this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2 + this.block.X * BlockRenderer.Width, this.phaserGame.height / 2 - Board.Rows * BlockRenderer.Height / 2 + this.block.Y * BlockRenderer.Height);
                this.block.Sprite.visible = true;
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
            case BlockState.WaitingToFall:
                this.block.Sprite.position.setTo(this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2 + this.block.X * BlockRenderer.Width, this.phaserGame.height / 2 - Board.Rows * BlockRenderer.Height / 2 + this.block.Y * BlockRenderer.Height);
                this.block.Sprite.visible = true;
                this.block.Sprite.tint = this.colors[this.block.Type];
                break;
            case BlockState.Falling:
                // todo: implement this
                break;
            case BlockState.Matched:
                this.block.Sprite.position.setTo(this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2 + this.block.X * BlockRenderer.Width, this.phaserGame.height / 2 - Board.Rows * BlockRenderer.Height / 2 + this.block.Y * BlockRenderer.Height);
                this.block.Sprite.visible = true;
                this.block.Sprite.tint = 0xffffff;
                break;
            case BlockState.WaitingToClear:
                this.block.Sprite.position.setTo(this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2 + this.block.X * BlockRenderer.Width, this.phaserGame.height / 2 - Board.Rows * BlockRenderer.Height / 2 + this.block.Y * BlockRenderer.Height);
                this.block.Sprite.visible = true;
                this.block.Sprite.tint = this.colors[this.block.Type];
                break;
            case BlockState.Clearing:
                this.block.Sprite.position.setTo(this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2 + this.block.X * BlockRenderer.Width, this.phaserGame.height / 2 - Board.Rows * BlockRenderer.Height / 2 + this.block.Y * BlockRenderer.Height);
                this.block.Sprite.visible = true;
                this.block.Sprite.tint = this.colors[this.block.Type];
                var alpha = 1.0 - this.block.Clearer.Elapsed / BlockClearer.Duration;
                this.block.Sprite.alpha = alpha;
                var scale = 1.0 - this.block.Clearer.Elapsed / BlockClearer.Duration;
                this.block.Sprite.scale.setTo(scale * 45, scale * 45);
                break;
            case BlockState.WaitingToEmpty:
                this.block.Sprite.position.setTo(this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2 + this.block.X * BlockRenderer.Width, this.phaserGame.height / 2 - Board.Rows * BlockRenderer.Height / 2 + this.block.Y * BlockRenderer.Height);
                this.block.Sprite.scale.setTo(45, 45);
                this.block.Sprite.visible = false;
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
    function BlockSlider(block, phaserGame, matchDetector) {
        this.block = block;
        this.phaserGame = phaserGame;
        this.matchDetector = matchDetector;
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
                    this.matchDetector.RequestMatchDetection(this.block);
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
        this.MatchDetector = new MatchDetector(this);
        this.Blocks = [];
        for (var x = 0; x < Board.Columns; x++) {
            this.Blocks[x] = [];
            for (var y = 0; y < Board.Rows; y++) {
                this.Blocks[x][y] = new Block(this.phaserGame, this);
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
        this.MatchDetector.Update();
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
var MatchDetection = (function () {
    function MatchDetection(block) {
        this.Block = block;
    }
    return MatchDetection;
}());
var MatchDetector = (function () {
    function MatchDetector(board) {
        this.matchDetections = [];
        this.board = board;
    }
    MatchDetector.prototype.RequestMatchDetection = function (block) {
        this.matchDetections.push(new MatchDetection(block));
    };
    MatchDetector.prototype.Update = function () {
        while (this.matchDetections.length > 0) {
            var detection = this.matchDetections.shift();
            // ensure the block is still idle
            if (detection.Block.State == BlockState.Idle) {
                this.DetectMatch(detection.Block);
            }
        }
    };
    MatchDetector.prototype.DetectMatch = function (block) {
        // look in four directions for matching blocks
        var left = block.X;
        while (left > 0 && this.board.Blocks[left - 1][block.Y].State == BlockState.Idle && this.board.Blocks[left - 1][block.Y].Type == block.Type) {
            left--;
        }
        var right = block.X + 1;
        while (right < Board.Columns && this.board.Blocks[right][block.Y].State == BlockState.Idle && this.board.Blocks[right][block.Y].Type == block.Type) {
            right++;
        }
        var bottom = block.Y;
        while (bottom > 0 && this.board.Blocks[block.X][bottom - 1].State == BlockState.Idle && this.board.Blocks[block.X][bottom - 1].Type == block.Type) {
            bottom--;
        }
        var top = block.Y + 1; // exclude the top row since it's for new incoming blocks
        while (top < Board.Rows - 1 && this.board.Blocks[block.X][top].State == BlockState.Idle && this.board.Blocks[block.X][top].Type == block.Type) {
            top++;
        }
        var width = right - left;
        var height = top - bottom;
        var matchedBlockCount = 0;
        var horizontalMatch = false;
        var verticalMatch = false;
        if (width >= MatchDetector.MinimumMatchLength) {
            horizontalMatch = true;
            matchedBlockCount += width;
        }
        if (height >= MatchDetector.MinimumMatchLength) {
            verticalMatch = true;
            matchedBlockCount += height;
        }
        if (!horizontalMatch && !verticalMatch) {
            return;
        }
        // if pattern matches both directions then remove the common block from the count
        if (horizontalMatch && verticalMatch) {
            matchedBlockCount--;
        }
        var delayCounter = matchedBlockCount;
        // kill the pattern's blocks
        if (horizontalMatch) {
            for (var x = left; x < right; x++) {
                this.board.Blocks[x][block.Y].Matcher.Match(matchedBlockCount, delayCounter);
                delayCounter--;
            }
        }
        if (verticalMatch) {
            for (var y = top - 1; y >= bottom; y--) {
                this.board.Blocks[block.X][y].Matcher.Match(matchedBlockCount, delayCounter);
                delayCounter--;
            }
        }
    };
    MatchDetector.MinimumMatchLength = 3;
    return MatchDetector;
}());
