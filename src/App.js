const InputView = require('./InputView');
const OutputView = require('./OutputView');
const BridgeGame = require('./BridgeGame');
const BridgeMaker = require('./BridgeMaker');
const BridgeRandomNumberGenerator = require('./BridgeRandomNumberGenerator');

class App {
  #bridgeGame;

  #input;

  #output;

  constructor() {
    this.#bridgeGame = new BridgeGame();
    this.#input = InputView;
    this.#output = OutputView;
  }

  printStartMessage() {
    const message = OutputView.message.START;

    this.#output.print(message);
  }

  printFinalGameResult() {
    const gameReuslt = !this.isGameOver();
    const tryCount = this.#bridgeGame.getTryCount();
    const classifiedBridgeLog = this.#bridgeGame.getCurrentClassifiedBridgeLog();

    this.#output.finalGameResult(classifiedBridgeLog);
    this.#output.printResult(gameReuslt, tryCount);
  }

  printFinalGameResultAndClose() {
    this.printFinalGameResult();
    this.exit();
  }

  printMap() {
    const classifiedBridgeLog = this.#bridgeGame.getCurrentClassifiedBridgeLog();

    this.#output.printMap(classifiedBridgeLog);
  }

  generateBridge(size) {
    const newBridge = BridgeMaker.makeBridge(size, BridgeRandomNumberGenerator.generate);

    this.#bridgeGame.setBridge(newBridge);

    return newBridge;
  }

  setGameLog(userInput) {
    BridgeGame.checkIncludeUandD(userInput);
    this.#bridgeGame.move();
    this.#bridgeGame.setGameLog(userInput);
  }

  getBridgeLength() {
    return this.#bridgeGame.getBridge().length;
  }

  isGameOver() {
    const result = this.#bridgeGame.getCurrentBridgeReuslt();
    const FAILURE = 'X';
    const [GAMR_OVER, NO_GAME_OVER] = [true, false];
    if (result === FAILURE) {
      return GAMR_OVER;
    }

    return NO_GAME_OVER;
  }

  isGameSuccess() {
    const length = this.getBridgeLength();

    return this.#bridgeGame.isBridgeEnd(length);
  }

  checkIsR(userInput) {
    if (userInput === 'R') {
      this.retryAndMove();
    }
  }

  checkIsQ(userInput) {
    if (userInput === 'Q') {
      this.printFinalGameResultAndClose();
    }
  }

  checkGameFinish() {
    const gameReuslt = this.isGameSuccess();

    if (gameReuslt) {
      this.printFinalGameResultAndClose();
    } else {
      this.readMoving();
    }
  }

  checkGameOver() {
    const gameReuslt = !this.isGameOver();

    if (gameReuslt) {
      this.checkGameFinish();
    } else {
      this.readGameCommand();
    }
  }

  retry() {
    this.#bridgeGame.retry();
  }

  retryAndMove() {
    this.retry();
    this.readMoving();
  }

  retryGameCommand(userInput) {
    BridgeGame.checkIncludeRandQ(userInput);
    this.checkIsR(userInput);
    this.checkIsQ(userInput);
  }

  readMoving() {
    const message = this.#output.message.MOVE;
    const callbackFn = (userInput) => {
      this.setGameLog(userInput);
      this.printMap();
      this.checkGameOver();
    };

    this.#input.readMoving(message, callbackFn);
  }
}

module.exports = App;
