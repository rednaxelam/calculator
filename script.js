
class Calculator {

  static #validInputChars = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', '(', ')', ' ', 'a', 'x', 'y', 'z']);

  #calcWindowList = new CalcWindowList();
  #ans = null;
  #x = null;
  #y = null;
  #z = null;
  #inputDisplay = document.querySelector("#display-input");
  #outputDisplay = document.querySelector("#display-output");

  addInput(input) {
    if (!this.#calcWindowList.isFinishedCalcWindow()) {
      let insertionPoint = this.#inputDisplay.selectionStart;
      let oldInputString = this.#inputDisplay.value;
      let newInputString = '';
      if (insertionPoint === 0) {
        newInputString = input + oldInputString;
        this.#inputDisplay.value = newInputString;
        this.#inputDisplay.setSelectionRange(input.length, input.length);
      } else if (insertionPoint === oldInputString.length) {
        newInputString = oldInputString + input;
        this.#inputDisplay.value = newInputString;
        this.#inputDisplay.setSelectionRange(oldInputString.length + input.length, oldInputString.length + input.length);
      } else {
        newInputString = oldInputString.substring(0, insertionPoint) + input + oldInputString.substring(insertionPoint, oldInputString.length);
        this.#inputDisplay.value = newInputString;
        this.#inputDisplay.setSelectionRange(insertionPoint + input.length, insertionPoint + input.length);
      }
    } else if (['+','-','*','/'].includes(input)) {
      this.#calcWindowList.goToEndCalcWindow(`ans${input}`);
      this.clearOutputDisplay();
      this.makeInputDisplayEditable();
      this.#inputDisplay.value = this.#calcWindowList.getInputString();
      this.#inputDisplay.setSelectionRange(this.#inputDisplay.value.length, this.#inputDisplay.value.length);
    } else {
      this.#calcWindowList.goToEndCalcWindow(`${input}`);
      this.clearOutputDisplay();
      this.makeInputDisplayEditable();
      this.#inputDisplay.value = this.#calcWindowList.getInputString();
      this.#inputDisplay.setSelectionRange(this.#inputDisplay.value.length, this.#inputDisplay.value.length);
    }
  }

  // add support for ans later
  removeInput() {
    if (!this.#calcWindowList.isFinishedCalcWindow()) {
      let deletionPoint = this.#inputDisplay.selectionStart;
      let oldInputString = this.#inputDisplay.value;
      let newInputString = '';
      if (deletionPoint === 0) {

      } else if (deletionPoint === oldInputString.length) {
        newInputString = oldInputString.substring(0, oldInputString.length - 1);
        this.#inputDisplay.value = newInputString;
        this.#inputDisplay.setSelectionRange(newInputString.length, newInputString.length)
      } else {
        newInputString = oldInputString.substring(0, deletionPoint - 1) + oldInputString.substring(deletionPoint, oldInputString.length);
        this.#inputDisplay.value = newInputString;
        this.#inputDisplay.setSelectionRange(deletionPoint - 1, deletionPoint - 1);
      }
    }
  }

  goLeft() {
    if (!this.#calcWindowList.isFinishedCalcWindow()) {
      let currentSelectionIndex = this.#inputDisplay.selectionStart;
      if (currentSelectionIndex !== 0) {
        this.#inputDisplay.setSelectionRange(currentSelectionIndex - 1, currentSelectionIndex - 1);
      }
    } else {
      this.#calcWindowList.goToEndCalcWindow(this.#inputDisplay.value);
      this.clearOutputDisplay();
      this.makeInputDisplayEditable();
      this.#inputDisplay.setSelectionRange(this.#inputDisplay.value.length - 1, this.#inputDisplay.value.length - 1);
    }
  }

  goRight() {
    if (!this.#calcWindowList.isFinishedCalcWindow()) {
      let currentSelectionIndex = this.#inputDisplay.selectionStart;
      if (currentSelectionIndex !== this.#inputDisplay.value.length) {
        this.#inputDisplay.setSelectionRange(currentSelectionIndex + 1, currentSelectionIndex + 1);
      }
    } else {
      this.#calcWindowList.goToEndCalcWindow(this.#inputDisplay.value);
      this.clearOutputDisplay();
      this.makeInputDisplayEditable();
      this.#inputDisplay.setSelectionRange(this.#inputDisplay.value.length, this.#inputDisplay.value.length);
    }
  }

  evaluateInput() {
    if (this.#calcWindowList.isFinishedCalcWindow()) return;

    let result = null;
    try {
      result = evaluate(this.#inputDisplay.value);
      this.#calcWindowList.setOutputValue(result);
      this.#calcWindowList.setInputString(this.#inputDisplay.value);
      this.#calcWindowList.setIsFinishedCalcWindow(true);
      this.#calcWindowList.append();
      this.makeInputDisplayReadOnly();
    } catch (error) {
      result = error.message;
    }
    this.setOutputDisplay(`${result}`);
  }

  clearOutputDisplay() {
    this.#outputDisplay.removeChild(this.#outputDisplay.firstElementChild);
    this.#outputDisplay.appendChild(createElement('p'));
  }

  setOutputDisplay(outputString) {
    this.#outputDisplay.removeChild(this.#outputDisplay.firstElementChild);
    let resultElement = createElement('p');
    resultElement.textContent = outputString;
    this.#outputDisplay.appendChild(resultElement);
  }

  makeInputDisplayReadOnly() {
    if (!this.#inputDisplay.hasAttribute('readonly')) {
      this.#inputDisplay.setAttribute('readonly', true);
    }
  }

  makeInputDisplayEditable() {
    if (this.#inputDisplay.hasAttribute('readonly')) {
      this.#inputDisplay.removeAttribute('readonly');
    }
  }

  hasBeforeCalcWindow() {
    return this.#calcWindowList.hasBeforeCalcWindow();
  }

  goToBeforeCalcWindow() {
    if (this.hasBeforeCalcWindow()) {
      this.#calcWindowList.goToBeforeCalcWindow();
      this.makeInputDisplayReadOnly();
      this.#inputDisplay.value = this.#calcWindowList.getInputString();
      this.setOutputDisplay(`${this.#calcWindowList.getOutputValue()}`);
    }
  }

  hasNextCalcWindow() {
    return this.#calcWindowList.hasNextCalcWindow();
  }

  goToNextCalcWindow() {
    if (this.hasNextCalcWindow()) {
      this.#calcWindowList.goToNextCalcWindow();
      if (!this.#calcWindowList.isFinishedCalcWindow()) {
        this.clearOutputDisplay();
        this.makeInputDisplayEditable();
        this.#inputDisplay.value = this.#calcWindowList.getInputString();
        this.#inputDisplay.setSelectionRange(this.#inputDisplay.value.length, this.#inputDisplay.value.length);
      } else {
        this.makeInputDisplayReadOnly();
        this.#inputDisplay.value = this.#calcWindowList.getInputString();
        this.setOutputDisplay(`${this.#calcWindowList.getOutputValue()}`);
      }
    }
  }

  isFinishedCalcWindow() {
    return this.#calcWindowList.isFinishedCalcWindow();
  }

  isValidInputChar(char) {
    return Calculator.#validInputChars.has(char);
  }

  clear() {
    if (this.#calcWindowList.isFinishedCalcWindow()) {
      this.#calcWindowList.goToEndCalcWindow('');
      this.makeInputDisplayEditable();
    } else {
      this.#calcWindowList.setInputString('');
    }
    this.clearOutputDisplay();
    this.#inputDisplay.value = '';
    this.#inputDisplay.setSelectionRange(0, 0);
  }

  clearAll() {
    this.#calcWindowList = new CalcWindowList();
    this.#ans = null;
    this.#x = null;
    this.#y = null;
    this.#z = null;
    this.clearOutputDisplay();
    this.makeInputDisplayEditable();
    this.#inputDisplay.value = '';
    this.#inputDisplay.setSelectionRange(0, 0);
  }

}

class CalcWindowList {

  #start;
  #current;
  #end;

  constructor() {
    let newNode = new Node();
    newNode.value = new CalcWindow();

    this.#start = newNode;
    this.#end = newNode;
    this.#current = newNode;
  }

  append() {
    if (!this.#end.value.isFinishedCalcWindow()) throw new Error("Method should not be called if end CalcWindow is unfinished");
    let newNode = new Node();
    newNode.value = new CalcWindow();
    this.#end.next = newNode;
    newNode.before = this.#end;
    this.#end = newNode;
  }

  hasNextCalcWindow() {
    return this.#end !== this.#current;
  }

  goToNextCalcWindow() {
    if (!this.hasNextCalcWindow()) throw new Error("Out of bounds");
    this.#current = this.#current.next;
  }

  hasBeforeCalcWindow() {
    return this.#start !== this.#current;
  }

  goToBeforeCalcWindow() {
    if (!this.hasBeforeCalcWindow()) throw new Error("Out of Bounds");
    this.#current = this.#current.before;
  }

  goToEndCalcWindow(inputString) {
    if (typeof inputString !== "string") throw new Error("String Expected");
    this.#current = this.#end;
    if (this.#end.value.isFinishedCalcWindow()) throw new Error("Method should not be called if end CalcWindow is finished");
    this.#current.value.setInputString(inputString);
  }

  getInputString() {
    return this.#current.value.getInputString();
  }

  isFinishedCalcWindow() {
    return this.#current.value.isFinishedCalcWindow();
  }

  getOutputValue() {
    return this.#current.value.getOutputValue();
  }

  setInputString(inputString) {
    this.#current.value.setInputString(inputString);
  }

  setIsFinishedCalcWindow(isFinished) {
    this.#current.value.setIsFinishedCalcWindow(isFinished);
  }

  setOutputValue(num) {
    this.#current.value.setOutputValue(num);
  }
}

class CalcWindow {

  #inputString = '';
  #isFinishedCalcWindow = false;
  #outputValue = null;

  setInputString(inputString) {
    if (this.isFinishedCalcWindow()) throw new Error("Can't set input for finished CalcWindow");
    if (typeof inputString !== "string") throw new Error("String value expected");
    this.#inputString = inputString;
    return this;
  }

  getInputString() {
    return this.#inputString;
  }

  setIsFinishedCalcWindow(isFinished) {
    if (typeof isFinished !== "boolean") throw new Error("Boolean value expected");
    if (this.isFinishedCalcWindow()) throw new Error("Can't set this property after CalcWindow has been finished");
    this.#isFinishedCalcWindow = isFinished;
    return this;
  }

  isFinishedCalcWindow() {
    return this.#isFinishedCalcWindow;
  }

  setOutputValue(num) {
    if (this.isFinishedCalcWindow()) throw new Error("Can't set output for finished CalcWindow");
    if (!num.isNumber()) throw new Error("Integer, Rational, or Real expected");
    this.#outputValue = num;
    return this;
  }

  getOutputValue() {
    return this.#outputValue;
  }
}

function evaluate(expressionString) {
  function validateCorrectlyParenthesized(expressionStr) {
    const parenthesisChars = new Set(['(', ')']);
    let numSurplusLeftParentheses = 0;
    let previousCharWasLeftParenthesis = false;
    let currentIndex = 0;
    let endIndex = expressionStr.length - 1;
    while (currentIndex <= endIndex) {
      const currentChar = expressionStr.charAt(currentIndex);
      if (currentChar === ' ') {
        
      } else if (!parenthesisChars.has(currentChar)) {
        previousCharWasLeftParenthesis = false;
      } else if (currentChar === '(') {
        numSurplusLeftParentheses++;
        previousCharWasLeftParenthesis = true;
      } else {
        if (previousCharWasLeftParenthesis) {
          throw new Error("Empty subexpressions are not permitted");
        } else {
          numSurplusLeftParentheses--;
          previousCharWasLeftParenthesis = false;
        }
      }
      currentIndex++;
      if (numSurplusLeftParentheses < 0) {
        throw new Error("Expression not correctly parenthesized");
      }

    }
    if (numSurplusLeftParentheses > 0) {
      throw new Error("Expression not correctly parenthesized");
    }
  }

  function evaluateHelper(tokenList) {
    // first pass through evaluates parenthesized subexpressions. There should be no parentheses in the tokenList in this scope after having done this
    let numSurplusLeftParentheses = 0;
    let subexpressionTokenList = null;
    tokenList.goToStart();
    while (tokenList.hasNextToken()) {
      if (tokenList.isLeftParenthesisToken()) {
        if (numSurplusLeftParentheses === 0) {
          subexpressionTokenList = new TokenList(tokenList.goToNextToken().popCurrentToken());
          if (subexpressionTokenList.isLeftParenthesisToken()) numSurplusLeftParentheses++;
        } else {
          subexpressionTokenList.append(tokenList.popCurrentToken());
        }
        numSurplusLeftParentheses++;
      } else if (tokenList.isRightParenthesisToken()) {
        numSurplusLeftParentheses--;
        if (numSurplusLeftParentheses === 0) {
          tokenList.removeCurrentToken();
          tokenList.goToBeforeToken();
          tokenList.setTokenValue(evaluateHelper(subexpressionTokenList));
          tokenList.goToNextToken();
          subexpressionTokenList = null;
        } else {
          subexpressionTokenList.append(tokenList.popCurrentToken());
        }
      } else {
        if (numSurplusLeftParentheses > 0) {
          subexpressionTokenList.append(tokenList.popCurrentToken());
        } else {
          tokenList.goToNextToken();
        }
      }
    }

    if (subexpressionTokenList !== null) {
      tokenList.removeCurrentToken();
      tokenList.setTokenValue(evaluateHelper(subexpressionTokenList));
      subexpressionTokenList = null;
    }

    // validate expression is correct before simplifying
    tokenList.validateExpression();
    // second pass through evaluates operations of precedence 2 (* and /) from left to right
    tokenList.goToStart();
    while(true) {
      if (tokenList.isOperatorToken() && tokenList.getTokenValue().getPrecedence() === 2) {
        tokenList.simplify();
      }
      if (tokenList.hasNextToken()) {
        tokenList.goToNextToken();
      } else {
        break;
      }
    }

    // third pass through evaluates operations of precedence 1 (+ and -) from left to right
    tokenList.goToStart();
    while(true) {
      if (tokenList.isOperatorToken() && tokenList.getTokenValue().getPrecedence() === 1) {
        tokenList.simplify();
      }
      if (tokenList.hasNextToken()) {
        tokenList.goToNextToken();
      } else {
        break;
      }
    }
    
    return tokenList.getTokenValue();
  }

  if (expressionString.length === 0) {
    throw new Error("Can't evaluate empty expression");
  }


  validateCorrectlyParenthesized(expressionString);
  let tokenList = tokenizeExpression(expressionString);
  return evaluateHelper(tokenList);
  
}


function tokenizeExpression(str) {

  // this helper function takes it for granted that numberStr will only contain numeric characters, and at most one period character
  function convertNumberStringToNumber(numberStr) {
    if (!numberStr.includes('.')) {
      return new Integer(Number(numberStr));
    } else {
      if (numberStr.length === 1) {
        throw new Error(`Invalid number token: .`);
      } else {
        return new Real(Number(numberStr));
      }
    }
  }


  const validChars = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', '(', ')', ' ']);
  const numericChars = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']);
  const operatorChars = new Set(['+', '-', '*', '/']);
  const parenthesisChars = new Set(['(', ')']);

  let currentIndex = 0;
  let endIndex = str.length - 1;
  //not posstible to have an empty TokenList, so the '(' node is a placeholder to be removed later
  let tokenList = new TokenList('(');
  let numberString = '';
  let dotCounter = 0;
  let numberStringActive = false;

  while (currentIndex <= endIndex) {
    const currentChar = str.charAt(currentIndex);
    
    if (!validChars.has(currentChar)) {
      throw new Error(`Invalid token: ${currentChar}`);
    } 
    
    if (!numericChars.has(currentChar)) {
      if (numberStringActive) {
        if (dotCounter > 1) {
          throw new Error(`Invalid token: ${numberString}`)
        } else {
          tokenList.append(convertNumberStringToNumber(numberString));
          numberString = '';
          dotCounter = 0;
          numberStringActive = false;
        }
      }
      
      if (operatorChars.has(currentChar)) {
        tokenList.append(new Operator(currentChar));
      } else if (parenthesisChars.has(currentChar)) {
        tokenList.append(currentChar);
      }

    } else if (numericChars.has(currentChar)) {
      numberString += currentChar;
      numberStringActive = true;
      if (currentChar === '.') dotCounter++;
    }

    currentIndex++;
  }

  if (numberStringActive) {
    if (dotCounter > 1) {
      throw new Error(`Invalid token: ${numberString}`)
    } else {
      tokenList.append(convertNumberStringToNumber(numberString));
    }
  }

  //removing the '(' placeholder mentioned earlier:
  tokenList.goToStart();
  tokenList.removeCurrentToken();

  return tokenList;
}

class TokenList {

  #start;
  #end;
  #currentNode;
  #length;
  #numParentheses = 0;

  constructor(token) {
    TokenList.#validateToken(token);

    let newNode = new Node();
    newNode.value = token;

    this.#start = newNode;
    this.#end = newNode;
    this.#currentNode = newNode;
    this.#length = 1;
    if (TokenList.#isParenthesisToken(token)) {
      this.#numParentheses++;
    }
  }

  append(token) {
    TokenList.#validateToken(token);

    let newNode = new Node();
    newNode.value = token;
    newNode.before = this.#end;
    
    this.#end.next = newNode;
    this.#end = newNode;
    this.#length++;
    if (TokenList.#isParenthesisToken(token)) {
      this.#numParentheses++;
    }

    return this;
  }

  removeCurrentToken() {
    if (this.#length === 1) {
      throw new Error("Can't remove element from TokenList of length 1");
    }
    if (TokenList.#isParenthesisToken(this.#currentNode.value)) {
      this.#numParentheses--;
    }
    const previousNode = this.#currentNode.before;
    const nextNode = this.#currentNode.next;
    
    if (this.#currentNode === this.#start) {
      nextNode.before = null;
      this.#start = nextNode;
      this.#currentNode = nextNode;
    } else if (this.#currentNode === this.#end) {
      previousNode.next = null;
      this.#end = previousNode;
      this.#currentNode = previousNode;
    } else {
      previousNode.next = nextNode;
      nextNode.before = previousNode;
      this.#currentNode = nextNode;
    }

    this.#length--;

    return this;
  }

  popCurrentToken() {
    if (this.#length === 1) {
      throw new Error("Can't pop element from TokenList of length 1");
    }

    const returnValue = this.#currentNode.value;
    
    this.removeCurrentToken();

    return returnValue;
  }

  goToStart() {
    this.#currentNode = this.#start;

    return this;
  }

  goToNextToken() {
    if (!this.hasNextToken()) {
      throw new Error("Out of bounds error");
    } else {
      this.#currentNode = this.#currentNode.next;
    }

    return this;
  }

  goToBeforeToken() {
    if (!this.hasBeforeToken()) {
      throw new Error("Out of bounds error");
    } else {
      this.#currentNode = this.#currentNode.before;
    }

    return this;
  }

  hasBeforeToken() {
    return this.#currentNode.before !== null;
  }

  hasNextToken() {
    return this.#currentNode.next !== null;
  }

  hasNoParentheses() {
    return this.#numParentheses === 0;
  }

  getLength() {
    return this.#length;
  }

  getTokenValue() {
    return this.#currentNode.value;
  }

  setTokenValue(token) {
    TokenList.#validateToken(token);
    let numParenthesesChange = 0
    if (TokenList.#isParenthesisToken(token)) {
      numParenthesesChange++;
    }
    if (TokenList.#isParenthesisToken(this.#currentNode.value)) {
      numParenthesesChange--;
    }
    this.#currentNode.value = token;
    this.#numParentheses += numParenthesesChange;
    return this;
  }

  isNumberToken() {
    return this.#currentNode.value.isNumber();
  }

  isOperatorToken() {
    return this.#currentNode.value.isOperator();
  }

  isLeftParenthesisToken() {
    return this.#currentNode.value === '(';
  }

  isRightParenthesisToken() {
    return this.#currentNode.value === ')';
  }

  // this validates whether the expression stored by the TokenList can be simplified to one number with the aid of simplify
  validateExpression() {
    if (!this.hasNoParentheses()) {
      throw new Error("validateExpression can only be invoked on TokenLists that have no parentheses");
    }

    let current = this.#start;
    let previousTokenWasOperator = false;

    if (current.value instanceof Operator) {
      if (!current.value.hasUnaryOperation()) {
        throw new Error("Expression/subexpression can't begin with * or /");
      } else {
        previousTokenWasOperator = true;
      }
    }
    
    current = current.next;
    while (current !== null) {
      if (previousTokenWasOperator) {
        if (current.value.isOperator()) {
          throw new Error("Operator can't be followed by an operator");
        } else {
          previousTokenWasOperator = false;
        }
      } else {
        if (current.value.isNumber()) {
          throw new Error("Number can't be followed by another number");
        } else {
          previousTokenWasOperator = true;
        }
      }
      current = current.next;
    }

    if (this.#end.value.isOperator()) {
      if (this.#length === 1) {
        throw new Error("Operator must have argument(s)");
      } else {
        throw new Error("Binary Operator must have two arguments");
      }
    }

    return true;

  }

  /* simplify can only be called for TokenLists with no parentheses, and should only be used after testing the TokenList using the 
  isValidExpression method (it is fine to not perform this check if the list is only modified by simplify after an initial isValidExpression test)*/
  simplify() {

    if (!this.hasNoParentheses()) {
      throw new Error("simplify can only be called on TokenLists that have no parentheses")
    }

    if (this.#length === 1) {
      if (this.#currentNode.value.isNumber()) {
        return;
      } else if (this.#currentNode.value.isOperator()) {
        throw new Error("Only element in TokenList is an operator");
      } else {
        throw new Error("Only element in TokenList is a parenthesis (make sure hasNoParenthesis is working correctly)");
      }
    }

    if (!(this.#currentNode.value instanceof Operator)) {
      throw new Error("simplify can only be called when current token is an operator");
    } 
    
    let previousNode = this.#currentNode.before;
    let nextNode = this.#currentNode.next;

    if (previousNode === null) {
      let operand = nextNode.value;
      let operator = this.#currentNode.value;
      let result = operator.performOperation(operand);

      this.#currentNode.value = result;
      this.#currentNode.next = nextNode.next;
      if (nextNode.next !== null) {
        nextNode.next.before = this.#currentNode;
      } else {
        this.#end = this.#currentNode;
      }

      this.#length--;
    } else if (nextNode === null) {
      throw new Error("Binary operator must take two arguments");
    } else {
      let operand1 = previousNode.value;
      let operand2 = nextNode.value;
      let operator = this.#currentNode.value;
      let result = operator.performOperation(operand1, operand2);

      previousNode.value = result;
      previousNode.next = nextNode.next;
      if (nextNode.next !== null) {
        nextNode.next.before = previousNode;
      } else {
        this.#end = previousNode;
      }
      this.#currentNode = previousNode;
      this.#length -= 2;
    }

    return this;
  }

  toString() {
    let current = this.#start;
    let str = '[';
    while (current.next !== null) {
      str = str + `${current.value}, `;
      current = current.next;
    }
    str = str  + `${current.value}]`;
    return str;
  }

  static #validateToken(token) {
    if (!(token instanceof Operator || token instanceof Integer || token instanceof Rational || token instanceof Real || token === '(' || token === ')')) {
      throw new Error(`Invalid token supplied to TokenList: ${token}`);
    }
  }

  static #isParenthesisToken(token) {
    return token === '(' || token === ')';
  }

}

class Node {

  value = null;
  next = null;
  before = null;

}

class Operator {

  static #unaryOperations = {
    "+" : x => x.add(),
    "-" : x => x.subtract(),
  };

  static #binaryOperations = {
    "+" : (x, y) => x.add(y),
    "-" : (x, y) => x.subtract(y),
    "*" : (x, y) => x.multiply(y),
    "/" : (x, y) => x.divide(y),
  };
  
  static #operationNames = {
    "+" : "Addition",
    "-" : "Subtraction",
    "*" : "Multiplication",
    "/" : "Division",
  };

  static #precedence = {
    "+" : 1,
    "-" : 1,
    "*" : 2,
    "/" : 2,
  };

  static #validOperations = ['+', '-', '*', '/'];

  
  #value;

  constructor(value) {
    if (!(Operator.#validOperations.includes(value))) {
      throw new Error(`${value} is not a valid operation`);
    } else {
      this.#value = value;
    }
  }

  performOperation(x, y = undefined) {
    if (y === undefined) {
      if (!(this.hasUnaryOperation())) {
        throw new Error(`${Operator.#operationNames[this.#value]} requires two arguments`);
      } else {
        return Operator.#unaryOperations[this.#value](x);
      }
    } else {
      if (x.getLevel() < y.getLevel()) {
        x = x[`promoteTo${y.getType()}`]();
      } else if (y.getLevel() < x.getLevel()) {
        y = y[`promoteTo${x.getType()}`]();
      }
      return Operator.#binaryOperations[this.#value](x, y);
    }
  }

  isNumber() {
    return false;
  }

  isOperator() {
    return true;
  }

  getPrecedence() {
    return Operator.#precedence[this.#value];
  }

  toString() {
    return this.#value;
  }

  hasUnaryOperation() {
    return this.#value === '+' || this.#value === '-';
  }

}


class Integer {

  #value;

  constructor(value) {
    if (typeof value !== "number") {
      throw new Error("integer constructor must have a number argument");
    }

    if (Number.isSafeInteger(value)) {
      this.#value = value;
    } else {
      return new Real(value);
    }
  }

  add(that = undefined) {
    Integer.#validateArgumentType(that);

    if (that === undefined) return this;
    else return new Integer(this.#value + that.#value);
  }

  subtract(that = undefined) {
    Integer.#validateArgumentType(that);

    if (that === undefined) return new Integer(- this.#value);
    else return new Integer(this.#value - that.#value);
  }

  multiply(that = undefined) {
    Integer.#validateArgumentExistence(that);
    Integer.#validateArgumentType(that);

    return new Integer(this.#value * that.#value);
  }

  divide(that = undefined) {
    Integer.#validateArgumentExistence(that);
    Integer.#validateArgumentType(that);
    if (that.#value === 0) throw new Error("Division by 0 is not permitted");

    if (this.#value % that.#value === 0) {
      return new Integer(this.#value / that.#value);
    } else {
      return new Rational(this.#value, that.#value);
    }
  }

  promoteToRational() {
    return new Rational(this.#value, 1);
  }

  promoteToReal() {
    return new Real(this.#value);
  }

  toString() {
    return `${this.#value}`;
  }

  getLevel() {
    return 1;
  }

  getType() {
    return 'Integer';
  }

  isNumber() {
    return true;
  }

  isOperator() {
    return false;
  }

  static #validateArgumentType(that) {
    if (that !== undefined && !(that instanceof Integer)) {
      throw new TypeError("Argument is not an instance of Integer");
    }
  }

  static #validateArgumentExistence(that) {
    if (that === undefined) {
      throw new Error("method must have an argument")
    }
  }
}



class Rational {

  #numerator;
  #denominator;

  constructor(numerator, denominator) {
    if ((typeof numerator !== "number") || (typeof denominator !== "number")) {
      throw new Error("Rational constructor must have two number arguments");
    }

    if (denominator === 0) {
      throw new Error("Division by 0 is not permitted");
    }

    if (!(Number.isSafeInteger(numerator) && Number.isSafeInteger(denominator))) {
      return new Real(numerator / denominator);
    }

    if (numerator === 0) {
      this.#numerator = Math.abs(numerator);
      this.#denominator = 1;
    } else {
      const gcd = Rational.#gcd(numerator, denominator);
      numerator /= gcd;
      denominator /= gcd;

      if (denominator < 0) {
        numerator *= -1;
        denominator *= -1;
      }

      this.#numerator = numerator;
      this.#denominator = denominator;
    }

  }

  add(that = undefined) {
    Rational.#validateArgumentType(that);

    if (that === undefined) return this;
    else if (this.#isZero()) return that;
    else if (that.#isZero()) return this;
    else {
      if (this.#denominator === that.#denominator) {
        return new Rational(this.#numerator + that.#numerator, this.#denominator);
      } else {
        const newNumerator = this.#numerator * that.#denominator + that.#numerator * this.#denominator;
        const newDenominator = this.#denominator * that.#denominator;
        return new Rational(newNumerator, newDenominator);
      }
    }
  }

  subtract(that = undefined) {
    Rational.#validateArgumentType(that);

    if (that === undefined) return new Rational(- this.#numerator, this.#denominator);
    else if (this.#isZero()) return new Rational(- that.#numerator, that.#denominator);
    else if (that.#isZero()) return this;
    else {
      if (this.#denominator === that.#denominator) {
        return new Rational(this.#numerator - that.#numerator, this.#denominator);
      } else {
        const newNumerator = this.#numerator * that.#denominator - that.#numerator * this.#denominator;
        const newDenominator = this.#denominator * that.#denominator;
        return new Rational(newNumerator, newDenominator);
      }
    }
  }

  multiply(that = undefined) {
    Rational.#validateArgumentExistence(that);
    Rational.#validateArgumentType(that);

    if (this.#isZero() || that.#isZero()) return new Rational(0, 1);
    else {
      const gcd1 = Rational.#gcd(this.#numerator, that.#denominator);
      const gcd2 = Rational.#gcd(that.#numerator, this.#denominator);

      const newNumerator = (this.#numerator / gcd1) * (that.#numerator / gcd2);
      const newDenominator = (this.#denominator / gcd2) * (that.#denominator / gcd1);

      return new Rational(newNumerator, newDenominator);
    }
  }

  divide(that = undefined) {
    Rational.#validateArgumentExistence(that);
    Rational.#validateArgumentType(that);

    if (that.#isZero()) throw new Error("Division by 0 is not permitted");
    else if (this.#isZero()) return this;
    else {
      const gcd1 = Rational.#gcd(this.#numerator, that.#numerator);
      const gcd2 = Rational.#gcd(that.#denominator, this.#denominator);

      const newNumerator = (this.#numerator / gcd1) * (that.#denominator / gcd2);
      const newDenominator = (this.#denominator / gcd2) * (that.#numerator / gcd1);

      return new Rational(newNumerator, newDenominator);
    }
  }

  promoteToReal() {
    return new Real(this.#numerator / this.#denominator);
  }

  toString() {
    if (this.#denominator === 1) return `${this.#numerator}`;
    else return `${this.#numerator} / ${this.#denominator}`;
  }

  getLevel() {
    return 2;
  }

  getType() {
    return 'Rational';
  }

  isNumber() {
    return true;
  }

  isOperator() {
    return false;
  }

  #isZero() {
    return this.#numerator === 0;
  }

  static #gcd(x, y) {
    x = Math.abs(x);
    y = Math.abs(y);
    return Rational.#gcdHelper(x, y);
  }

  static #gcdHelper(x, y) {
    if (y === 0) return x;
    else return Rational.#gcdHelper(y, x % y)
  }

  static #validateArgumentType(that) {
    if (that !== undefined && !(that instanceof Rational)) {
      throw new TypeError("Argument is not an instance of Rational");
    }
  }

  static #validateArgumentExistence(that) {
    if (that === undefined) {
      throw new Error("method must have an argument")
    }
  }

}



class Real {

  #value;

  constructor(value) {
    if (typeof value !== "number") throw new Error("real constructor must have a number argument");
    if (value >= Number.MAX_VALUE) throw new Error("number overflow (number is too large)");
    if (-value >= Number.MAX_VALUE) throw new Error("number underflow (negative number is too large)");

    this.#value = value;
  }

  // add can be unary or binary
  add(that = undefined) {
    Real.#validateArgumentType(that);

    if (that === undefined) return this;
    else return new Real(this.#value + that.#value);
  }

  // subtract can be unary or binary
  subtract(that = undefined) {
    Real.#validateArgumentType(that);

    if (that === undefined) return new Real(- this.#value);
    else return new Real(this.#value - that.#value);
  }

  // multiply is a binary operation
  multiply(that = undefined) {
    Real.#validateArgumentExistence(that);
    Real.#validateArgumentType(that);

    return new Real(this.#value * that.#value);
  }

  // divide is a binary operation
  divide(that = undefined) {
    Real.#validateArgumentExistence(that);
    Real.#validateArgumentType(that);
    if (that.#value === 0) throw new Error("Division by 0 is not permitted");

    return new Real(this.#value / that.#value);
  }

  toString() {
    return this.#value.toString();
  }

  getLevel() {
    return 3;
  }

  getType() {
    return 'Real';
  }

  isNumber() {
    return true;
  }

  isOperator() {
    return false;
  }

  static #validateArgumentType(that) {
    if (that !== undefined && !(that instanceof Real)) {
      throw new TypeError("Argument is not an instance of Real");
    }
  }

  static #validateArgumentExistence(that) {
    if (that === undefined) {
      throw new Error("method must have an argument")
    }
  }
}

function createElement(type, attributes = {}) {
  const element = document.createElement(type);
  for (const key in attributes) {
    if (key === "class") {
        const classArray = attributes["class"];
        for (let i = 0; i < classArray.length; i++) {
          element.classList.add(classArray[i]);
        }
    } else {
      element.setAttribute(key, attributes[key]);
    }
  }
  return element;
}


let calculator = new Calculator();
initializePage();

function initializePage() {
  let inputButtons = document.querySelectorAll('.input-button');
  for (let i = 0; i < inputButtons.length; i++) {
    const currentButton = inputButtons.item(i);
    currentButton.addEventListener('click', () => calculator.addInput(currentButton.textContent));
  }
  document.querySelector('#backpace-button').addEventListener('click', () => calculator.removeInput());
  document.querySelector('#clear-button').addEventListener('click', () => calculator.clear());
  document.querySelector('#clear-all-button').addEventListener('click', () => calculator.clearAll());
  document.querySelector('#evaluate-button').addEventListener('click', () => calculator.evaluateInput());
  // document.querySelector('#display-input').addEventListener('change', () => calculator.evaluateInput());
  document.addEventListener('keyup', (e) => {if (e.key === 'Enter') calculator.evaluateInput()});
  document.querySelector('#go-left-button').addEventListener('click', () => calculator.goLeft());
  document.addEventListener('keyup', (e) => {if (e.key === 'ArrowLeft' && calculator.isFinishedCalcWindow()) calculator.goLeft()});
  document.querySelector('#go-up-button').addEventListener('click', () => calculator.goToBeforeCalcWindow());
  document.addEventListener('keyup', (e) => {if (e.key === 'ArrowUp') calculator.goToBeforeCalcWindow()});
  document.querySelector('#go-down-button').addEventListener('click', () => calculator.goToNextCalcWindow());
  document.addEventListener('keyup', (e) => {if (e.key === 'ArrowDown') calculator.goToNextCalcWindow()});
  document.querySelector('#go-right-button').addEventListener('click', () => calculator.goRight());
  document.addEventListener('keyup', (e) => {if (e.key === 'ArrowRight' && calculator.isFinishedCalcWindow()) calculator.goRight()});
  document.addEventListener('keydown', (e) => {if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === ' ') e.preventDefault()});
  document.addEventListener('keydown', (e) => {if (calculator.isValidInputChar(e.key) && calculator.isFinishedCalcWindow()) {e.preventDefault(); calculator.addInput(e.key);}});
}