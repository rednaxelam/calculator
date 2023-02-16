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

  // add can be unary or binary
  add(that = undefined) {
    Integer.#validateArgumentType(that);

    if (that === undefined) return this;
    else return new Integer(this.#value + that.#value);
  }

  // subtract can be unary or binary
  subtract(that = undefined) {
    Integer.#validateArgumentType(that);

    if (that === undefined) return new Integer(- this.#value);
    else return new Integer(this.#value - that.#value);
  }

  // multiply is a binary operation
  multiply(that = undefined) {
    Integer.#validateArgumentExistence(that);
    Integer.#validateArgumentType(that);

    return new Integer(this.#value * that.#value);
  }

  // divide is a binary operation
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
    if (value >= Number.MAX_VALUE) throw new Error("Number overflow/underflow");
    if (-value >= Number.MAX_VALUE) throw new Error("number underflow (negative number is too large)");

    this.#value = value;
  }

  add(that = undefined) {
    Real.#validateArgumentType(that);

    if (that === undefined) return this;
    else return new Real(this.#value + that.#value);
  }

  subtract(that = undefined) {
    Real.#validateArgumentType(that);

    if (that === undefined) return new Real(- this.#value);
    else return new Real(this.#value - that.#value);
  }

  multiply(that = undefined) {
    Real.#validateArgumentExistence(that);
    Real.#validateArgumentType(that);

    return new Real(this.#value * that.#value);
  }

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


class Node {

  value = null;
  next = null;
  before = null;

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
        throw new Error("Binary operator must have two arguments");
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


function tokenizeExpression(str) {

  // this helper function takes it for granted that numberStr will only contain numeric characters, and at most one period character
  function convertNumberStringToNumber(numberStr) {
    if (!(numberStr.includes('.') || includesNumericExtraChar(numberStr))) {
      return new Integer(Number(numberStr));
    } else {
      if (numberStr.length === 1) {
        throw new Error(`Invalid number token: ${numberStr}`);
      } else if (numberStr.includes('e') || numberStr.includes('+') || numberStr.includes('-')) {
        if ((!numberStr.includes('e+') && !numberStr.includes('e-'))) {
          throw new Error(`Invalid number token: ${numberStr}`);
        } else if (numberStr.includes('e+') && numberStr.includes('e-')) {
          throw new Error(`Invalid number token: ${numberStr}`);
        }
        
        let numberComponents = null;
        if (numberStr.includes('e+')) {
          numberComponents = numberStr.split('e+');
        } else {
          numberComponents = numberStr.split('e-');
        }
        if (numberComponents.length !== 2) {
          throw new Error(`Invalid number token: ${numberStr}`);
        } else if (numberComponents[0].length === 0 || numberComponents[0].length === 0) {
          throw new Error(`Invalid number token: ${numberStr}`);
        } else if (includesNumericExtraChar(numberComponents[0]) || includesNumericExtraChar(numberComponents[1])) {
          throw new Error(`Invalid number token: ${numberStr}`);
        } else if (numberComponents[0].length === 1 && numberComponents[0].includes('.')) {
          throw new Error(`Invalid number token: ${numberStr}`);
        } else if (numberComponents[1].includes('.')) {
          throw new Error(`Invalid number token: ${numberStr}`);
        }
        return new Real(Number(numberStr));
      } else {
        return new Real(Number(numberStr));
      }
    }
  }

  function includesNumericExtraChar(numberStr) {
    return numberStr.includes('e') || numberStr.includes('+') || numberStr.includes('-');
  }

  const validChars = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', '(', ')', ' ', 'e']);
  const numericChars = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']);
  const numericExtraChars = new Set(['e', '+', '-']);
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
    
    let isNumericExtraCharFlag = false;
    if (!numericChars.has(currentChar)) {
      if (numberStringActive) {
        if ((currentChar === '+' || currentChar === '-') && str.charAt(currentIndex - 1) === 'e') {
          numberString += currentChar;
          isNumericExtraCharFlag = true;
        } else if (currentChar === 'e') {
          numberString += currentChar;
          isNumericExtraCharFlag = true;
        } else if (dotCounter > 1) {
          throw new Error(`Invalid token: ${numberString}`)
        } else {
          tokenList.append(convertNumberStringToNumber(numberString));
          numberString = '';
          dotCounter = 0;
          numberStringActive = false;
        }
      } else if (currentChar === 'e') {
        throw new Error(`Invalid token: ${currentChar}`);
      }
      
      if (operatorChars.has(currentChar) && !isNumericExtraCharFlag) {
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
    if (!this.#end.value.isFinishedCalcWindow()) throw new Error("Append should not be called if end CalcWindow is unfinished");
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
    if (this.#end.value.isFinishedCalcWindow()) throw new Error("goToEndCalcWindow should not be called if end CalcWindow is finished");
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


class Calculator {

  static #validInputChars = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', '(', ')', ' ']);
  static #validVariableChars = ['x', 'y', 'z', 'X', 'Y', 'Z'];

  #calcWindowList = new CalcWindowList();
  #ans = null;
  #x = null;
  #y = null;
  #z = null;
  #storageEnabled = false;
  #inputDisplay = document.querySelector("#display-input");
  #outputDisplay = document.querySelector("#display-output");

  addInput(input) {
    if (!this.#calcWindowList.isFinishedCalcWindow()) {
      this.clearOutputDisplay();
      let insertionPoint = this.#inputDisplay.selectionStart;
      if (this.#inputDisplay.value.length + input.length >= 27) return;
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
      this.#calcWindowList.goToEndCalcWindow(`ANS${input}`);
      this.clearOutputDisplay();
      this.makeInputDisplayEditable();
      this.#inputDisplay.value = this.#calcWindowList.getInputString();
      this.#inputDisplay.setSelectionRange(this.#inputDisplay.value.length, this.#inputDisplay.value.length);
      this.disableStorage();
    } else {
      this.#calcWindowList.goToEndCalcWindow(`${input}`);
      this.clearOutputDisplay();
      this.makeInputDisplayEditable();
      this.#inputDisplay.value = this.#calcWindowList.getInputString();
      this.#inputDisplay.setSelectionRange(this.#inputDisplay.value.length, this.#inputDisplay.value.length);
      this.disableStorage();
    }
  }

  removeInput() {
    let oldInputString = this.#inputDisplay.value;
    let newInputString = '';
    if (!this.#calcWindowList.isFinishedCalcWindow()) {
      this.clearOutputDisplay();
      if (this.#inputDisplay.selectionEnd !== this.#inputDisplay.selectionStart) {
        let selectionStart = this.#inputDisplay.selectionStart;
        let selectionEnd = this.#inputDisplay.selectionEnd;
        if (selectionStart === 0 && selectionEnd === oldInputString.length) {
          newInputString = '';
        } else if (selectionStart === 0) {
          newInputString = oldInputString.substring(selectionEnd, oldInputString.length);
        } else if (selectionEnd === oldInputString.length) {
          newInputString = oldInputString.substring(0, selectionStart);
        } else {
          newInputString = oldInputString.substring(0, selectionStart) + oldInputString.substring(selectionEnd, oldInputString.length);
        }
        this.#inputDisplay.value = newInputString;
        this.#inputDisplay.setSelectionRange(selectionStart, selectionStart);
        return;
      }
      
      let deletionPoint = this.#inputDisplay.selectionStart;
      
      if (deletionPoint === 0) {

      } else if (deletionPoint === oldInputString.length) {
        const currentChar = oldInputString.charAt(oldInputString.length - 1);
        if (currentChar === 'S' || currentChar === 's') {
          if (oldInputString.length >= 3 && oldInputString.substring(oldInputString.length - 3, oldInputString.length).toLowerCase() === 'ans') {
            newInputString = oldInputString.substring(0, oldInputString.length - 3);
          } else {
            newInputString = oldInputString.substring(0, oldInputString.length - 1);
          }
        } else {
          newInputString = oldInputString.substring(0, oldInputString.length - 1);
        }
        this.#inputDisplay.value = newInputString;
        this.#inputDisplay.setSelectionRange(newInputString.length, newInputString.length);
      } else {
        const currentChar = oldInputString.charAt(deletionPoint - 1);
        if (currentChar === 'S' || currentChar === 's') {
          if (deletionPoint >= 3 && oldInputString.substring(deletionPoint - 3, deletionPoint).toLowerCase() === 'ans') {
            newInputString = oldInputString.substring(0, deletionPoint - 3) + oldInputString.substring(deletionPoint, oldInputString.length);
            this.#inputDisplay.value = newInputString;
            this.#inputDisplay.setSelectionRange(deletionPoint - 3, deletionPoint - 3);
          } else {
            newInputString = oldInputString.substring(0, deletionPoint - 1) + oldInputString.substring(deletionPoint, oldInputString.length);
            this.#inputDisplay.value = newInputString;
            this.#inputDisplay.setSelectionRange(deletionPoint - 1, deletionPoint - 1);
          }
        } else {
          newInputString = oldInputString.substring(0, deletionPoint - 1) + oldInputString.substring(deletionPoint, oldInputString.length);
          this.#inputDisplay.value = newInputString;
          this.#inputDisplay.setSelectionRange(deletionPoint - 1, deletionPoint - 1);
        }
      }
    } else {
      this.#calcWindowList.goToEndCalcWindow(this.#calcWindowList.getInputString());
      this.clearOutputDisplay();
      this.makeInputDisplayEditable();
      this.#inputDisplay.setSelectionRange(this.#inputDisplay.value.length, this.#inputDisplay.value.length);
      this.disableStorage();
      this.removeInput();
    }
  }

  goLeft() {
    if (!this.#calcWindowList.isFinishedCalcWindow()) {
      this.clearOutputDisplay();
      let currentSelectionIndex = this.#inputDisplay.selectionStart;
      if (currentSelectionIndex !== 0) {
        if (currentSelectionIndex >= 3) {
          if (this.#inputDisplay.value.substring(currentSelectionIndex - 3, currentSelectionIndex).toLowerCase() === 'ans') {
            this.#inputDisplay.setSelectionRange(currentSelectionIndex - 3, currentSelectionIndex - 3);
          } else {
            this.#inputDisplay.setSelectionRange(currentSelectionIndex - 1, currentSelectionIndex - 1);
          }
        
        } else {
          this.#inputDisplay.setSelectionRange(currentSelectionIndex - 1, currentSelectionIndex - 1);
        }
      }
    } else {
      this.#calcWindowList.goToEndCalcWindow(this.#inputDisplay.value);
      this.clearOutputDisplay();
      this.makeInputDisplayEditable();
      this.#inputDisplay.setSelectionRange(this.#inputDisplay.value.length, this.#inputDisplay.value.length);
      this.disableStorage();
    }
  }

  goRight() {
    if (!this.#calcWindowList.isFinishedCalcWindow()) {
      this.clearOutputDisplay();
      const inputLength = this.#inputDisplay.value.length;
      const currentSelectionIndex = this.#inputDisplay.selectionStart;
      if (currentSelectionIndex !== inputLength) {
        if (((inputLength - currentSelectionIndex) >= 3) && (this.#inputDisplay.value.substring(currentSelectionIndex, currentSelectionIndex + 3).toLowerCase() === 'ans')) {
          this.#inputDisplay.setSelectionRange(currentSelectionIndex + 3, currentSelectionIndex + 3);
        } else {
          this.#inputDisplay.setSelectionRange(currentSelectionIndex + 1, currentSelectionIndex + 1);
        }
      }
    } else {
      this.#calcWindowList.goToEndCalcWindow(this.#inputDisplay.value);
      this.clearOutputDisplay();
      this.makeInputDisplayEditable();
      this.#inputDisplay.setSelectionRange(this.#inputDisplay.value.length, this.#inputDisplay.value.length);
      this.disableStorage();
    }
  }

  evaluateInput() {
    
    let inputString = this.#inputDisplay.value;
    
    if (this.#calcWindowList.isFinishedCalcWindow()) {
      let canEvaluateAgain = false;
      for (const char of Calculator.#validVariableChars) {
        if (inputString.includes(char)) {
          canEvaluateAgain = true;
        }
      }
      if (inputString.toLowerCase().includes('ans')) {
        canEvaluateAgain = true;
      }

      if (!canEvaluateAgain) {
        return;
      } else {
        this.#calcWindowList.goToEndCalcWindow(this.#inputDisplay.value);
        this.clearOutputDisplay();
        this.makeInputDisplayEditable();
        this.disableStorage();
        this.#inputDisplay.value = this.#calcWindowList.getInputString();
      }
    }

    let result = null;
    try {
      for (let i = 0; i < Calculator.#validVariableChars.length; i++) {
        let char = Calculator.#validVariableChars[i];
        if (inputString.includes(char)) {
          if (this[`#${char.toLowerCase()}`] === undefined) {
            throw new Error(`Variable ${char} does not store a value`);
          } else {
            const replaceWith = '(' + (this[`#${char.toLowerCase()}`].toString()) + ')';
            inputString = inputString.replaceAll(char, replaceWith);
          }
        }
      }
      inputString = inputString.toLowerCase();
      if (inputString.includes('ans')) {
        if (this.#ans === null) {
          throw new Error("ANS does not currently store a value");
        }
        const replaceWith = '(' + (this.#ans.toString()) + ')';
        inputString = inputString.replaceAll('ans', replaceWith);
      }
      result = evaluate(inputString);
      this.#calcWindowList.setOutputValue(result);
      this.#calcWindowList.setInputString(this.#inputDisplay.value);
      this.#calcWindowList.setIsFinishedCalcWindow(true);
      this.#calcWindowList.append();
      this.makeInputDisplayReadOnly();
      this.disableStorage();
      this.#ans = result;
    } catch (error) {
      result = error.message;
    }
    this.setOutputDisplay(`${result}`);
  }

  clearOutputDisplay() {
    while (this.#outputDisplay.hasChildNodes()) {
      this.#outputDisplay.removeChild(this.#outputDisplay.firstChild);
    }
    this.#outputDisplay.appendChild(createElement('p'));
    document.querySelector('#change-output-format-button').classList.remove('change-format-enabled');
    document.querySelector('#change-output-format-button').classList.add('change-format-disabled');
  }

  setOutputDisplay(outputString) {
    this.clearOutputDisplay();
    this.#outputDisplay.removeChild(this.#outputDisplay.firstElementChild);
    if (this.#calcWindowList.isFinishedCalcWindow() && outputString.includes('/')) {
      let resultElement = createElement('div', {'style': 'display: flex; align-items: center;'});
      let numComponents = outputString.split(' / ');
      let hasMinusChar = numComponents[0].includes('-');
      if (hasMinusChar) {
        numComponents[0] = numComponents[0].substring(1, numComponents[0].length);
        let minusElement = createElement('div');
        minusElement.textContent = '-';
        resultElement.appendChild(minusElement);
      }
      let fractionalComponent = createElement('div', {'style': 'display: flex; flex-direction: column; align-items: stretch;'});
      let numerator = createElement('div', {'style': 'border-bottom: 1px solid black; text-align: center;'});
      numerator.textContent = numComponents[0];
      let denominator = createElement('div', {'style': 'text-align: center;'});
      denominator.textContent = numComponents[1];
      fractionalComponent.append(numerator, denominator);
      resultElement.appendChild(fractionalComponent);
      this.#outputDisplay.appendChild(resultElement);
      document.querySelector('#change-output-format-button').classList.remove('change-format-disabled');
      document.querySelector('#change-output-format-button').classList.add('change-format-enabled');
      document.querySelector('#change-output-format-button').setAttribute('data-format-value', '1');
    } else {
      let resultElement = createElement('p');
      let outputComponents = null;
      if (this.#calcWindowList.isFinishedCalcWindow()) {
        if (outputString.includes('e+')) {
          outputComponents = outputString.split('e+');
        } else if (outputString.includes('e-')) {
          outputComponents = outputString.split('e-');
        } else {
          outputComponents = [outputString];
        }
        if (outputComponents[0].includes('.')) {
          if (outputComponents[0].length >= 16) {
            outputString = `${Number(outputString).toPrecision(14)}`;
          }
        } else if (outputComponents[0].length >= 15) {
          outputString = `${Number(outputString).toPrecision(14)}`;
        }
      }
      
      let exponentElement = null;
      if (this.#calcWindowList.isFinishedCalcWindow() && outputString.includes('e+')) {
        outputComponents = outputString.split('e+');
        resultElement.textContent = outputComponents[0] + '*10';
        exponentElement = createElement('div', {'style': 'padding-bottom: 20px; font-size: 20px;'});
        exponentElement.textContent = `${outputComponents[1]}`;
      } else if (this.#calcWindowList.isFinishedCalcWindow() && outputString.includes('e-')) {
        outputComponents = outputString.split('e-');
        resultElement.textContent = outputComponents[0] + '*10';
        exponentElement = createElement('div', {'style': 'padding-bottom: 20px; font-size: 20px;'});
        exponentElement.textContent = `-${outputComponents[1]}`;
      } else {
        resultElement.textContent = outputString;
      }
      this.#outputDisplay.appendChild(resultElement);
      if (exponentElement !== null) {
        this.#outputDisplay.appendChild(exponentElement);
      }
      document.querySelector('#change-output-format-button').classList.remove('change-format-enabled');
      document.querySelector('#change-output-format-button').classList.add('change-format-disabled');
      document.querySelector('#change-output-format-button').removeAttribute('data-format-value');
    }
  }

  changeFormat() {
    let formatButton = document.querySelector('#change-output-format-button');
    if (formatButton.classList.contains('change-format-disabled')) {
      return;
    } else {
      let resultString = this.#calcWindowList.getOutputValue().toString();
      let resultElement = createElement('div', {'style': 'display: flex; align-items: center;'});
      let numComponents = resultString.split(' / ');
      let hasMinusChar = numComponents[0].includes('-');
      if (hasMinusChar) {
        numComponents[0] = numComponents[0].substring(1, numComponents[0].length);
        let minusElement = createElement('div');
        minusElement.textContent = '-';
        resultElement.appendChild(minusElement);
      }

      let continueFlag = false;
      if (formatButton.getAttribute('data-format-value') === '1') {
        if (Number(numComponents[0]) < Number(numComponents[1])) {
          continueFlag = true;
        } else {
          let integerPart = `${Math.floor(Number(numComponents[0]) / Number(numComponents[1]))}`;
          let integerElement = createElement('div');
          integerElement.textContent = integerPart;
          resultElement.appendChild(integerElement);

          numComponents[0] = `${Number(numComponents[0]) % Number(numComponents[1])}`;
          let fractionalComponent = createElement('div', {'style': 'display: flex; flex-direction: column; align-items: stretch;'});
          let numerator = createElement('div', {'style': 'border-bottom: 1px solid black; text-align: center;'});
          numerator.textContent = numComponents[0];
          let denominator = createElement('div', {'style': 'text-align: center;'});
          denominator.textContent = numComponents[1];
          fractionalComponent.append(numerator, denominator);

          resultElement.appendChild(fractionalComponent);
          continueFlag = false;
        }
      }
      if (formatButton.getAttribute('data-format-value') === '2' || continueFlag) {
        resultElement = createElement('div', {'style': 'display: flex; align-items: flex-end;'});
        let decimalValue = `${Number(numComponents[0]) / Number(numComponents[1])}`
        let decimalValueElement = createElement('div');
        let decimalValueComponents = null;
        if (decimalValue.includes('e+')) {
          decimalValueComponents = decimalValue.split('e+');
        } else if (decimalValue.includes('e-')) {
          decimalValueComponents = decimalValue.split('e-');
        } else {
          decimalValueComponents = [decimalValue];
        }
        
        
        if (decimalValueComponents[0].includes('.')) {
          if (decimalValueComponents[0].length >= 16) {
            decimalValue = `${Number(decimalValue).toPrecision(14)}`;
          }
        } else if (decimalValueComponents[0].length >= 15) {
          decimalValue = `${Number(decimalValue).toPrecision(14)}`;
        }

        let exponentElement = null;
        
        if (decimalValue.includes('e+')) {
          decimalValueComponents = decimalValue.split('e+');
          decimalValueElement.textContent = decimalValueComponents[0] + '*10';
          exponentElement = createElement('div', {'style': 'padding-bottom: 17px; font-size: 20px;'});
          exponentElement.textContent = `${decimalValueComponents[1]}`;
        } else if (decimalValue.includes('e-')) {
          decimalValueComponents = decimalValue.split('e-');
          decimalValueElement.textContent = decimalValueComponents[0] + '*10';
          exponentElement = createElement('div', {'style': 'padding-bottom: 17px; font-size: 20px;'});
          exponentElement.textContent = `-${decimalValueComponents[1]}`;
        } else {
          decimalValueElement.textContent = decimalValue;
        }
        resultElement.appendChild(decimalValueElement);
        if (exponentElement !== null) {
          resultElement.appendChild(exponentElement);
        }
      }
      if (formatButton.getAttribute('data-format-value') === '3') {
        let fractionalComponent = createElement('div', {'style': 'display: flex; flex-direction: column; align-items: stretch;'});
        let numerator = createElement('div', {'style': 'border-bottom: 1px solid black; text-align: center;'});
        numerator.textContent = numComponents[0];
        let denominator = createElement('div', {'style': 'text-align: center;'});
        denominator.textContent = numComponents[1];
        fractionalComponent.append(numerator, denominator);
        resultElement.appendChild(fractionalComponent);
      }

      this.clearOutputDisplay();
      document.querySelector('#change-output-format-button').classList.remove('change-format-disabled');
      document.querySelector('#change-output-format-button').classList.add('change-format-enabled');
      this.#outputDisplay.removeChild(this.#outputDisplay.firstElementChild);
      this.#outputDisplay.appendChild(resultElement);


      if (formatButton.getAttribute('data-format-value') === '2' || continueFlag) {
        formatButton.setAttribute('data-format-value', '3');
      } else if (formatButton.getAttribute('data-format-value') === '3') {
        formatButton.setAttribute('data-format-value', '1');
      } else {
        formatButton.setAttribute('data-format-value', '2');
      }
    }
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
      if (!this.#calcWindowList.isFinishedCalcWindow()) {
        this.#calcWindowList.setInputString(this.#inputDisplay.value);
      }
      this.#calcWindowList.goToBeforeCalcWindow();
      this.makeInputDisplayReadOnly();
      this.#inputDisplay.value = this.#calcWindowList.getInputString();
      this.setOutputDisplay(`${this.#calcWindowList.getOutputValue()}`);
      this.disableStorage();
    }
  }

  hasNextCalcWindow() {
    return this.#calcWindowList.hasNextCalcWindow();
  }

  goToNextCalcWindow() {
    if (this.hasNextCalcWindow()) {
      this.#calcWindowList.goToNextCalcWindow();
      this.disableStorage();
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

  isValidVariableChar(char) {
    return Calculator.#validVariableChars.includes(char);
  }

  clear() {
    if (this.#calcWindowList.isFinishedCalcWindow()) {
      this.#calcWindowList.goToEndCalcWindow('');
      this.makeInputDisplayEditable();
      this.disableStorage();
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
    this.disableStorage();
  }

  isStorageEnabled() {
    return this.#storageEnabled;
  }

  toggleStorage() {
    if (!this.isFinishedCalcWindow()) {
      return;
    } else if (this.#storageEnabled) {
      this.#storageEnabled = false;
      document.querySelector('#store-variable-button').classList.remove('storage-active');
      document.querySelector('#store-variable-button').classList.add('storage-inactive');
    } else {
      this.#storageEnabled = true;
      document.querySelector('#store-variable-button').classList.remove('storage-inactive');
      document.querySelector('#store-variable-button').classList.add('storage-active');
    }
  }

  disableStorage() {
    this.#storageEnabled = false;
    document.querySelector('#store-variable-button').classList.remove('storage-active');
    if (this.isFinishedCalcWindow()) {
      document.querySelector('#store-variable-button').classList.remove('storage-disabled');
      document.querySelector('#store-variable-button').classList.add('storage-inactive');
    } else {
      document.querySelector('#store-variable-button').classList.remove('storage-inactive');
      document.querySelector('#store-variable-button').classList.add('storage-disabled');
    }
  }

  storeInVariable(varChar) {
    this[`#${varChar}`.toLowerCase()] = this.#calcWindowList.getOutputValue();
    let assignmentText = createElement('p');
    assignmentText.textContent = `${varChar.toUpperCase()}=`;
    assignmentText.setAttribute('data-variable-assignment-string', 'true');
    if (this.#outputDisplay.firstElementChild.hasAttribute('data-variable-assignment-string')) {
      this.#outputDisplay.removeChild(this.#outputDisplay.firstElementChild);
    }
    this.#outputDisplay.insertBefore(assignmentText, this.#outputDisplay.firstElementChild);
    this.disableStorage();
  }

  useVariable(varChar) {
    if (this.#storageEnabled) {
      this.storeInVariable(varChar);
    } else {
      this.addInput(varChar);
    }
  }
}


function initializePage() {
  let inputButtons = document.querySelectorAll('.input-button');
  for (let i = 0; i < inputButtons.length; i++) {
    const currentButton = inputButtons.item(i);
    const inputValue = currentButton.getAttribute('data-value');
    currentButton.addEventListener('click', () => calculator.addInput(inputValue));
  }
  let variableButtons = document.querySelectorAll('.variable-button');
  for (let i = 0; i < variableButtons.length; i++) {
    const current = variableButtons.item(i);
    const variableLetter = current.getAttribute('data-value');
    current.addEventListener('click', () => calculator.useVariable(variableLetter));
  }
  document.querySelector('#backpace-button').addEventListener('click', () => calculator.removeInput());
  document.querySelector('#clear-button').addEventListener('click', () => calculator.clear());
  document.querySelector('#clear-all-button').addEventListener('click', () => calculator.clearAll());
  document.querySelector('#evaluate-button').addEventListener('click', () => calculator.evaluateInput());
  document.querySelector('#go-left-button').addEventListener('click', () => calculator.goLeft());
  document.querySelector('#go-up-button').addEventListener('click', () => calculator.goToBeforeCalcWindow());
  document.querySelector('#go-down-button').addEventListener('click', () => calculator.goToNextCalcWindow());
  document.querySelector('#go-right-button').addEventListener('click', () => calculator.goRight());
  document.querySelector('#store-variable-button').addEventListener('click', () => calculator.toggleStorage());
  document.querySelector('#change-output-format-button').addEventListener('click', () => calculator.changeFormat());
  document.querySelector('#display-input').addEventListener('click', (e) => {if (calculator.isFinishedCalcWindow()) {e.preventDefault(); calculator.goRight()}});
  document.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (e.key === 'ArrowLeft') calculator.goLeft();
    else if (e.key === 'ArrowRight') calculator.goRight();
    else if (e.key === 'ArrowUp') calculator.goToBeforeCalcWindow();
    else if (e.key === 'ArrowDown') calculator.goToNextCalcWindow();
    else if (e.key === 'Backspace') calculator.removeInput();
    else if (calculator.isValidInputChar(e.key)) calculator.addInput(e.key);
    else if (e.key === 'a' || e.key === 'A') calculator.addInput('ANS');
    else if (e.key === 'f' || e.key === 'F') calculator.changeFormat();
    else if (calculator.isValidVariableChar(e.key)) calculator.useVariable(e.key.toUpperCase());
    
  });
  document.addEventListener('keyup', (e) => {
    e.preventDefault();
    if (e.key === 'Enter') calculator.evaluateInput();
    else if (e.key === 's' || e.key === 'S') calculator.toggleStorage();
    else if (e.key === 'c' || e.key === 'C') calculator.clear();
  });
  document.addEventListener('mousemove', (e) => e.preventDefault());
}


let calculator = new Calculator();
initializePage();
