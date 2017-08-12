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
    function Block(board, group, scoreboard, signManager) {
        this.Sprite = group.create(0, 0, "Block");
        this.renderer = new BlockRenderer(this);
        this.Slider = new BlockSlider(this, board.MatchDetector);
        this.Matcher = new BlockMatcher(this);
        this.Clearer = new BlockClearer(this, scoreboard, signManager);
        this.Emptier = new BlockEmptier(this);
        this.Faller = new BlockFaller(this);
        this.Chainer = new BlockChainer();
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
var BlockChainer = (function () {
    function BlockChainer() {
    }
    return BlockChainer;
}());
var BlockClearer = (function () {
    function BlockClearer(block, scoreboard, signManager) {
        this.block = block;
        this.scoreboard = scoreboard;
        this.signManager = signManager;
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
                this.signManager.CreateSign(this.block.X, this.block.Y, Scoreboard.MatchValue.toString(), BlockRenderer.Colors[this.block.Type]);
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
                this.block.Chainer.JustEmptied = true;
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
        this.Elapsed = 0;
        this.block.Clearer.DelayDuration = (matchedBlockCount - delayCounter) * BlockClearer.DelayInterval;
        this.block.Emptier.DelayDuration = delayCounter * BlockEmptier.DelayInterval;
    };
    BlockMatcher.prototype.Update = function (elapsedGameTime) {
        // to do: return immediately if the game hasn't started or is over
        if (this.block.State == BlockState.Matched) {
            this.Elapsed += elapsedGameTime;
            if (this.Elapsed >= this.duration) {
                this.block.Clearer.Clear();
            }
        }
    };
    return BlockMatcher;
}());
var BlockRenderer = (function () {
    function BlockRenderer(block) {
        this.block = block;
        this.block.Sprite.anchor.setTo(0.5);
        if (BlockRenderer.StarEmitter == undefined) {
            BlockRenderer.StarEmitter = this.block.Sprite.game.add.emitter(-100, -100, 10 * Board.Columns * Board.Rows);
            BlockRenderer.StarEmitter.makeParticles("StarParticle");
            BlockRenderer.StarEmitter.gravity = 10;
            BlockRenderer.StarEmitter.minParticleScale = BlockRenderer.StarEmitter.maxParticleScale = 0.25;
            BlockRenderer.StarEmitter.setAlpha(1, 0, 3000);
            BlockRenderer.StarEmitter.setScale(0.25, 0, 0.25, 0, 3000);
            BlockRenderer.StarEmitter.setXSpeed(-200, 200);
            BlockRenderer.StarEmitter.setYSpeed(-200, 200);
        }
        if (BlockRenderer.CircleEmitter == undefined) {
            BlockRenderer.CircleEmitter = this.block.Sprite.game.add.emitter(0, 0, Board.Columns * Board.Rows);
            BlockRenderer.CircleEmitter.makeParticles("CircleParticle");
            BlockRenderer.CircleEmitter.gravity = 0;
            BlockRenderer.CircleEmitter.minParticleScale = BlockRenderer.StarEmitter.maxParticleScale = 0.5;
            BlockRenderer.CircleEmitter.setAlpha(1, 0, 3000);
            BlockRenderer.CircleEmitter.setScale(0, 1, 0, 1, 3000);
            BlockRenderer.CircleEmitter.setXSpeed(0, 0);
            BlockRenderer.CircleEmitter.setYSpeed(0, 0);
        }
    }
    BlockRenderer.prototype.Update = function () {
        var timePercentage = 0;
        switch (this.block.State) {
            case BlockState.Empty:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);
                this.block.Sprite.visible = false;
                break;
            case BlockState.Idle:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = BlockRenderer.Colors[this.block.Type];
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
                    this.block.Sprite.tint = BlockRenderer.Colors[this.block.Type];
                }
                break;
            case BlockState.WaitingToFall:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = BlockRenderer.Colors[this.block.Type];
                break;
            case BlockState.Falling:
                timePercentage = this.block.Faller.Elapsed / BlockFaller.Duration;
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2 + BlockRenderer.Size * timePercentage);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = BlockRenderer.Colors[this.block.Type];
                break;
            case BlockState.Matched:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = this.block.Matcher.Elapsed % 20 < 10 ? 0xffffff : BlockRenderer.Colors[this.block.Type];
                this.localScale = new Phaser.Point(this.block.Sprite.scale.x, this.block.Sprite.scale.y);
                break;
            case BlockState.WaitingToClear:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = BlockRenderer.Colors[this.block.Type];
                break;
            case BlockState.Clearing:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.tint = BlockRenderer.Colors[this.block.Type];
                var alpha = 1.0 - this.block.Clearer.Elapsed / BlockClearer.Duration;
                this.block.Sprite.alpha = alpha;
                var scale = 1.0 - this.block.Clearer.Elapsed / BlockClearer.Duration;
                this.block.Sprite.scale.setTo(scale * this.localScale.x, scale * this.localScale.y);
                if (this.block.Clearer.Elapsed < BlockClearer.Duration * 0.1) {
                    BlockRenderer.StarEmitter.x = this.block.Sprite.worldPosition.x;
                    BlockRenderer.StarEmitter.y = this.block.Sprite.worldPosition.y;
                    BlockRenderer.StarEmitter.start(true, 3000, null, 10);
                    BlockRenderer.CircleEmitter.x = this.block.Sprite.worldPosition.x;
                    BlockRenderer.CircleEmitter.y = this.block.Sprite.worldPosition.y;
                    BlockRenderer.CircleEmitter.start(true, 2000, null, 1);
                }
                break;
            case BlockState.WaitingToEmpty:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);
                this.block.Sprite.scale = this.localScale;
                this.block.Sprite.visible = false;
        }
    };
    BlockRenderer.Size = 0;
    BlockRenderer.Colors = [
        0xff0000,
        0x00ff00,
        0x0000ff,
        0xffff00,
        0xff00ff,
        0x00ffff
    ];
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
        this.boardGroup = this.phaserGame.add.group();
        this.Renderer = new BoardRenderer(this, this.phaserGame, this.boardGroup);
        this.signManager = new SignManager(phaserGame, this.boardGroup);
        this.chainDetector = new ChainDetector(this, scoreboard);
        this.MatchDetector = new MatchDetector(this, scoreboard, this.signManager, this.chainDetector);
        this.Blocks = [];
        for (var x = 0; x < Board.Columns; x++) {
            this.Blocks[x] = [];
            for (var y = 0; y < Board.Rows; y++) {
                this.Blocks[x][y] = new Block(this, this.boardGroup, scoreboard, this.signManager);
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
        this.chainDetector.Update();
        this.boardGravity.Update();
        this.signManager.Update(this.phaserGame.time.elapsed);
    };
    Board.Columns = 8;
    Board.Rows = 9;
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
        this.background = this.phaserGame.add.graphics(0, 0);
        this.Group.addChild(this.background);
        this.mask = this.phaserGame.add.graphics(0, 0);
        this.Group.addChild(this.mask);
        this.Resize();
    }
    BoardRenderer.prototype.Resize = function () {
        this.background.beginFill(0x3c3c3c);
        this.background.drawRect(0, BlockRenderer.Size, Board.Columns * BlockRenderer.Size, (Board.Rows - 1) * BlockRenderer.Size);
        this.mask.beginFill(0xffffff);
        this.mask.drawRect(0, BlockRenderer.Size, Board.Columns * BlockRenderer.Size, (Board.Rows - 1) * BlockRenderer.Size);
        this.Group.mask = this.mask;
    };
    return BoardRenderer;
}());
var BootState = (function (_super) {
    __extends(BootState, _super);
    function BootState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BootState.prototype.preload = function () {
        this.load.image("BlokPrtyLLCLogo", "assets/sprites/blokprtyllclogo.jpeg");
        this.load.image("LoadingBar", "assets/sprites/loadingbar.png");
    };
    BootState.prototype.create = function () {
        // Disable multi-touch
        this.input.maxPointers = 1;
        // Disable pausing when page loses focus
        this.stage.disableVisibilityChange = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.state.start("Loading");
    };
    return BootState;
}(Phaser.State));
var ChainDetector = (function () {
    function ChainDetector(board, scoreboard) {
        this.board = board;
        this.scoreboard = scoreboard;
    }
    ChainDetector.prototype.IncrementChain = function () {
        this.ChainLength++;
        this.scoreboard.ScoreChain(this.ChainLength);
    };
    ChainDetector.prototype.Update = function () {
        var stopChain = true;
        // detect blocks that are eligible to participate in chains
        for (var x = 0; x < Board.Columns; x++) {
            for (var y = Board.Rows - 1; y >= 0; y--) {
                if (this.board.Blocks[x][y].Chainer.JustEmptied) {
                    for (var chainEligibleRow = y - 1; chainEligibleRow >= 0; chainEligibleRow--) {
                        if (this.board.Blocks[x][chainEligibleRow].State == BlockState.Idle) {
                            this.board.Blocks[x][chainEligibleRow].Chainer.ChainEligible = true;
                            stopChain = false;
                        }
                    }
                }
                this.board.Blocks[x][y].Chainer.JustEmptied = false;
            }
        }
        // stop the current chain if all of the blocks are idle or empty
        for (var x = 0; x < Board.Columns; x++) {
            for (var y = 0; y < Board.Rows; y++) {
                var state = this.board.Blocks[x][y].State;
                if (state != BlockState.Idle &&
                    state != BlockState.Empty &&
                    state != BlockState.Sliding) {
                    stopChain = false;
                }
            }
        }
        if (stopChain) {
            for (var x = 0; x < Board.Columns; x++) {
                for (var y = 0; y < Board.Rows; y++) {
                    this.board.Blocks[x][y].Chainer.ChainEligible = false;
                }
            }
            if (this.ChainLength > 1) {
                // TODO: Play fanfare
            }
            this.ChainLength = 1;
        }
    };
    return ChainDetector;
}());
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
        this.stage.backgroundColor = 0x222222;
        //this.backgroundImage = this.add.image(0, 0, "Background");
        this.board = new Board(this.game, this.scoreboard);
        this.scoreboard.Reset();
        this.scoreText = this.add.text(0, 0, "0", { font: "70px Arial", fill: "#ffffff", align: "center" });
        this.scoreText.anchor.setTo(0.5, 0);
        this.clockText = this.add.text(0, 0, "120", { font: "40px Arial", fill: "#ffffff", align: "right" });
        this.clockText.anchor.setTo(1, 0);
        this.backButton = this.add.button(0, 0, "BackButton", this.OnBackButton_Click, this);
        this.resize();
    };
    GameplayState.prototype.OnBackButton_Click = function () {
        ga('send', 'event', 'Gameplay', 'Quit Game');
        this.game.state.start("Menu", true, false, this.clock, this.scoreboard, this.name);
    };
    GameplayState.prototype.resize = function () {
        //this.backgroundImage.width = this.game.width;
        //this.backgroundImage.height = this.game.height;
        var shortDimension = Math.min(this.game.width, this.game.height);
        BlockRenderer.Size = shortDimension * 0.8 / (Board.Rows - 1);
        this.board.Renderer.Group.x = this.world.centerX - BlockRenderer.Size * Board.Columns / 2;
        this.board.Renderer.Group.y = this.world.centerY - BlockRenderer.Size * Board.Rows / 2;
        this.board.Renderer.Resize();
        for (var x = 0; x < Board.Columns; x++) {
            for (var y = 0; y < Board.Rows; y++) {
                this.board.Blocks[x][y].Sprite.width = BlockRenderer.Size;
                this.board.Blocks[x][y].Sprite.height = BlockRenderer.Size;
            }
        }
        this.backButton.width = 40;
        this.backButton.height = 50;
        this.backButton.x = 10;
        this.backButton.y = 10;
        this.scoreText.fontSize = shortDimension * 0.1;
        this.scoreText.x = this.world.centerX;
        this.scoreText.y = 0;
        this.clockText.x = this.game.width - 10;
        this.clockText.y = 10;
    };
    GameplayState.prototype.update = function () {
        this.board.Update();
        this.clock.Update();
        switch (this.clock.State) {
            case ClockState.Results:
                ga('send', 'event', 'Gameplay', 'Finished Game');
                this.game.state.start("Results", true, false, this.clock, this.scoreboard, this.name);
                break;
            case ClockState.Leaderboard:
                this.game.state.start("Leaderboard", true, false, this.clock, this.scoreboard, this.name);
                break;
            default:
                break;
        }
        this.scoreText.text = this.scoreboard.Score.toLocaleString();
        this.clockText.text = (this.clock.TimeRemaining / 1000).toFixed(0);
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
        this.clockText = this.add.text(0, 0, "15", { font: "40px Arial", fill: "#ffffff", align: "right" });
        this.clockText.anchor.setTo(1, 0);
        this.rankLabel = this.add.text(0, 0, "Rank", { font: "bold 20px Arial", fill: "#ffffff", align: "left" });
        this.rankLabel.anchor.setTo(0, 0);
        var rankStyle = { font: "20px Arial", fill: "#ffffff", align: "right" };
        this.rankText = this.add.text(0, 0, "Loading...", rankStyle);
        this.rankText.anchor.setTo(1, 0);
        this.nameLabel = this.add.text(0, 0, "Name", { font: "bold 20px Arial", fill: "#ffffff", align: "left" });
        this.nameLabel.anchor.setTo(0, 0);
        var nameStyle = { font: "20px Arial", fill: "#ffffff", align: "left" };
        this.nameText = this.add.text(0, 0, "Loading...", nameStyle);
        this.nameText.anchor.setTo(0, 0);
        this.scoreLabel = this.add.text(0, 0, "Score", { font: "bold 20px Arial", fill: "#ffffff", align: "right" });
        this.scoreLabel.anchor.setTo(1, 0);
        var scoreStyle = { font: "20px Arial", fill: "#ffffff", align: "right" };
        this.scoreText = this.add.text(0, 0, "Loading...", scoreStyle);
        this.scoreText.anchor.setTo(1, 0);
        this.backButton = this.game.add.button(0, 0, "BackButton", this.OnBackButton_Click, this);
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
            LeaderboardState.LeaderboardResults = JSON.parse(this.responseText);
        }
    };
    LeaderboardState.prototype.resize = function () {
        this.backgroundImage.width = this.game.width;
        this.backgroundImage.height = this.game.height;
        this.backButton.width = 40;
        this.backButton.height = 50;
        this.backButton.x = 10;
        this.backButton.y = 10;
        this.clockText.x = this.game.width - 10;
        this.clockText.y = 10;
        this.rankLabel.x = 10;
        this.rankLabel.y = this.clockText.y + this.clockText.height + 10;
        this.nameLabel.x = this.rankLabel.x + this.rankLabel.width + 10;
        this.nameLabel.y = this.rankLabel.y;
        this.scoreLabel.x = this.game.width - 10;
        this.scoreLabel.y = this.rankLabel.y;
        this.rankText.x = this.rankLabel.x + this.rankLabel.width;
        this.rankText.y = this.rankLabel.y + this.rankLabel.height;
        this.nameText.x = this.nameLabel.x;
        this.nameText.y = this.nameLabel.y + this.nameLabel.height;
        this.scoreText.x = this.scoreLabel.x;
        this.scoreText.y = this.scoreLabel.y + this.scoreLabel.height;
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
                this.scoreText.text += LeaderboardState.LeaderboardResults[n].score.toLocaleString() + "\n";
            }
        }
        switch (this.clock.State) {
            case ClockState.Gameplay:
                ga('send', 'event', 'Leaderboard', 'Started Next Game');
                this.game.state.start("Gameplay", true, false, this.clock, this.scoreboard, this.name);
                break;
            case ClockState.Results:
                this.game.state.start("Results", true, false, this.clock, this.scoreboard, this.name);
                break;
            default:
                break;
        }
        this.clockText.text = (this.clock.TimeRemaining / 1000).toFixed(0);
    };
    return LeaderboardState;
}(Phaser.State));
var LoadingState = (function (_super) {
    __extends(LoadingState, _super);
    function LoadingState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LoadingState.prototype.preload = function () {
        this.logo = this.add.image(0, 0, "BlokPrtyLLCLogo");
        this.logo.width = this.game.width;
        this.logo.height = this.game.height;
        // Setup the preload bar
        this.loadingBar = this.add.sprite(0, 0, "LoadingBar");
        this.loadingBar.anchor.setTo(0.5);
        this.loadingBar.position.setTo(this.world.centerX, this.game.height * 3 / 4);
        this.load.setPreloadSprite(this.loadingBar);
        // Load game assets
        this.load.image("Background", "assets/sprites/background.png?v=2");
        this.load.image("BlokPrtyBG", "assets/sprites/blokprtybg.png?v=2");
        this.load.image("BlokPrty-Fixed", "assets/sprites/blokprty-fixed.png?v=2");
        this.load.image("PlayButton", "assets/sprites/playbutton.png?v=2");
        this.load.image("LoginButton", "assets/sprites/loginbutton.png?v=2");
        this.load.image("BlokPrtyLLCLogoCropped", "assets/sprites/blokprtyllclogocropped.png?v=2");
        this.load.image("FacebookLogo", "assets/sprites/facebooklogo.png?v=2");
        this.load.image("TwitterLogo", "assets/sprites/twitterlogo.png?v=2");
        this.load.image("InstagramLogo", "assets/sprites/instagramlogo.png?v=2");
        this.load.image("TumblrLogo", "assets/sprites/tumblrlogo.png?v=2");
        this.load.image("UseResponseLogo", "assets/sprites/useresponselogo.png?v=2");
        this.load.image("Block", "assets/sprites/block.png?v=2");
        this.load.image("BackButton", "assets/sprites/backbutton.png?v=2");
        this.load.image("StarParticle", "assets/sprites/starparticle.png?v=2");
        this.load.image("CircleParticle", "assets/sprites/circleparticle.png?v=2");
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
    function MatchDetector(board, scoreboard, signManager, chainDetector) {
        this.matchDetections = [];
        this.board = board;
        this.scoreboard = scoreboard;
        this.signManager = signManager;
        this.chainDetector = chainDetector;
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
        var incrementChain = false;
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
                if (this.board.Blocks[x][block.Y].Chainer.ChainEligible) {
                    incrementChain = true;
                }
            }
        }
        if (verticalMatch) {
            for (var y = top; y < bottom; y++) {
                this.board.Blocks[block.X][y].Matcher.Match(matchedBlockCount, delayCounter);
                delayCounter--;
                if (this.board.Blocks[block.X][y].Chainer.ChainEligible) {
                    incrementChain = true;
                }
            }
        }
        if (matchedBlockCount > MatchDetector.MinimumMatchLength) {
            this.scoreboard.ScoreCombo(matchedBlockCount);
            this.signManager.CreateSign(block.X, block.Y, matchedBlockCount.toString(), 0xffffff);
        }
        if (incrementChain) {
            this.chainDetector.IncrementChain();
            this.signManager.CreateSign(block.X, block.Y, this.chainDetector.ChainLength.toString() + "x", 0xffffff);
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
        this.backgroundImage = this.add.tileSprite(0, 0, 1600, 1600, "BlokPrtyBG");
        this.logoImage = this.add.image(0, 0, "BlokPrty-Fixed");
        this.logoImage.anchor.setTo(0.5, 0);
        this.playButton = this.add.button(0, 0, "PlayButton", this.OnPlayButton_Click, this);
        this.playButton.anchor.setTo(0.5, 0);
        this.loginButton = this.add.button(0, 0, "LoginButton", this.OnLoginButton_Click, this);
        this.loginButton.anchor.setTo(0.5, 0);
        var nameStyle = { font: "30px Arial", fill: "#ffffff", align: "center" };
        this.nameText = this.add.text(0, 0, "", nameStyle);
        this.nameText.anchor.setTo(0.5, 0);
        this.nameText.visible = false;
        var textStyle = { font: "20px Arial", fill: "#ffffff", align: "right" };
        this.websiteLabel = this.add.text(0, 0, "Website", textStyle);
        this.websiteLabel.anchor.setTo(1, 1);
        this.websiteButton = this.add.button(0, 0, "BlokPrtyLLCLogoCropped", this.OnWebsiteButton_Click, this);
        this.websiteButton.anchor.setTo(1, 1);
        this.facebookLabel = this.add.text(0, 0, "Facebook", textStyle);
        this.facebookLabel.anchor.setTo(1, 1);
        this.facebookButton = this.add.button(0, 0, "FacebookLogo", this.OnFacebookButton_Click, this);
        this.facebookButton.anchor.setTo(1, 1);
        this.twitterLabel = this.add.text(0, 0, "Twitter", textStyle);
        this.twitterLabel.anchor.setTo(1, 1);
        this.twitterButton = this.add.button(0, 0, "TwitterLogo", this.OnTwitterButton_Click, this);
        this.twitterButton.anchor.setTo(1, 1);
        this.instagramLabel = this.add.text(0, 0, "Instagram", textStyle);
        this.instagramLabel.anchor.setTo(1, 1);
        this.instagramButton = this.add.button(0, 0, "InstagramLogo", this.OnInstagramButton_Click, this);
        this.instagramButton.anchor.setTo(1, 1);
        this.tumblrLabel = this.add.text(0, 0, "Tumblr", textStyle);
        this.tumblrLabel.anchor.setTo(1, 1);
        this.tumblrButton = this.add.button(0, 0, "TumblrLogo", this.OnTumblrButton_Click, this);
        this.tumblrButton.anchor.setTo(1, 1);
        this.feedbackLabel = this.add.text(0, 0, "Feedback", textStyle);
        this.feedbackLabel.anchor.setTo(1, 1);
        this.feedbackButton = this.add.button(0, 0, "UseResponseLogo", this.OnFeedbackButton_Click, this);
        this.feedbackButton.anchor.setTo(1, 1);
        this.scale.onOrientationChange.add(this.resize);
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
        ga('send', 'event', 'Menu', 'Started Playing');
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
        ga('send', 'event', 'Menu', 'Logged In');
    };
    MenuState.prototype.OnWebsiteButton_Click = function () {
        window.open("http://www.blokprty.com");
    };
    MenuState.prototype.OnFacebookButton_Click = function () {
        window.open("https://www.facebook.com/Blok-Prty-206750359857091/");
    };
    MenuState.prototype.OnTwitterButton_Click = function () {
        window.open("https://twitter.com/blokprtyllc");
    };
    MenuState.prototype.OnInstagramButton_Click = function () {
        window.open("https://www.instagram.com/blokprty/");
    };
    MenuState.prototype.OnTumblrButton_Click = function () {
        window.open("https://blokprty.tumblr.com/");
    };
    MenuState.prototype.OnFeedbackButton_Click = function () {
        window.open("https://blokprty.useresponse.com/");
    };
    MenuState.prototype.resize = function () {
        this.backgroundImage.width = this.game.width;
        this.backgroundImage.height = this.game.height;
        this.logoImage.width = this.game.width * 0.5;
        this.logoImage.height = this.game.height * 0.5;
        this.logoImage.x = this.world.centerX;
        this.logoImage.y = this.game.height * 0.05;
        this.playButton.width = this.game.width * 0.5;
        this.playButton.height = this.game.height * 0.2;
        this.playButton.x = this.world.centerX;
        this.playButton.y = this.world.centerY + this.game.height * 0.05;
        this.loginButton.width = this.game.width * 0.5;
        this.loginButton.height = this.game.height * 0.2;
        this.loginButton.x = this.world.centerX;
        this.loginButton.y = this.playButton.y + this.playButton.height + this.game.height * 0.05;
        this.nameText.x = this.world.centerX;
        this.nameText.y = this.playButton.y + this.playButton.height + this.game.height * 0.05;
        this.feedbackLabel.x = this.game.width;
        this.feedbackLabel.y = this.game.height;
        this.feedbackButton.width = this.feedbackButton.height = this.feedbackLabel.height;
        this.feedbackButton.x = this.feedbackLabel.x - this.feedbackLabel.width;
        this.feedbackButton.y = this.feedbackLabel.y;
        this.tumblrLabel.x = this.game.width;
        this.tumblrLabel.y = this.feedbackLabel.y - this.feedbackLabel.height;
        this.tumblrButton.width = this.tumblrButton.height = this.tumblrLabel.height;
        this.tumblrButton.x = this.tumblrLabel.x - this.tumblrLabel.width;
        this.tumblrButton.y = this.tumblrLabel.y;
        this.instagramLabel.x = this.game.width;
        this.instagramLabel.y = this.tumblrLabel.y - this.tumblrLabel.height;
        this.instagramButton.width = this.instagramButton.height = this.instagramLabel.height;
        this.instagramButton.x = this.instagramLabel.x - this.instagramLabel.width;
        this.instagramButton.y = this.instagramLabel.y;
        this.twitterLabel.x = this.game.width;
        this.twitterLabel.y = this.instagramLabel.y - this.instagramLabel.height;
        this.twitterButton.width = this.twitterButton.height = this.twitterLabel.height;
        this.twitterButton.x = this.twitterLabel.x - this.twitterLabel.width;
        this.twitterButton.y = this.twitterLabel.y;
        this.facebookLabel.x = this.game.width;
        this.facebookLabel.y = this.twitterLabel.y - this.twitterLabel.height;
        this.facebookButton.width = this.facebookButton.height = this.facebookLabel.height;
        this.facebookButton.x = this.facebookLabel.x - this.facebookLabel.width;
        this.facebookButton.y = this.facebookLabel.y;
        this.websiteLabel.x = this.game.width;
        this.websiteLabel.y = this.facebookLabel.y - this.facebookLabel.height;
        this.websiteButton.width = this.websiteButton.height = this.websiteLabel.height;
        this.websiteButton.x = this.websiteLabel.x - this.websiteLabel.width;
        this.websiteButton.y = this.websiteLabel.y;
    };
    MenuState.prototype.update = function () {
        this.backgroundImage.tilePosition.x += 1;
        this.backgroundImage.tilePosition.y += 1;
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
        this.scoreLabel = this.add.text(0, 0, "Final Score", { font: "70px Arial", fill: "#ffffff", align: "center" });
        this.scoreLabel.anchor.setTo(0.5, 0);
        this.scoreText = this.add.text(0, 0, this.scoreboard.Score.toLocaleString(), { font: "70px Arial", fill: "#ffffff", align: "center" });
        this.scoreText.anchor.setTo(0.5, 0);
        this.clockText = this.add.text(0, 0, "15", { font: "40px Arial", fill: "#ffffff", align: "right" });
        this.clockText.anchor.setTo(1, 0);
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
    ResultsState.prototype.resize = function () {
        this.backgroundImage.width = this.game.width;
        this.backgroundImage.height = this.game.height;
        this.backButton.width = 40;
        this.backButton.height = 50;
        this.backButton.x = 10;
        this.backButton.y = 10;
        this.clockText.x = this.game.width - 10;
        this.clockText.y = 10;
        var shortDimension = Math.min(this.game.width, this.game.height);
        this.scoreText.fontSize = shortDimension * 0.1;
        this.scoreText.x = this.world.centerX;
        this.scoreText.y = this.world.centerY;
        this.scoreLabel.fontSize = shortDimension * 0.1;
        this.scoreLabel.x = this.world.centerX;
        this.scoreLabel.y = this.world.centerY - this.scoreText.height;
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
        this.clockText.text = (this.clock.TimeRemaining / 1000).toFixed(0);
    };
    return ResultsState;
}(Phaser.State));
var Scoreboard = (function () {
    function Scoreboard(phaserGame) {
        this.Reset();
    }
    Scoreboard.prototype.Reset = function () {
        this.Score = 0;
    };
    Scoreboard.prototype.ScoreMatch = function () {
        this.Score += Scoreboard.MatchValue;
    };
    Scoreboard.prototype.ScoreCombo = function (length) {
        this.Score += length * Scoreboard.ComboValue;
    };
    Scoreboard.prototype.ScoreChain = function (length) {
        this.Score += length * Scoreboard.ChainValue;
    };
    Scoreboard.MatchValue = 10;
    Scoreboard.ComboValue = 100;
    Scoreboard.ChainValue = 1000;
    return Scoreboard;
}());
var Sign = (function () {
    function Sign(game, group) {
        this.renderer = new SignRenderer(this, game, group);
    }
    Sign.prototype.Create = function (text, color) {
        this.Text = text;
        this.Color = color;
        this.Active = true;
        this.Elapsed = 0;
    };
    Sign.prototype.Update = function (elapsedGameTime) {
        if (this.Active) {
            this.Elapsed += elapsedGameTime;
            this.renderer.Update(elapsedGameTime);
            if (this.Elapsed >= Sign.Duration) {
                this.Active = false;
            }
        }
    };
    Sign.Duration = 1000;
    return Sign;
}());
var SignManager = (function () {
    function SignManager(game, group) {
        this.Signs = [];
        for (var x = 0; x < Board.Columns; x++) {
            this.Signs[x] = [];
            for (var y = 0; y < Board.Rows; y++) {
                this.Signs[x][y] = new Sign(game, group);
                this.Signs[x][y].X = x;
                this.Signs[x][y].Y = y;
            }
        }
    }
    SignManager.prototype.CreateSign = function (x, y, text, color) {
        this.Signs[x][y].Create(text, color);
    };
    SignManager.prototype.Update = function (elapsedGameTime) {
        for (var x = 0; x < Board.Columns; x++) {
            for (var y = 0; y < Board.Rows; y++) {
                this.Signs[x][y].Update(elapsedGameTime);
            }
        }
    };
    return SignManager;
}());
var SignRenderer = (function () {
    function SignRenderer(sign, game, group) {
        this.sign = sign;
        this.text = game.add.text(0, 0, "", { font: "bold 40px Arial" });
        this.text.anchor.setTo(0.5);
        this.group = group;
        this.group.addChild(this.text);
        this.group.bringToTop(this.text);
    }
    SignRenderer.prototype.Update = function (elapsedGameTime) {
        if (this.sign.Active) {
            this.text.x = this.sign.X * BlockRenderer.Size + BlockRenderer.Size / 2;
            this.text.y = this.sign.Y * BlockRenderer.Size + BlockRenderer.Size / 2 - (this.sign.Elapsed / Sign.Duration) * BlockRenderer.Size;
            this.text.alpha = 1 - (this.sign.Elapsed / Sign.Duration);
            this.text.text = this.sign.Text;
            var colorString = void 0;
            switch (this.sign.Color) {
                case 0x0000ff:
                    colorString = "#0000ff";
                    break;
                case 0x00ff00:
                    colorString = "#00ff00";
                    break;
                case 0xff0000:
                    colorString = "#ff0000";
                    break;
                case 0x00ffff:
                    colorString = "#00ffff";
                    break;
                case 0xff00ff:
                    colorString = "#ff00ff";
                    break;
                case 0xffff00:
                    colorString = "#ffff00";
                    break;
                case 0xffffff:
                    colorString = "#ffffff";
                    break;
            }
            this.text.addColor(colorString, 0);
            this.group.bringToTop(this.text);
        }
    };
    return SignRenderer;
}());
