function performUnaryOperation(x, operator) {
  if (operator === '*' || operator === '/') {
    throw new Error(`${operationNames[operator]} requires two arguments`);
  } else {
    return unaryOperations[operator](x);
  }
}

function performBinaryOperation(x, y, operator) {
  const xConstructor = x.constructor.name;
  const yConstructor = y.constructor.name;
  let xLevel = numberHeirarchy[xConstructor];
  let yLevel = numberHeirarchy[yConstructor];

  if (xLevel < yLevel) {
    x = x[`promoteTo${yConstructor}`]();
  } else if (yLevel < xLevel) {
    y = y[`promoteTo${xConstructor}`]();
  }

  return binaryOperations[operator](x,y);
}

const numberHeirarchy = {"Integer" : 1, "Rational" : 2, "Real" : 3};

const unaryOperations = {
  "+" : x => x.add(),
  "-" : x => x.subtract(),
}

const binaryOperations = {
  "+" : (x, y) => x.add(y),
  "-" : (x, y) => x.subtract(y),
  "*" : (x, y) => x.multiply(y),
  "/" : (x, y) => x.divide(y),
}

const operationNames = {
  "+" : "Addition",
  "-" : "Subtraction",
  "*" : "Multiplication",
  "/" : "Division",
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