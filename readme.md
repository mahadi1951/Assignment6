1) Difference between var, let, and const:


var: Function-scoped, reassignable, hoisted (initialized as undefined).

let: Block-scoped, reassignable, hoisted (in temporal dead zone).

const: Block-scoped, not reassignable, hoisted (in temporal dead zone).


2) Difference between map(), forEach(), and filter():


forEach(): Iterate array, no return, side-effects only.

map(): Iterate array, returns new array with transformed values.

filter(): Iterate array, returns new array with elements that pass condition.


3) Arrow functions in ES6:


Shorter syntax for functions.

this is lexically scoped.

Cannot be used as constructor.

Example: (a, b) => a + b


4) Destructuring assignment:


Extract values from arrays or objects into variables.

Array: [x, y] = [1, 2]

Object: {name, age} = {name: "Alice", age: 25}

Can rename: {name: userName}


5) Template literals:


Use backticks ` instead of quotes.

Supports variable interpolation: ${variable}

Supports multi-line strings without \n.

Example: `Hello ${name}, you are ${age} years old.`