# Calculator

For this project (done as part of The Odin Project Foundations course) I needed to make a calculator, and I ended up adding quite a bit more functionality than was suggested!

The webpage works fairly well when using a modern version of google chrome or firefox on my 22″ 1920x1080 desktop monitor. I aim to make the page more responsive in the future once I've learned more about mobile and responsive design, but for now you might need to zoom in or out and use a laptop or desktop to use the calculator. 

The calculator should hopefully be fairly intuitive for those with experience of using scientific calculators. You can refer to the text below for more information on how the calculator works and how to use it. Also please note that the calculator does not understand implicit multiplication (for example 2(3+4) will throw an error as it will see this as two consecutive numbers). You can view the calculator via the following link: https://rednaxelam.github.io/calculator/

## More Information

The calculator uses a simple interpreter made by myself that takes a string as input, and returns a number as output. You can specify the input string by pressing input buttons or using keypresses. Upon hitting enter or the = button, the string that you've supplied (representing a mathematical expression) will be fed into the interpreter. If the expression supplied is invalid (can't be interpreted in a meaningful way by the interpreter), then a custom error message is displayed. If this is not the case, then the number returned will be used as the basis for what is displayed to you as output.

Expressions must be correctly parenthesized. In this context, this means that every opening bracket must have and precede a corresponding closing bracket. In addition to this, expressions must be in the form:

(optional unary operator) (expression) (binary operator) (expression) ... (binary operator) (expression)

\+ and - can be unary or binary, while / and * are strictly only binary. Expressions can be either a number, or an expression enclosed in brackets (brackets are optional for the base expression). Note that there is not support for implicit multiplication.

There are 3 different types of number that can used in calculations: Integer, Rational, and Real. An Integer can be promoted to either a Rational or a Real number, and a Rational can be promoted to a Real number. Demotion is not possible (although the output display might give the impression that it is possible at times). In the event that the arguments for a binary operation are not of the same type, one of the arguments will be promoted so that they are then both of the same type before performing the operation. 

You can specify an Integer directly by entering a sequence of digits (with no spaces), and a Real by entering a sequence of digits that also includes a single period character (with no spaces). While you can't specify a Rational directly, typing (c / d) or (-c / d) where c and d are Integers will yield the desired Rational.

After an expression has been evaluated with no error, the window that you're on becomes a finished window. You can navigate between finished and unfinished windows by using either ArrowUp and ArrowDown keys or the corresponding buttons on the calculator. 

The result of the last expression that was successfully evaluated is stored in a variable named ANS which can be used in exactly the same way that numbers are used.

The last window is always an unfinished window, and all other windows (if they exist) are finished windows. When on a finished window, adding an operator will take you to the unfinished window and set ANS + operator as the input, going left or right will copy the expression to the unfinished window and go to that window, and other input buttons will go to the unfinished window with that input included.

When on an unfinished window, pressing ArrowLeft or ArrowRight or their corresponding buttons will change the caret position.

When on a finished window, pressing the C (Clear) button or c on the keyboard will take you to the unfinished window and clear all input from it. When on the unfinished window, pressing c will just clear the input.

Pressing the CA (Clear All) button (there is no keybinding for this button) will clear everything.

If you are on a finished window, then the result can be saved to a variable by pressing the s key or the STO button, and then pressing the relevant variable key or button. This variable, like ANS, can then be used in exactly the same way that numbers are used for future calculations.

If a finished window contains ANS or a variable as part of it's input string, then you can attempt to evaluate the input again by pressing enter or the = button. Try entering ANS * ANS and then hit enter repeatedly to see what happens.

If the output of a calculation is displayed as a fraction, then you can cycle through different representations of that fraction by pressing the f key or the F (Format) button next to the output display.
