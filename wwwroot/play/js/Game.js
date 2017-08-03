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
    function Block(board, group, scoreboard) {
        this.Sprite = group.create(0, 0, "Block");
        this.renderer = new BlockRenderer(this);
        this.Slider = new BlockSlider(this, board.MatchDetector);
        this.Matcher = new BlockMatcher(this);
        this.Clearer = new BlockClearer(this, scoreboard);
        this.Emptier = new BlockEmptier(this);
        this.Faller = new BlockFaller(this);
    }
    Block.prototype.Update = function (elapsedGameTime) {
        this.renderer.Update();
        this.Slider.Update(elapsedGameTime);
        this.Matcher.Update(elapsedGameTime);
        this.Clearer.Update(elapsedGameTime);
        this.Emptier.Update(elapsedGameTime);
        this.Faller.Update(elapsedGameTime);
    };
    Block.TypeCount = 6;
    return Block;
}());
var BlockClearer = (function () {
    function BlockClearer(block, scoreboard) {
        this.block = block;
        this.scoreboard = scoreboard;
    }
    BlockClearer.prototype.Clear = function () {
        this.block.State = BlockState.WaitingToClear;
        this.delayElapsed = 0;
    };
    BlockClearer.prototype.Update = function (elapsedGameTime) {
        // if the game hasn't started or has finished, return immediately
        if (this.block.State == BlockState.WaitingToClear) {
            this.delayElapsed += elapsedGameTime;
            if (this.delayElapsed >= this.DelayDuration) {
                this.block.State = BlockState.Clearing;
                this.Elapsed = 0;
                this.scoreboard.ScoreMatch();
            }
        }
        if (this.block.State == BlockState.Clearing) {
            this.Elapsed += elapsedGameTime;
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
    function BlockEmptier(block) {
        this.block = block;
    }
    BlockEmptier.prototype.Empty = function () {
        this.block.State = BlockState.WaitingToEmpty;
        this.delayElapsed = 0;
    };
    BlockEmptier.prototype.Update = function (elapsedGameTime) {
        // todo: if the game hasn't started or has already endd, return immediately
        if (this.block.State == BlockState.WaitingToEmpty) {
            this.delayElapsed += elapsedGameTime;
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
    function BlockFaller(block) {
        this.delayDuration = 100;
        this.block = block;
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
    BlockFaller.prototype.Update = function (elapsedGameTime) {
        // to do: if the game isn't on, return immediately
        if (this.block.State == BlockState.WaitingToFall) {
            this.delayElapsed += elapsedGameTime;
            if (this.delayElapsed >= this.delayDuration) {
                this.FinishWaitingToFall();
            }
        }
        if (this.block.State == BlockState.Falling) {
            this.Elapsed += elapsedGameTime;
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
    function BlockMatcher(block) {
        this.duration = 1000;
        this.block = block;
    }
    BlockMatcher.prototype.Match = function (matchedBlockCount, delayCounter) {
        this.block.State = BlockState.Matched;
        this.elapsed = 0;
        this.block.Clearer.DelayDuration = (matchedBlockCount - delayCounter) * BlockClearer.DelayInterval;
        this.block.Emptier.DelayDuration = delayCounter * BlockEmptier.DelayInterval;
    };
    BlockMatcher.prototype.Update = function (elapsedGameTime) {
        // to do: return immediately if the game hasn't started or is over
        if (this.block.State == BlockState.Matched) {
            this.elapsed += elapsedGameTime;
            if (this.elapsed >= this.duration) {
                this.block.Clearer.Clear();
            }
        }
    };
    return BlockMatcher;
}());
var BlockRenderer = (function () {
    function BlockRenderer(block) {
        this.colors = [
            0xff0000,
            0x00ff00,
            0x0000ff,
            0xffff00,
            0xff00ff,
            0x00ffff
        ];
        this.block = block;
        this.block.Sprite.anchor.setTo(0.5);
    }
    BlockRenderer.prototype.Update = function () {
        var timePercentage = 0;
        switch (this.block.State) {
            case BlockState.Empty:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);
                //this.block.Sprite.scale.setTo(1, 1);
                this.block.Sprite.visible = false;
                break;
            case BlockState.Idle:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);
                //this.block.Sprite.scale.setTo(1, 1);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = this.colors[this.block.Type];
                break;
            case BlockState.Sliding:
                var destination = 0;
                if (this.block.Slider.Direction == SlideDirection.Left) {
                    destination = -BlockRenderer.Size;
                }
                if (this.block.Slider.Direction == SlideDirection.Right) {
                    destination = BlockRenderer.Size;
                }
                timePercentage = this.block.Slider.Elapsed / BlockSlider.Duration;
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2 + destination * timePercentage, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);
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
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = this.colors[this.block.Type];
                break;
            case BlockState.Falling:
                timePercentage = this.block.Faller.Elapsed / BlockFaller.Duration;
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2 + BlockRenderer.Size * timePercentage);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = this.colors[this.block.Type];
                break;
            case BlockState.Matched:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = 0xffffff;
                this.localScale = new Phaser.Point(this.block.Sprite.scale.x, this.block.Sprite.scale.y);
                break;
            case BlockState.WaitingToClear:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = this.colors[this.block.Type];
                break;
            case BlockState.Clearing:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.tint = this.colors[this.block.Type];
                var alpha = 1.0 - this.block.Clearer.Elapsed / BlockClearer.Duration;
                this.block.Sprite.alpha = alpha;
                var scale = 1.0 - this.block.Clearer.Elapsed / BlockClearer.Duration;
                this.block.Sprite.scale.setTo(scale * this.localScale.x, scale * this.localScale.y);
                break;
            case BlockState.WaitingToEmpty:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);
                this.block.Sprite.scale = this.localScale;
                this.block.Sprite.visible = false;
        }
    };
    BlockRenderer.Size = 0;
    return BlockRenderer;
}());
var SlideDirection;
(function (SlideDirection) {
    SlideDirection[SlideDirection["Left"] = 0] = "Left";
    SlideDirection[SlideDirection["Right"] = 1] = "Right";
    SlideDirection[SlideDirection["None"] = 2] = "None";
})(SlideDirection || (SlideDirection = {}));
var BlockSlider = (function () {
    function BlockSlider(block, matchDetector) {
        this.block = block;
        this.matchDetector = matchDetector;
    }
    BlockSlider.prototype.Slide = function (direction) {
        this.block.State = BlockState.Sliding;
        // Reset the sliding timer
        this.Elapsed = 0;
        this.Direction = direction;
    };
    BlockSlider.prototype.Update = function (elapsedGameTime) {
        if (this.block.State == BlockState.Sliding) {
            this.Elapsed += elapsedGameTime;
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
        this.Renderer = new BoardRenderer(this, this.phaserGame, this.boardGroup);
        this.Blocks = [];
        for (var x = 0; x < Board.Columns; x++) {
            this.Blocks[x] = [];
            for (var y = 0; y < Board.Rows; y++) {
                this.Blocks[x][y] = new Block(this, this.boardGroup, scoreboard);
                this.Blocks[x][y].X = x;
                this.Blocks[x][y].Y = y;
                var type = this.GetRandomBlockType(x, y);
                this.Blocks[x][y].Type = type;
                this.Blocks[x][y].State = BlockState.Idle;
            }
        }
        this.controller = new BoardController(this, this.phaserGame);
        this.boardGravity = new BoardGravity(this);
    }
    Board.prototype.GetRandomBlockType = function (x, y) {
        var type;
        do {
            type = this.phaserGame.rnd.integerInRange(0, Block.TypeCount - 1);
        } while ((x != 0 && this.Blocks[x - 1][y].Type == type) || (y != 0 && this.Blocks[x][y - 1].Type == type));
        return type;
    };
    Board.prototype.Update = function () {
        for (var x = 0; x < Board.Columns; x++) {
            for (var y = Board.Rows - 1; y >= 0; y--) {
                this.Blocks[x][y].Update(this.phaserGame.time.elapsed);
            }
        }
        this.controller.Update();
        this.MatchDetector.Update();
        this.boardGravity.Update();
    };
    Board.Columns = 8;
    Board.Rows = 8;
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
            var bounds = this.selectedBlock.Sprite.getBounds();
            var leftEdge = this.board.Renderer.Group.position.x + this.selectedBlock.X * BlockRenderer.Size;
            var rightEdge = this.board.Renderer.Group.position.x + this.selectedBlock.X * BlockRenderer.Size + BlockRenderer.Size;
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
        this.Group = group;
        //this.background = this.phaserGame.add.graphics(0, 0);
        //this.Group.addChild(this.background);
        //this.background.beginFill(0x333333);
        //this.background.drawRect(0, 0, Board.Columns * BlockRenderer.Width, Board.Rows * BlockRenderer.Height);
        //this.mask = this.phaserGame.add.graphics(0, 0);
        //this.group.addChild(this.mask);
        //this.mask.beginFill(0xffffff);
        //this.mask.drawRect(-10, BlockRenderer.Height, Board.Columns * BlockRenderer.Width + 20, Board.Rows * BlockRenderer.Height - BlockRenderer.Height + 10);
        //this.group.mask = this.mask;
    }
    return BoardRenderer;
}());
var BootState = (function (_super) {
    __extends(BootState, _super);
    function BootState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BootState.prototype.preload = function () {
        this.load.image("LoadingBar", "assets/sprites/loadingbar.png");
    };
    BootState.prototype.create = function () {
        // Disable multi-touch
        this.input.maxPointers = 1;
        // Disable pausing when page loses focus
        this.stage.disableVisibilityChange = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        this.game.state.start("Loading");
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
        this.gameplayDuration = 120000;
        this.resultsDuration = 15000;
        this.leaderboardDuration = 15000;
        this.State = ClockState.Gameplay;
        this.TimeRemaining = this.gameplayDuration;
        this.phaserGame = phaserGame;
        this.request = new XMLHttpRequest();
        this.request.onreadystatechange = this.OnServerClockReceived;
        this.request.open("GET", "/api/gameroom", true);
        this.request.send();
    }
    Clock.prototype.OnServerClockReceived = function (ev) {
        if (this.readyState == 4 && this.status == 200) {
            var state = JSON.parse(this.responseText).state;
            var time = JSON.parse(this.responseText).timeRemaining;
            Clock.ServerState = state;
            Clock.ServerTimeRemaining = time;
            Clock.CheckServerState = true;
        }
    };
    Clock.prototype.Update = function () {
        this.TimeRemaining -= this.phaserGame.time.elapsed;
        if (Clock.CheckServerState) {
            this.State = Clock.ServerState;
            this.TimeRemaining = Clock.ServerTimeRemaining;
            Clock.CheckServerState = false;
        }
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
    function ClockRenderer(clock, state) {
        this.clock = clock;
        var style = { font: "40px Arial", fill: "#ffffff" };
        this.ClockText = state.add.text(0, 0, "", style);
        this.ClockText.anchor.setTo(0.5);
    }
    ClockRenderer.prototype.Update = function () {
        this.ClockText.text = (this.clock.TimeRemaining / 1000).toFixed(0);
    };
    return ClockRenderer;
}());
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super.call(this, "100%", "100%", Phaser.AUTO, 'game', null) || this;
        _this.state.add("Boot", BootState);
        _this.state.add("Loading", LoadingState);
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
    GameplayState.prototype.init = function (clock, scoreboard, name) {
        if (clock != undefined) {
            this.clock = clock;
        }
        if (scoreboard != undefined) {
            this.scoreboard = scoreboard;
        }
        if (name != undefined) {
            this.name = name;
        }
    };
    GameplayState.prototype.create = function () {
        if (this.clock == undefined) {
            this.clock = new Clock(this.game);
        }
        if (this.scoreboard == undefined) {
            this.scoreboard = new Scoreboard(this.game);
        }
        if (this.name == undefined) {
            this.name = "Guest";
        }
        this.backgroundImage = this.add.image(0, 0, "Background");
        this.board = new Board(this.game, this.scoreboard);
        this.scoreboard.Reset();
        this.scoreLabel = this.add.image(0, 0, "ScoreLabel");
        this.scoreLabel.anchor.setTo(0.5);
        this.scoreboardRenderer = new ScoreboardRenderer(this.scoreboard, this);
        this.timeLabel = this.add.image(0, 0, "TimeLabel");
        this.timeLabel.anchor.setTo(0.5);
        this.clockRenderer = new ClockRenderer(this.clock, this);
        this.backButton = this.add.button(0, 0, "BackButton", this.OnBackButton_Click, this);
        this.resize();
    };
    GameplayState.prototype.OnBackButton_Click = function () {
        this.game.state.start("Menu", true, false, this.clock, this.scoreboard, this.name);
    };
    GameplayState.prototype.resize = function () {
        this.backgroundImage.width = this.game.width;
        this.backgroundImage.height = this.game.height;
        var isLandscape = this.game.height / this.game.width < 1.3 ? true : false;
        if (isLandscape) {
            var availableGridSpace = Math.min(this.game.width * 2 / 3, this.game.height);
            BlockRenderer.Size = (availableGridSpace * 0.9) / Board.Rows;
            this.horizontalMargin = this.game.width * 0.95 - Board.Columns * BlockRenderer.Size;
            this.verticalMargin = (this.game.height - Board.Rows * BlockRenderer.Size) / 2;
            this.board.Renderer.Group.x = this.horizontalMargin;
            this.board.Renderer.Group.y = this.verticalMargin;
            this.ScaleSprite(this.backButton, this.game.width / 10, this.game.height / 10, 0, 1, false);
            this.backButton.x = 0;
            this.backButton.y = 0;
            this.ScaleSprite(this.timeLabel, this.game.width / 3, this.game.height / 3, 0, 1, false);
            this.timeLabel.x = this.horizontalMargin / 2;
            this.timeLabel.y = this.world.centerY - this.game.height / 3;
            this.ScaleSprite(this.clockRenderer.ClockText, this.game.width / 3, this.game.height / 3, 50, 1, false);
            this.clockRenderer.ClockText.x = this.horizontalMargin / 2;
            this.clockRenderer.ClockText.y = this.world.centerY - this.game.height / 3 + this.timeLabel.height / 4;
            this.ScaleSprite(this.scoreLabel, this.game.width / 3, this.game.height / 3, 0, 1, false);
            this.scoreLabel.x = this.horizontalMargin / 2;
            this.scoreLabel.y = this.world.centerY;
            this.ScaleSprite(this.scoreboardRenderer.ScoreText, this.game.width / 3, this.game.height / 3, 50, 1, false);
            this.scoreboardRenderer.ScoreText.x = this.horizontalMargin / 2;
            this.scoreboardRenderer.ScoreText.y = this.world.centerY + this.scoreLabel.height / 4;
        }
        else {
            var availableGridSpace = this.game.width;
            BlockRenderer.Size = (availableGridSpace * 0.9) / Board.Columns;
            this.horizontalMargin = (this.game.width - Board.Columns * BlockRenderer.Size) / 2;
            this.verticalMargin = (this.game.height - Board.Rows * BlockRenderer.Size) / 2;
            this.board.Renderer.Group.x = this.horizontalMargin;
            this.board.Renderer.Group.y = this.verticalMargin;
            this.ScaleSprite(this.backButton, this.game.width / 10, this.game.height / 10, 0, 1, false);
            this.backButton.x = 0;
            this.backButton.y = 0;
            this.ScaleSprite(this.timeLabel, this.game.width / 3, this.verticalMargin, 0, 1, false);
            this.timeLabel.x = this.game.world.centerX - this.game.width / 3 + this.horizontalMargin;
            this.timeLabel.y = this.verticalMargin / 2;
            this.ScaleSprite(this.clockRenderer.ClockText, this.game.width / 3, this.verticalMargin, 0, 0.5, false);
            this.clockRenderer.ClockText.x = this.game.world.centerX - this.game.width / 3 + this.horizontalMargin;
            this.clockRenderer.ClockText.y = this.verticalMargin / 2 + this.timeLabel.height / 4;
            this.ScaleSprite(this.scoreLabel, this.game.width / 3, this.verticalMargin, 0, 1, false);
            this.scoreLabel.x = this.game.world.centerX + this.game.width / 3 - this.horizontalMargin;
            this.scoreLabel.y = this.verticalMargin / 2;
            this.ScaleSprite(this.scoreboardRenderer.ScoreText, this.game.width / 3, this.verticalMargin, 10, 0.5, false);
            this.scoreboardRenderer.ScoreText.x = this.game.world.centerX + this.game.width / 3 - this.horizontalMargin;
            this.scoreboardRenderer.ScoreText.y = this.verticalMargin / 2 + this.scoreLabel.height / 4;
        }
        for (var x = 0; x < Board.Columns; x++) {
            for (var y = 0; y < Board.Rows; y++) {
                this.ScaleSprite(this.board.Blocks[x][y].Sprite, BlockRenderer.Size, BlockRenderer.Size, 0, 1, true);
            }
        }
    };
    GameplayState.prototype.ScaleSprite = function (sprite, availableSpaceWidth, availableSpaceHeight, padding, scaleMultiplier, isFullScale) {
        var scale = this.GetSpriteScale(sprite.width, sprite.height, availableSpaceWidth, availableSpaceHeight, padding, isFullScale);
        sprite.scale.x = scale * scaleMultiplier;
        sprite.scale.y = scale * scaleMultiplier;
    };
    GameplayState.prototype.GetSpriteScale = function (spriteWidth, spriteHeight, availableSpaceWidth, availableSpaceHeight, minimumPadding, isFullScale) {
        var ratio = 1;
        var devicePixelRatio = window.devicePixelRatio;
        // Sprite needs to fit in either width or height
        var widthRatio = (spriteWidth * devicePixelRatio + 2 * minimumPadding) / availableSpaceWidth;
        var heightRatio = (spriteHeight * devicePixelRatio + 2 * minimumPadding) / availableSpaceHeight;
        if (widthRatio > 1 || heightRatio > 1 || isFullScale) {
            ratio = 1 / Math.max(widthRatio, heightRatio);
        }
        return ratio * devicePixelRatio;
    };
    GameplayState.prototype.update = function () {
        this.board.Update();
        this.clock.Update();
        switch (this.clock.State) {
            case ClockState.Results:
                this.game.state.start("Results", true, false, this.clock, this.scoreboard, this.name);
                break;
            case ClockState.Leaderboard:
                this.game.state.start("Leaderboard", true, false, this.clock, this.scoreboard, this.name);
                break;
            default:
                break;
        }
        this.scoreboardRenderer.Update();
        this.clockRenderer.Update();
    };
    return GameplayState;
}(Phaser.State));
var LeaderboardResult = (function () {
    function LeaderboardResult(name, score) {
        this.name = name;
        this.score = score;
    }
    return LeaderboardResult;
}());
var LeaderboardState = (function (_super) {
    __extends(LeaderboardState, _super);
    function LeaderboardState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LeaderboardState.prototype.init = function (clock, scoreboard, name) {
        if (clock != undefined) {
            this.clock = clock;
        }
        if (scoreboard != undefined) {
            this.scoreboard = scoreboard;
        }
        if (name != undefined) {
            MenuState.Name = name;
        }
    };
    LeaderboardState.prototype.create = function () {
        if (this.scoreboard == undefined) {
            this.scoreboard = new Scoreboard(this.game);
        }
        if (this.clock == undefined) {
            this.clock = new Clock(this.game);
        }
        if (this.name == undefined) {
            this.name = "Guest";
        }
        this.backgroundImage = this.add.image(0, 0, "Background");
        this.nextGameCountdownLabel = this.add.image(0, 0, "NextGameCountdownLabel");
        this.nextGameCountdownLabel.anchor.setTo(0.5);
        var rankStyle = { font: "20px Arial", fill: "#ffffff", align: "left" };
        this.rankText = this.add.text(0, 0, "Loading...", rankStyle);
        this.rankText.anchor.setTo(0, 0);
        var nameStyle = { font: "20px Arial", fill: "#ffffff", align: "center" };
        this.nameText = this.add.text(0, 0, "Loading...", nameStyle);
        this.nameText.anchor.setTo(0.5, 0);
        var scoreStyle = { font: "20px Arial", fill: "#ffffff", align: "right" };
        this.scoreText = this.add.text(0, 0, "Loading...", scoreStyle);
        this.scoreText.anchor.setTo(1, 0);
        this.clockRenderer = new ClockRenderer(this.clock, this);
        this.backButton = this.game.add.button(0, 0, "BackButton", this.OnBackButton_Click, this);
        this.leaderboardLabel = this.game.add.image(0, 0, "LeaderboardLabel");
        this.leaderboardLabel.anchor.setTo(0.5, 0);
        this.request = new XMLHttpRequest();
        this.request.onreadystatechange = this.OnServerLeaderboardReceived;
        this.request.open("GET", "/api/leaderboard", true);
        this.request.send();
        this.resize();
    };
    LeaderboardState.prototype.OnBackButton_Click = function () {
        this.game.state.start("Menu", true, false, this.clock, this.scoreboard, this.name);
    };
    LeaderboardState.prototype.OnServerLeaderboardReceived = function (ev) {
        if (this.readyState == 4 && this.status == 200) {
            console.log(JSON.parse(this.responseText));
            LeaderboardState.LeaderboardResults = JSON.parse(this.responseText);
        }
    };
    LeaderboardState.prototype.resize = function () {
        this.backgroundImage.width = this.game.width;
        this.backgroundImage.height = this.game.height;
        this.ScaleSprite(this.backButton, this.game.width / 10, this.game.height / 10, 0, 1);
        this.backButton.x = 0;
        this.backButton.y = 0;
        this.ScaleSprite(this.nextGameCountdownLabel, this.game.width / 3, this.game.height / 3, 0, 1);
        this.nextGameCountdownLabel.x = this.game.width - this.nextGameCountdownLabel.width / 2;
        this.nextGameCountdownLabel.y = this.nextGameCountdownLabel.height / 4;
        this.ScaleSprite(this.clockRenderer.ClockText, this.game.width / 3, this.game.height / 3, 50, 1);
        this.clockRenderer.ClockText.x = this.game.width - this.nextGameCountdownLabel.width / 2;
        this.clockRenderer.ClockText.y = this.nextGameCountdownLabel.height / 2;
        this.ScaleSprite(this.leaderboardLabel, this.game.width, this.game.height / 3, 0, 1);
        this.leaderboardLabel.x = this.world.centerX;
        this.leaderboardLabel.y = this.nextGameCountdownLabel.height;
        this.ScaleSprite(this.rankText, this.game.width / 3, this.game.height / 3, 0, 1);
        this.rankText.x = 0;
        this.rankText.y = this.nextGameCountdownLabel.height + this.leaderboardLabel.height;
        this.ScaleSprite(this.nameText, this.game.width / 3, this.game.height / 3, 0, 1);
        this.nameText.x = this.world.centerX;
        this.nameText.y = this.nextGameCountdownLabel.height + this.leaderboardLabel.height;
        this.ScaleSprite(this.scoreText, this.game.width / 3, this.game.height / 3, 0, 1);
        this.scoreText.x = this.game.width;
        this.scoreText.y = this.nextGameCountdownLabel.height + this.leaderboardLabel.height;
    };
    LeaderboardState.prototype.ScaleSprite = function (sprite, availableSpaceWidth, availableSpaceHeight, padding, scaleMultiplier) {
        var scale = this.GetSpriteScale(sprite.width, sprite.height, availableSpaceWidth, availableSpaceHeight, padding);
        sprite.scale.x = scale * scaleMultiplier;
        sprite.scale.y = scale * scaleMultiplier;
    };
    LeaderboardState.prototype.GetSpriteScale = function (spriteWidth, spriteHeight, availableSpaceWidth, availableSpaceHeight, minimumPadding) {
        var ratio = 1;
        var devicePixelRatio = window.devicePixelRatio;
        // sprite needs to fit in either width or height
        var widthRatio = (spriteWidth * devicePixelRatio + 2 * minimumPadding) / availableSpaceWidth;
        var heightRatio = (spriteHeight * devicePixelRatio + 2 * minimumPadding) / availableSpaceHeight;
        if (widthRatio > 1 || heightRatio > 1) {
            ratio = 1 / Math.max(widthRatio, heightRatio);
        }
        return ratio * devicePixelRatio;
    };
    LeaderboardState.prototype.update = function () {
        this.clock.Update();
        if (LeaderboardState.LeaderboardResults != undefined) {
            this.rankText.text = "";
            this.nameText.text = "";
            this.scoreText.text = "";
            for (var n = 0; n < LeaderboardState.LeaderboardResults.length; n++) {
                this.rankText.text += (n + 1).toString() + "\n";
                this.nameText.text += LeaderboardState.LeaderboardResults[n].name + "\n";
                this.scoreText.text += LeaderboardState.LeaderboardResults[n].score + "\n";
            }
        }
        switch (this.clock.State) {
            case ClockState.Gameplay:
                this.game.state.start("Gameplay", true, false, this.clock, this.scoreboard, this.name);
                break;
            case ClockState.Results:
                this.game.state.start("Results", true, false, this.clock, this.scoreboard, this.name);
                break;
            default:
                break;
        }
        this.clockRenderer.Update();
    };
    return LeaderboardState;
}(Phaser.State));
var LoadingState = (function (_super) {
    __extends(LoadingState, _super);
    function LoadingState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LoadingState.prototype.preload = function () {
        // Setup the Blok Prty logo
        this.logoText = this.add.text(0, 0, "Blok Prty LLC", { font: "40px Arial", fill: "#ffffff" });
        this.logoText.anchor.setTo(0.5);
        this.logoText.x = this.world.centerX;
        this.logoText.y = this.game.height / 3;
        // Set the "Presents" text
        this.presentsText = this.add.text(0, 0, "Presents...", { font: "20px Arial", fill: "#ffffff" });
        this.presentsText.anchor.setTo(0.5);
        this.presentsText.x = this.world.centerX;
        this.presentsText.y = this.game.height / 3 + this.logoText.height;
        // Setup the preload bar
        this.loadingBar = this.add.sprite(0, 0, "LoadingBar");
        this.loadingBar.anchor.setTo(0.5);
        this.loadingBar.position.setTo(this.world.centerX, this.world.centerY);
        this.load.setPreloadSprite(this.loadingBar);
        // Load game assets
        this.load.image("Background", "assets/sprites/background.png");
        this.load.image("Logo", "assets/sprites/logo.png?v=1");
        this.load.image("PlayButton", "assets/sprites/playbutton.png?v=1");
        this.load.image("LoginButton", "assets/sprites/loginbutton.png");
        this.load.image("UseResponseLogo", "assets/sprites/UseResponseLogo.png");
        this.load.image("Block", "assets/sprites/block.png");
        this.load.image("TimeLabel", "assets/sprites/timelabel.png");
        this.load.image("ScoreLabel", "assets/sprites/scorelabel.png");
        this.load.image("BackButton", "assets/sprites/backbutton.png?v=2");
        this.load.image("NextGameCountdownLabel", "assets/sprites/nextgamecountdownlabel.png");
        this.load.image("TotalScoreLabel", "assets/sprites/totalscorelabel.png");
        this.load.image("LeaderboardLabel", "assets/sprites/leaderboardlabel.png");
    };
    LoadingState.prototype.create = function () {
        var alphaTween = this.add.tween(this.loadingBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        alphaTween.onComplete.add(this.StartMenu, this);
    };
    LoadingState.prototype.StartMenu = function () {
        this.game.state.start("Menu");
    };
    return LoadingState;
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
    MenuState.prototype.init = function (clock, scoreboard, name) {
        if (clock != undefined) {
            this.clock = clock;
        }
        if (scoreboard != undefined) {
            this.scoreboard = scoreboard;
        }
        if (name != undefined) {
            MenuState.Name = name;
        }
    };
    MenuState.prototype.create = function () {
        if (this.clock == undefined) {
            this.clock = new Clock(this.game);
        }
        if (this.scoreboard == undefined) {
            this.scoreboard = new Scoreboard(this.game);
        }
        if (MenuState.Name == "" || MenuState.Name == undefined) {
            MenuState.Name = "Guest";
        }
        this.backgroundImage = this.add.image(0, 0, "Background");
        this.logoImage = this.add.image(0, 0, "Logo");
        this.logoImage.anchor.setTo(0.5);
        this.playButton = this.add.button(0, 0, "PlayButton", this.OnPlayButton_Click, this);
        this.playButton.anchor.setTo(0.5);
        this.loginButton = this.add.button(0, 0, "LoginButton", this.OnLoginButton_Click, this);
        this.loginButton.anchor.setTo(0.5);
        var nameStyle = { font: "30px Arial", fill: "#ffffff", align: "center" };
        this.nameText = this.add.text(0, 0, "", nameStyle);
        this.nameText.anchor.setTo(0.5);
        this.nameText.visible = false;
        this.feedbackButton = this.add.button(0, 0, "UseResponseLogo", this.OnFeedbackButton_Click, this);
        this.feedbackButton.anchor.setTo(0, 1);
        var feedbackStyle = { font: "20px Arial", fill: "#ffffff" };
        this.feedbackLabel = this.add.text(0, 0, "Feedback", feedbackStyle);
        this.feedbackLabel.anchor.setTo(0, 1);
        this.resize();
        MenuState.LoggedIn = false;
        FB.getLoginStatus(function (statusResponse) {
            if (statusResponse.status == "connected") {
                FB.api("/me", { fields: "first_name,last_name" }, function (apiResponse) {
                    var s = apiResponse.last_name;
                    var lastInitial = s.charAt(0);
                    MenuState.Name = apiResponse.first_name + " " + lastInitial + ".";
                });
                MenuState.LoggedIn = true;
            }
        });
    };
    MenuState.prototype.OnPlayButton_Click = function () {
        switch (this.clock.State) {
            case ClockState.Gameplay:
                this.game.state.start("Gameplay", true, false, this.clock, this.scoreboard, MenuState.Name);
                break;
            case ClockState.Results:
                this.game.state.start("Results", true, false, this.clock, this.scoreboard, MenuState.Name);
                break;
            case ClockState.Leaderboard:
                this.game.state.start("Leaderboard", true, false, this.clock, this.scoreboard, MenuState.Name);
                break;
        }
    };
    MenuState.prototype.OnLoginButton_Click = function () {
        FB.getLoginStatus(function (response) {
            if (response.status != "connected") {
                FB.login(function (loginResponse) {
                });
            }
            FB.api("/me", { fields: "first_name,last_name" }, function (apiResponse) {
                var s = apiResponse.last_name;
                var lastInitial = s.charAt(0);
                MenuState.Name = apiResponse.first_name + " " + lastInitial + ".";
            });
            MenuState.LoggedIn = true;
        });
    };
    MenuState.prototype.OnFeedbackButton_Click = function () {
        window.open("https://blokprty.useresponse.com/");
    };
    MenuState.prototype.resize = function () {
        this.backgroundImage.width = this.game.width;
        this.backgroundImage.height = this.game.height;
        this.logoImage.width = this.game.width * 0.9;
        this.logoImage.height = this.game.height / 3 * 0.9;
        this.logoImage.x = this.world.centerX;
        this.logoImage.y = this.world.centerY - this.game.height / 3;
        this.playButton.width = this.game.width * 0.5;
        this.playButton.height = this.game.height / 3 * 0.9;
        this.playButton.x = this.world.centerX;
        this.playButton.y = this.world.centerY;
        this.loginButton.width = this.game.width * 0.5;
        this.loginButton.height = this.game.height / 3 * 0.45;
        this.loginButton.x = this.world.centerX;
        this.loginButton.y = this.world.centerY + this.game.height / 3;
        this.nameText.x = this.world.centerX;
        this.nameText.y = this.world.centerY + this.game.height / 3;
        this.feedbackLabel.width = this.game.width / 20;
        this.feedbackLabel.height = this.game.width / 40;
        this.feedbackLabel.x = this.game.width / 20;
        this.feedbackLabel.y = this.game.height;
        this.feedbackButton.width = this.game.width / 20;
        this.feedbackButton.height = this.game.width / 20;
        this.feedbackButton.x = this.game.width / 20;
        this.feedbackButton.y = this.game.height - this.feedbackLabel.height;
    };
    MenuState.prototype.update = function () {
        this.clock.Update();
        if (MenuState.LoggedIn) {
            this.loginButton.visible = false;
            this.nameText.text = "Hello, " + MenuState.Name;
            this.nameText.addColor("#ff5817", 7);
            this.nameText.visible = true;
        }
    };
    return MenuState;
}(Phaser.State));
var ResultsState = (function (_super) {
    __extends(ResultsState, _super);
    function ResultsState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResultsState.prototype.init = function (clock, scoreboard, name) {
        if (clock != undefined) {
            this.clock = clock;
        }
        if (scoreboard != undefined) {
            this.scoreboard = scoreboard;
        }
        if (name != undefined) {
            this.name = name;
        }
    };
    ResultsState.prototype.create = function () {
        if (this.scoreboard == undefined) {
            this.scoreboard = new Scoreboard(this.game);
        }
        if (this.clock == undefined) {
            this.clock = new Clock(this.game);
        }
        if (this.name == undefined) {
            this.name = "Guest";
        }
        this.backgroundImage = this.add.image(0, 0, "Background");
        this.totalScoreLabel = this.add.image(0, 0, "TotalScoreLabel");
        this.totalScoreLabel.anchor.setTo(0.5);
        var style = { font: "48px Arial", fill: "#ffffff" };
        this.scoreText = this.add.text(0, 0, this.scoreboard.Score.toString(), style);
        this.scoreText.anchor.setTo(0.5, 0.5);
        this.nextGameCountdownLabel = this.add.image(0, 0, "NextGameCountdownLabel");
        this.nextGameCountdownLabel.anchor.setTo(0.5);
        this.clockRenderer = new ClockRenderer(this.clock, this);
        this.backButton = this.add.button(0, 0, "BackButton", this.OnBackButton_Click, this);
        this.request = new XMLHttpRequest();
        this.request.open("POST", "/api/gameresults", true);
        this.request.setRequestHeader("Content-type", "application/json");
        this.request.send(JSON.stringify({ name: this.name, score: this.scoreboard.Score }));
        this.resize();
    };
    ResultsState.prototype.OnBackButton_Click = function () {
        this.game.state.start("Menu", true, false, this.clock, this.scoreboard, this.name);
    };
    ResultsState.prototype.ScaleSprite = function (sprite, availableSpaceWidth, availableSpaceHeight, padding, scaleMultiplier) {
        var scale = this.GetSpriteScale(sprite.width, sprite.height, availableSpaceWidth, availableSpaceHeight, padding);
        sprite.scale.x = scale * scaleMultiplier;
        sprite.scale.y = scale * scaleMultiplier;
    };
    ResultsState.prototype.GetSpriteScale = function (spriteWidth, spriteHeight, availableSpaceWidth, availableSpaceHeight, minimumPadding) {
        var ratio = 1;
        var devicePixelRatio = window.devicePixelRatio;
        // sprite needs to fit in either width or height
        var widthRatio = (spriteWidth * devicePixelRatio + 2 * minimumPadding) / availableSpaceWidth;
        var heightRatio = (spriteHeight * devicePixelRatio + 2 * minimumPadding) / availableSpaceHeight;
        if (widthRatio > 1 || heightRatio > 1) {
            ratio = 1 / Math.max(widthRatio, heightRatio);
        }
        return ratio * devicePixelRatio;
    };
    ResultsState.prototype.resize = function () {
        this.backgroundImage.width = this.game.width;
        this.backgroundImage.height = this.game.height;
        this.ScaleSprite(this.backButton, this.game.width / 10, this.game.height / 10, 0, 1);
        this.backButton.x = 0;
        this.backButton.y = 0;
        this.ScaleSprite(this.nextGameCountdownLabel, this.game.width / 3, this.game.height / 3, 0, 1);
        this.nextGameCountdownLabel.x = this.game.width - this.nextGameCountdownLabel.width / 2;
        this.nextGameCountdownLabel.y = this.nextGameCountdownLabel.height / 4;
        this.ScaleSprite(this.clockRenderer.ClockText, this.game.width / 3, this.game.height / 3, 0, 1);
        this.clockRenderer.ClockText.x = this.game.width - this.nextGameCountdownLabel.width / 2;
        this.clockRenderer.ClockText.y = this.nextGameCountdownLabel.height / 2;
        // position the score
        this.ScaleSprite(this.totalScoreLabel, this.game.width / 2, this.game.height / 3, 0, 1);
        this.totalScoreLabel.x = this.world.centerX;
        this.totalScoreLabel.y = this.world.centerY;
        this.ScaleSprite(this.scoreText, this.game.width / 2, this.game.height / 3, 0, 1);
        this.scoreText.x = this.world.centerX;
        this.scoreText.y = this.world.centerY + this.totalScoreLabel.height / 4;
    };
    ResultsState.prototype.update = function () {
        this.clock.Update();
        switch (this.clock.State) {
            case ClockState.Leaderboard:
                this.game.state.start("Leaderboard", true, false, this.clock, this.scoreboard, this.name);
                break;
            case ClockState.Gameplay:
                this.game.state.start("Gameplay", true, false, this.clock, this.scoreboard, this.name);
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
    function ScoreboardRenderer(scoreboard, state) {
        this.scoreboard = scoreboard;
        var style = { font: "40px Arial", fill: "#ffffff" };
        this.ScoreText = state.add.text(0, 0, "", style);
        this.ScoreText.anchor.setTo(0.5);
    }
    ScoreboardRenderer.prototype.Update = function () {
        this.ScoreText.text = this.scoreboard.Score.toString();
    };
    return ScoreboardRenderer;
}());
