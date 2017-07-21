var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
    function Block(phaserGame, board, group, scoreboard) {
        this.phaserGame = phaserGame;
        this.Sprite = group.create(0, 0, BlockRenderer.Key);
        this.renderer = new BlockRenderer(this, this.phaserGame);
        this.Slider = new BlockSlider(this, this.phaserGame, board.MatchDetector);
        this.Matcher = new BlockMatcher(this, this.phaserGame);
        this.Clearer = new BlockClearer(this, this.phaserGame, scoreboard);
        this.Emptier = new BlockEmptier(this, this.phaserGame);
        this.Faller = new BlockFaller(this, this.phaserGame);
    }
    Block.prototype.Update = function () {
        this.renderer.Update();
        this.Slider.Update();
        this.Matcher.Update();
        this.Clearer.Update();
        this.Emptier.Update();
        this.Faller.Update();
    };
    Block.TypeCount = 6;
    return Block;
}());
var BlockClearer = (function () {
    function BlockClearer(block, phaserGame, scoreboard) {
        this.block = block;
        this.phaserGame = phaserGame;
        this.scoreboard = scoreboard;
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
                this.scoreboard.ScoreMatch();
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
var BlockFaller = (function () {
    function BlockFaller(block, phaserGame) {
        this.delayDuration = 100;
        this.block = block;
        this.phaserGame = phaserGame;
    }
    BlockFaller.prototype.Fall = function () {
        this.block.State = BlockState.WaitingToFall;
        this.delayElapsed = 0;
    };
    BlockFaller.prototype.ContinueFalling = function () {
        this.FinishWaitingToFall();
    };
    BlockFaller.prototype.FinishWaitingToFall = function () {
        this.block.State = BlockState.Falling;
        this.Elapsed = 0;
    };
    BlockFaller.prototype.Update = function () {
        // to do: if the game isn't on, return immediately
        if (this.block.State == BlockState.WaitingToFall) {
            this.delayElapsed += this.phaserGame.time.elapsed;
            if (this.delayElapsed >= this.delayDuration) {
                this.FinishWaitingToFall();
            }
        }
        if (this.block.State == BlockState.Falling) {
            this.Elapsed += this.phaserGame.time.elapsed;
            if (this.Elapsed >= BlockFaller.Duration) {
                this.Target.State = BlockState.Falling;
                this.Target.Type = this.block.Type;
                this.Target.Faller.JustFell = true;
                this.block.State = BlockState.Empty;
                this.block.Type = -1;
            }
        }
    };
    BlockFaller.Duration = 100;
    return BlockFaller;
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
    }
    BlockRenderer.prototype.Update = function () {
        var timePercentage = 0;
        switch (this.block.State) {
            case BlockState.Empty:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Width, this.block.Y * BlockRenderer.Height);
                this.block.Sprite.scale.setTo(1, 1);
                this.block.Sprite.visible = false;
                break;
            case BlockState.Idle:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Width, this.block.Y * BlockRenderer.Height);
                this.block.Sprite.scale.setTo(1, 1);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
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
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Width + destination * timePercentage, this.block.Y * BlockRenderer.Height);
                if (this.block.Type == -1) {
                    this.block.Sprite.visible = false;
                }
                else {
                    this.block.Sprite.visible = true;
                    this.block.Sprite.alpha = 1;
                    this.block.Sprite.tint = this.colors[this.block.Type];
                }
                break;
            case BlockState.WaitingToFall:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Width, this.block.Y * BlockRenderer.Height);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = this.colors[this.block.Type];
                break;
            case BlockState.Falling:
                timePercentage = this.block.Faller.Elapsed / BlockFaller.Duration;
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Width, this.block.Y * BlockRenderer.Height + BlockRenderer.Height * timePercentage);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = this.colors[this.block.Type];
                break;
            case BlockState.Matched:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Width, this.block.Y * BlockRenderer.Height);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = 0xffffff;
                break;
            case BlockState.WaitingToClear:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Width, this.block.Y * BlockRenderer.Height);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = this.colors[this.block.Type];
                break;
            case BlockState.Clearing:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Width + BlockRenderer.Width / 2, this.block.Y * BlockRenderer.Height + BlockRenderer.Height / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.tint = this.colors[this.block.Type];
                var alpha = 1.0 - this.block.Clearer.Elapsed / BlockClearer.Duration;
                this.block.Sprite.alpha = alpha;
                this.block.Sprite.anchor.setTo(0.5, 0.5);
                var scale = 1.0 - this.block.Clearer.Elapsed / BlockClearer.Duration;
                this.block.Sprite.scale.setTo(scale, scale);
                break;
            case BlockState.WaitingToEmpty:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Width, this.block.Y * BlockRenderer.Height);
                this.block.Sprite.anchor.setTo(0, 0);
                this.block.Sprite.scale.setTo(1, 1);
                this.block.Sprite.visible = false;
        }
    };
    BlockRenderer.Key = "block";
    BlockRenderer.Url = "assets/sprites/block.png";
    BlockRenderer.Width = 130;
    BlockRenderer.Height = 130;
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
    function Board(phaserGame, scoreboard) {
        this.phaserGame = phaserGame;
        this.MatchDetector = new MatchDetector(this);
        this.boardGroup = this.phaserGame.add.group();
        this.renderer = new BoardRenderer(this, this.phaserGame, this.boardGroup);
        /*this.Blocks = [];

        for(let x = 0; x < Board.Columns; x++) {
            this.Blocks[x] = [];

            for(let y = 0; y < Board.Rows; y++) {
                this.Blocks[x][y] = new Block(this.phaserGame, this, this.boardGroup, scoreboard);
                this.Blocks[x][y].X = x;
                this.Blocks[x][y].Y = y;

                let type = this.GetRandomBlockType(x, y);

                this.Blocks[x][y].Type = type;
                this.Blocks[x][y].State = BlockState.Idle;
            }
        }

        this.controller = new BoardController(this, this.phaserGame);

        this.boardGravity = new BoardGravity(this);*/
    }
    Board.prototype.GetRandomBlockType = function (x, y) {
        var type;
        do {
            type = this.phaserGame.rnd.integerInRange(0, Block.TypeCount - 1);
        } while ((x != 0 && this.Blocks[x - 1][y].Type == type) || (y != 0 && this.Blocks[x][y - 1].Type == type));
        return type;
    };
    Board.prototype.Update = function () {
        /*for(let x = 0; x < Board.Columns; x++) {
            for(let y = Board.Rows - 1; y >= 0; y--) {
                this.Blocks[x][y].Update();
            }
        }

        this.controller.Update();

        this.MatchDetector.Update();

        this.boardGravity.Update();*/
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
                (this.selectedBlock.Y - 1 == 0 || (this.selectedBlock.Y - 1 > 0 &&
                    this.board.Blocks[this.selectedBlock.X - 1][this.selectedBlock.Y - 1].State != BlockState.Falling &&
                    this.board.Blocks[this.selectedBlock.X - 1][this.selectedBlock.Y - 1].State != BlockState.WaitingToFall))) {
                leftBlock = this.board.Blocks[this.selectedBlock.X - 1][this.selectedBlock.Y];
                rightBlock = this.selectedBlock;
                this.selectedBlock = leftBlock;
            }
            if (pointerPosition.x > rightEdge &&
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
var BoardGravity = (function () {
    function BoardGravity(board) {
        this.board = board;
    }
    BoardGravity.prototype.Update = function () {
        // todo: if the game hasn't started or has ended, return early
        for (var x = 0; x < Board.Columns; x++) {
            var emptyBlockDetected = false;
            for (var y = Board.Rows - 1; y >= 0; y--) {
                if (this.board.Blocks[x][y].State == BlockState.Empty) {
                    emptyBlockDetected = true;
                }
                if (this.board.Blocks[x][y].State == BlockState.Idle && emptyBlockDetected) {
                    this.board.Blocks[x][y].Faller.Target = this.board.Blocks[x][y + 1];
                    this.board.Blocks[x][y].Faller.Fall();
                }
                if (this.board.Blocks[x][y].Faller.JustFell) {
                    if (y < Board.Rows - 1 && (this.board.Blocks[x][y + 1].State == BlockState.Empty || this.board.Blocks[x][y + 1].State == BlockState.Falling)) {
                        this.board.Blocks[x][y].Faller.Target = this.board.Blocks[x][y + 1];
                        this.board.Blocks[x][y].Faller.ContinueFalling();
                    }
                    else {
                        this.board.Blocks[x][y].State = BlockState.Idle;
                        this.board.MatchDetector.RequestMatchDetection(this.board.Blocks[x][y]);
                    }
                    this.board.Blocks[x][y].Faller.JustFell = false;
                }
            }
        }
        // add new blocks on the top of the board
        for (var x = 0; x < Board.Columns; x++) {
            if (this.board.Blocks[x][0].State == BlockState.Empty) {
                var type = this.board.GetRandomBlockType(x, 0);
                this.board.Blocks[x][0].Type = type;
                if (this.board.Blocks[x][1].State == BlockState.Idle) {
                    this.board.Blocks[x][0].State = BlockState.Idle;
                }
                if (this.board.Blocks[x][1].State == BlockState.Empty || this.board.Blocks[x][1].State == BlockState.Falling) {
                    this.board.Blocks[x][0].Faller.Target = this.board.Blocks[x][1];
                    this.board.Blocks[x][0].Faller.ContinueFalling(); // Should this just be Fall?
                }
            }
        }
    };
    return BoardGravity;
}());
var BoardRenderer = (function () {
    function BoardRenderer(board, phaserGame, group) {
        this.phaserGame = phaserGame;
        this.group = group;
        //console.log("World centerX=" + this.phaserGame.world.centerX)
        //this.position = new Phaser.Point(this.phaserGame.world.centerX - Board.Columns * BlockRenderer.Width / 2, this.phaserGame.world.centerY - (Board.Rows - 1) * BlockRenderer.Height / 2);
        this.position = new Phaser.Point(0 /*this.phaserGame.world.centerX - Board.Columns * BlockRenderer.Width / 2*/, 0);
        this.group.position = this.position;
        //let scale = this.phaserGame.height / (BlockRenderer.Height * 10) / window.devicePixelRatio;
        this.group.scale.setTo(this.phaserGame.width / (BlockRenderer.Width * Board.Columns) / window.devicePixelRatio, 10 / (BlockRenderer.Height * 10) / window.devicePixelRatio);
        this.background = this.phaserGame.add.graphics(0, 0);
        this.group.addChild(this.background);
        this.background.beginFill(0x333333);
        this.background.drawRect(0, 0, Board.Columns * BlockRenderer.Width, Board.Rows * BlockRenderer.Height);
        //this.mask = this.phaserGame.add.graphics(0, 0);
        //this.group.addChild(this.mask);
        //this.mask.beginFill(0xffffff);
        //this.mask.drawRect(-10, BlockRenderer.Height, Board.Columns * BlockRenderer.Width + 20, Board.Rows * BlockRenderer.Height - BlockRenderer.Height + 10);
        //this.group.mask = this.mask;
        this.phaserGame.scale.onSizeChange.add(this.OnSizeChange, this);
    }
    BoardRenderer.prototype.OnSizeChange = function () {
        console.log("Game width=" + this.phaserGame.width + ", Game height=" + this.phaserGame.height);
        var scale = this.phaserGame.height / (BlockRenderer.Height * 11);
        this.group.scale.setTo(scale, scale);
    };
    return BoardRenderer;
}());
var BootState = (function (_super) {
    __extends(BootState, _super);
    function BootState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BootState.prototype.preload = function () {
        this.load.image("PreloadBar", "assets/sprites/preloadbar.png");
    };
    BootState.prototype.create = function () {
        // Disable multi-touch
        this.input.maxPointers = 1;
        // Disable pausing when page loses focus
        this.stage.disableVisibilityChange = true;
        // Enable advanced timing to track fps
        this.game.time.advancedTiming = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        this.game.scale.onSizeChange.add(this.OnSizeChange, this);
        if (this.game.device.desktop) {
            // desktop specific settings
        }
        else {
            // mobile specific settings
        }
        this.game.state.start("Preload");
    };
    BootState.prototype.OnSizeChange = function () {
        this.game.width = window.innerWidth * window.devicePixelRatio;
        this.game.height = window.innerHeight * window.devicePixelRatio;
        console.log("GameWidth=" + this.game.width + ", GameHeight=" + this.game.height);
    };
    return BootState;
}(Phaser.State));
var ClockState;
(function (ClockState) {
    ClockState[ClockState["Gameplay"] = 0] = "Gameplay";
    ClockState[ClockState["Results"] = 1] = "Results";
    ClockState[ClockState["Leaderboard"] = 2] = "Leaderboard";
})(ClockState || (ClockState = {}));
var Clock = (function () {
    function Clock(phaserGame) {
        this.gameplayDuration = 10000;
        this.resultsDuration = 10000;
        this.leaderboardDuration = 10000;
        this.State = ClockState.Gameplay;
        this.TimeRemaining = 10000;
        this.phaserGame = phaserGame;
    }
    Clock.prototype.Update = function () {
        this.TimeRemaining -= this.phaserGame.time.elapsed;
        if (this.TimeRemaining <= 0) {
            switch (this.State) {
                case ClockState.Gameplay:
                    this.State = ClockState.Results;
                    this.TimeRemaining = this.resultsDuration;
                    break;
                case ClockState.Results:
                    this.State = ClockState.Leaderboard;
                    this.TimeRemaining = this.leaderboardDuration;
                    break;
                case ClockState.Leaderboard:
                    this.State = ClockState.Gameplay;
                    this.TimeRemaining = this.gameplayDuration;
                    break;
            }
        }
    };
    return Clock;
}());
var ClockRenderer = (function () {
    function ClockRenderer(clock, phaserGame) {
        this.clock = clock;
        var style = { font: "48px Arial", fill: "#ffffff", align: "right" };
        this.clockText = phaserGame.add.text(phaserGame.width - 10, 10, "Time: 10", style);
        this.clockText.anchor.setTo(1, 0);
    }
    ClockRenderer.prototype.Update = function () {
        this.clockText.text = "Time: " + (this.clock.TimeRemaining / 1000).toFixed(0);
    };
    return ClockRenderer;
}());
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super.call(this, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, 'game', null) || this;
        _this.state.add("Boot", BootState);
        _this.state.add("Preload", PreloadState);
        _this.state.add("Menu", MenuState);
        _this.state.add("Gameplay", GameplayState);
        _this.state.add("Results", ResultsState);
        _this.state.add("Leaderboard", LeaderboardState);
        _this.state.start("Boot");
        return _this;
    }
    return Game;
}(Phaser.Game));
window.onload = function () {
    var game = new Game();
};
var GameplayState = (function (_super) {
    __extends(GameplayState, _super);
    function GameplayState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameplayState.prototype.init = function (clock, scoreboard) {
        this.clock = clock;
        this.scoreboard = scoreboard;
    };
    GameplayState.prototype.create = function () {
        this.background = this.add.image(0, 0, "Background");
        this.background.scale.setTo(this.game.width / this.background.width, this.game.height / this.background.height);
        this.board = new Board(this.game, this.scoreboard);
        this.scoreboard.Reset();
        this.scoreboardRenderer = new ScoreboardRenderer(this.scoreboard, this.game);
        this.clockRenderer = new ClockRenderer(this.clock, this.game);
        this.backButton = this.add.button(10, 10, "BackButton", this.OnBackButtonClick, this);
        this.scale.onSizeChange.add(this.OnSizeChange, this);
    };
    GameplayState.prototype.OnSizeChange = function () {
        console.log("OnSizeChange: GameplayState");
        this.background.scale.setTo(this.game.width / this.background.width, this.game.height / this.background.height);
    };
    GameplayState.prototype.OnBackButtonClick = function () {
        this.game.state.start("Menu", true, false, this.clock, this.scoreboard);
    };
    GameplayState.prototype.update = function () {
        this.board.Update();
        this.clock.Update();
        switch (this.clock.State) {
            case ClockState.Results:
                this.game.state.start("Results", true, false, this.clock, this.scoreboard);
                break;
            case ClockState.Leaderboard:
                this.game.state.start("Leaderboard", true, false, this.clock, this.scoreboard);
                break;
            default:
                break;
        }
        this.scoreboardRenderer.Update();
        this.clockRenderer.Update();
    };
    return GameplayState;
}(Phaser.State));
var LeaderboardState = (function (_super) {
    __extends(LeaderboardState, _super);
    function LeaderboardState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LeaderboardState.prototype.init = function (clock, scoreboard) {
        this.scoreboard = scoreboard;
        this.clock = clock;
    };
    LeaderboardState.prototype.create = function () {
        this.background = this.add.image(0, 0, "Background");
        this.background.scale.setTo(this.game.width / this.background.width, this.game.height / this.background.height);
        var style = { font: "48px Arial", fill: "#ffffff" };
        this.leaderboardText = this.add.text(this.world.centerX, this.world.centerY, "Leaderboards coming soon!", style);
        this.leaderboardText.anchor.setTo(0.5, 0.5);
        this.clockRenderer = new ClockRenderer(this.clock, this.game);
        this.backButton = this.game.add.button(10, 10, "BackButton", this.OnBackButtonClick, this);
    };
    LeaderboardState.prototype.OnBackButtonClick = function () {
        this.game.state.start("Menu", true, false, this.clock, this.scoreboard);
    };
    LeaderboardState.prototype.update = function () {
        this.clock.Update();
        switch (this.clock.State) {
            case ClockState.Gameplay:
                this.game.state.start("Gameplay", true, false, this.clock, this.scoreboard);
                break;
            case ClockState.Results:
                this.game.state.start("Results", true, false, this.clock, this.scoreboard);
                break;
            default:
                break;
        }
        this.clockRenderer.Update();
    };
    return LeaderboardState;
}(Phaser.State));
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
        var top = block.Y; // exclude the top row since it's for new incoming blocks
        while (top > 1 && this.board.Blocks[block.X][top - 1].State == BlockState.Idle && this.board.Blocks[block.X][top - 1].Type == block.Type) {
            top--;
        }
        var bottom = block.Y + 1;
        while (bottom < Board.Rows && this.board.Blocks[block.X][bottom].State == BlockState.Idle && this.board.Blocks[block.X][bottom].Type == block.Type) {
            bottom++;
        }
        var width = right - left;
        var height = bottom - top;
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
            for (var y = top; y < bottom; y++) {
                this.board.Blocks[block.X][y].Matcher.Match(matchedBlockCount, delayCounter);
                delayCounter--;
            }
        }
    };
    MatchDetector.MinimumMatchLength = 3;
    return MatchDetector;
}());
var MenuState = (function (_super) {
    __extends(MenuState, _super);
    function MenuState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MenuState.prototype.init = function (clock, scoreboard) {
        if (clock != undefined) {
            this.clock = clock;
        }
        if (scoreboard != undefined) {
            this.scoreboard = scoreboard;
        }
    };
    MenuState.prototype.create = function () {
        this.background = this.add.image(0, 0, "Background");
        this.background.scale.setTo(this.game.width / this.background.width / window.devicePixelRatio, this.game.height / this.background.height / window.devicePixelRatio);
        this.background.alpha = 0;
        this.logo = this.add.image(0, -600, "Logo");
        //console.log("Logo: Game Width=" + this.game.width + ", Logo Width=" + this.logo.width);
        this.logo.scale.setTo(this.game.width / this.logo.width / window.devicePixelRatio, this.game.height / this.logo.height / window.devicePixelRatio);
        //let block = this.add.image(0, 0, "block");
        //block.scale.setTo(this.game.width / block.width / window.devicePixelRatio, this.game.height / block.height / window.devicePixelRatio);
        this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);
        this.add.tween(this.logo).to({ y: 0 }, 2000, Phaser.Easing.Elastic.Out, true, 2000);
        this.input.onDown.addOnce(this.FadeOut, this);
        if (this.clock == undefined) {
            this.clock = new Clock(this.game);
        }
        if (this.scoreboard == undefined) {
            this.scoreboard = new Scoreboard(this.game);
        }
        this.scale.onSizeChange.add(this.OnSizeChange, this);
    };
    MenuState.prototype.OnSizeChange = function () {
        this.logo.scale.setTo(this.game.width / this.logo.width / window.devicePixelRatio, this.game.height / this.logo.height / window.devicePixelRatio);
    };
    MenuState.prototype.FadeOut = function () {
        this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
        var tween = this.add.tween(this.logo).to({ y: this.game.height }, 2000, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.StartPlay, this);
    };
    MenuState.prototype.StartPlay = function () {
        switch (this.clock.State) {
            case ClockState.Gameplay:
                this.game.state.start("Gameplay", true, false, this.clock, this.scoreboard);
                break;
            case ClockState.Results:
                this.game.state.start("Results", true, false, this.clock, this.scoreboard);
                break;
            case ClockState.Leaderboard:
                this.game.state.start("Leaderboard", true, false, this.clock, this.scoreboard);
                break;
        }
    };
    MenuState.prototype.update = function () {
        this.clock.Update();
    };
    return MenuState;
}(Phaser.State));
var PreloadState = (function (_super) {
    __extends(PreloadState, _super);
    function PreloadState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PreloadState.prototype.preload = function () {
        // Setup the preload bar
        this.preloadBar = this.add.sprite(0, 0, "PreloadBar");
        this.preloadBar.anchor.setTo(0.5, 0.5);
        this.preloadBar.position.setTo(this.world.centerX, this.world.centerY);
        this.load.setPreloadSprite(this.preloadBar);
        // Load game assets
        this.load.image("Background", "assets/sprites/background.png");
        this.load.image("Logo", "assets/sprites/logo.png");
        this.load.image(BlockRenderer.Key, BlockRenderer.Url);
        this.load.image("BackButton", "assets/sprites/backbutton.png");
    };
    PreloadState.prototype.create = function () {
        var alphaTween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        alphaTween.onComplete.add(this.StartMenu, this);
    };
    PreloadState.prototype.StartMenu = function () {
        this.game.state.start("Menu");
    };
    return PreloadState;
}(Phaser.State));
var ResultsState = (function (_super) {
    __extends(ResultsState, _super);
    function ResultsState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResultsState.prototype.init = function (clock, scoreboard) {
        this.scoreboard = scoreboard;
        this.clock = clock;
    };
    ResultsState.prototype.create = function () {
        this.background = this.add.image(0, 0, "Background");
        this.background.scale.setTo(this.game.width / this.background.width, this.game.height / this.background.height);
        var style = { font: "48px Arial", fill: "#ffffff" };
        this.scoreText = this.add.text(this.world.centerX, this.world.centerY, "Score: " + this.scoreboard.Score, style);
        this.scoreText.anchor.setTo(0.5, 0.5);
        this.clockRenderer = new ClockRenderer(this.clock, this.game);
        this.backButton = this.add.button(10, 10, "BackButton", this.OnBackButtonClick, this);
    };
    ResultsState.prototype.OnBackButtonClick = function () {
        this.game.state.start("Menu", true, false, this.clock, this.scoreboard);
    };
    ResultsState.prototype.update = function () {
        this.clock.Update();
        switch (this.clock.State) {
            case ClockState.Leaderboard:
                this.game.state.start("Leaderboard", true, false, this.clock, this.scoreboard);
                break;
            case ClockState.Gameplay:
                this.game.state.start("Gameplay", true, false, this.clock, this.scoreboard);
                break;
            default:
                break;
        }
        this.clockRenderer.Update();
    };
    return ResultsState;
}(Phaser.State));
var Scoreboard = (function () {
    function Scoreboard(phaserGame) {
        this.matchValue = 10;
        this.Reset();
    }
    Scoreboard.prototype.Reset = function () {
        this.Score = 0;
    };
    Scoreboard.prototype.ScoreMatch = function () {
        this.Score += this.matchValue;
    };
    return Scoreboard;
}());
var ScoreboardRenderer = (function () {
    function ScoreboardRenderer(scoreboard, phaserGame) {
        this.scoreboard = scoreboard;
        var style = { font: "48px Arial", fill: "#ffffff" };
        this.scoreText = phaserGame.add.text(10, 150, "Score: 0", style);
    }
    ScoreboardRenderer.prototype.Update = function () {
        this.scoreText.text = "Score: " + this.scoreboard.Score;
    };
    return ScoreboardRenderer;
}());
