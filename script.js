class Real {

  #value;

  constructor(value) {
    if (typeof value !== "number") {
      throw new Error("real constructor must have a number argument");
    }
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