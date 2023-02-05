

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