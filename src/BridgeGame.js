const Application = require('./Application');
const Validation = require('./Validation');

/**
 * 다리 건너기 게임을 관리하는 클래스
 */
class BridgeGame {
  #userPosition;

  #bridge;

  #positionLog;

  #bridgeLog;

  constructor() {
    this.#userPosition = null;
    this.#positionLog = new Map();
    this.#bridgeLog = new Map();
  }

  static replaceString(numberValue) {
    const TARGET_NUMBER = Application.convertNumber(numberValue);
    const REPLCE_ITME_1 = [0, 'D'];
    const REPLCE_ITME_2 = [1, 'U'];

    return Application.replace(TARGET_NUMBER, REPLCE_ITME_1, REPLCE_ITME_2);
  }

  static replaceNumber(stringValue) {
    const TARGET_STRING = stringValue;
    const REPLCE_ITME_1 = ['D', 1];
    const REPLCE_ITME_2 = ['U', 0];

    return Application.replace(TARGET_STRING, REPLCE_ITME_1, REPLCE_ITME_2);
  }

  static checkIncludeUandD(userInput) {
    const INPUT_TARGET = ['U', 'D'];
    const isIncludeUandD = Application.hasContain(INPUT_TARGET);

    return isIncludeUandD(userInput);
  }

  static checkIncludeRandQ(userInput) {
    const INPUT_TARGET = ['R', 'Q'];
    const isIncludeRandQ = Application.hasContain(INPUT_TARGET);

    return isIncludeRandQ(userInput);
  }

  static createEmptyUDArray(Length = 1) {
    const EMPTY = ' ';
    const createEmptyArray = () => Application.createArray(Length, () => EMPTY);
    const emptyUArray = createEmptyArray();
    const emptyDArray = createEmptyArray();

    return [emptyUArray, emptyDArray];
  }

  static extractFromZeroTo(targetArray, range) {
    const BEGIN = 0;
    const copiedArray = Application.copyArray(targetArray);
    const extractBridge = (bridge) => Application.extractArrayRange(bridge, BEGIN, range);

    return copiedArray.map(extractBridge);
  }

  isBeforeStart() {
    return this.#userPosition === null;
  }

  checkBeforeStart() {
    const POSITION_ERROR_TEXT = '[ERROR] 플레이어가 아직 이동하지 않았습니다.';

    if (this.isBeforeStart()) {
      Validation.throwError(POSITION_ERROR_TEXT);
    }
  }

  setFirstPosition() {
    const ZERO = 0;
    this.#userPosition = ZERO;

    return this.#userPosition;
  }

  findUserPosition() {
    return this.#userPosition;
  }

  move() {
    if (this.isBeforeStart()) {
      return this.setFirstPosition();
    }

    const INCREASE = 1;
    this.#userPosition = this.findUserPosition() + INCREASE;

    return this.#userPosition;
  }

  retry() {
    this.#userPosition = null;

    return this.#userPosition;
  }

  isBridgeEnd(arrayLength) {
    Validation.number(arrayLength);

    const ONE = 1;
    const MAX_INDEX_POINT = arrayLength - ONE;
    const CURRENT_INDEX = this.findUserPosition();

    return MAX_INDEX_POINT === CURRENT_INDEX;
  }

  setBridge(bridgeResult) {
    const copiedBridgeResult = Application.copyArray(bridgeResult);
    const bridgelength = Application.getArrayLength(copiedBridgeResult);

    Application.checkRangeThreeToTwenty(bridgelength);

    this.#bridge = copiedBridgeResult;

    return copiedBridgeResult;
  }

  getBridge() {
    return this.#bridge;
  }

  calcBridgeReuslt(userInput) {
    this.checkBeforeStart();
    BridgeGame.checkIncludeUandD(userInput);

    const userPosition = this.findUserPosition();
    const bridge = this.getBridge();
    const [CORRECT, INCORRECT] = ['O', 'X'];

    return bridge[userPosition] === userInput ? CORRECT : INCORRECT;
  }

  getPositionIndex(userInput) {
    const TOP_BOTTOM_INDEX = BridgeGame.replaceNumber(userInput);
    const MOVE_INDEX = this.findUserPosition();

    this.checkBeforeStart();

    return [TOP_BOTTOM_INDEX, MOVE_INDEX];
  }

  setPositionLog(positionIndex, bridgeResult) {
    this.checkBeforeStart();

    const USER_POSITION = this.findUserPosition();
    const positionLog = [positionIndex, bridgeResult];

    this.#positionLog.set(USER_POSITION, positionLog);

    return positionLog;
  }

  getPositionLog() {
    return [...this.#positionLog.values()];
  }

  setBridgeLog(positionLog) {
    this.checkBeforeStart();
    const emptyArray = BridgeGame.createEmptyUDArray();
    const [[TOP_BOTTOM_INDEX, USER_POSITION], BRIDGE_REUSLT] = positionLog;
    emptyArray[TOP_BOTTOM_INDEX] = [BRIDGE_REUSLT];

    this.#bridgeLog.set(USER_POSITION, emptyArray);

    return emptyArray;
  }

  getBridgeLog() {
    this.checkBeforeStart();

    return [...this.#bridgeLog.values()];
  }
}

module.exports = BridgeGame;
