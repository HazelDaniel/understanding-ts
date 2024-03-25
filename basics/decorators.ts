/*


// bare class decorators
function Logger(constructor: any) {
  console.log(constructor, "constructor created");
}

// property decorators
function LoggerProp(target: any, propertyName: string | Symbol) {
  console.log(target, propertyName);
}

// Acessor decorators
function LoggerAccess(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
) {
  console.log(target, name, descriptor);
}

// Method decorators
function LoggerMethod(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
) {
  console.log(target, name, descriptor);
}

// Parameter decorators
function LoggerParam(target: any, name: string | Symbol, position: number) {
  // console.log(target, name, position);
  return;
}

// decorator factories
function Logger1(_: string) {
  return function <
    T extends {
      new (...args: any[]): {
        name: string;
      };
    }
  >(constructor: T) {
    const constructed = new constructor("hello world.com");
    console.log(constructed.name);
  };
}

//decorator factories with customized behavior
function Logger1Custom(LoggerString: string) {
  return function <
    T extends {
      new (...args: any[]): {
        name: string;
        location: string;
        publicUrl: string;
      };
    }
  >(originalConstructor: T) {
    return class extends originalConstructor {
      constructor(...args: any[]) {
        super();
        // AIM: run a function in this decorator only if the class has been instantiated
        console.log(LoggerString);
        console.log(args, "arguments");
        const customParag = document.createElement("p");
        customParag.textContent = "hello! created a new element";
        customParag.style.color = "dodgerBlue";
        customParag.style.textTransform = "upperCase";
        document.body.appendChild(customParag);
      }
    };
  };
}

@Logger1Custom("a new class has been instantiated!")
// @Logger1("hazel is a person")
class Person {
  // @LoggerProp // here, the "target" parameter points to the Person prototype
  name: string = "hazel";
  location: string = "Nigeria";
  // @LoggerProp // here, the "target" parameter points to the constructor function
  static PersonName: string = "hazel (static)";
  constructor(public publicUrl: string) {
    // console.log("this is my website " + this.publicUrl);
  }
  // @LoggerAccess
  set setName(a: string) {
    this.name = a;
  }
  // @LoggerMethod
  describeName(this: Person, @LoggerParam _?: string) {
    console.log(
      this.name +
        " is the name given to all objects that are instances of this class"
    );
  }
}

// const hazel = new Person("https://www.google.com");
// hazel.describeName("i don't get it");

// EXERCISE1
// AIM: CREATE AN AUTOBIND PROPERTY DECORATOR THAT AUTOMATICALLY BINDS THE THIS WHEN IN A CALLBACK

function AutoBind(
  _: any,
  _1: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const { value: bindedFunction } = descriptor;
  return {
    configurable: true,
    enumerable: false,
    get() {
      return bindedFunction.bind(this);
    },
  };
}

class Printer {
  constructor(public work: string) {}
  @AutoBind
  printWork(this: Printer) {
    console.log(this.work);
  }
}

const printer = new Printer("it works!");

const buttonEl = document.querySelector("button");

if (!!buttonEl) {
  (buttonEl as HTMLButtonElement).addEventListener("click", printer.printWork);
}

//EXERCISE
//AIM: validate html form inputs with property decorators
interface ValidatorConfig {
  [objPropName: string]: {
    [propName: string]: string[];
  };
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propertyName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propertyName]: ["required"],
  };
}

function shouldBePositive(target: any, propertyName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propertyName]: ["positive"],
  };
  console.log(registeredValidators);
}

function validate(obj: any): boolean {
  const validatedObjConfig = registeredValidators[obj.constructor.name];
  if (!validatedObjConfig) return true;
  let isValidated: boolean = true;
  for (const validateProp in validatedObjConfig) {
    for (const validateValue of validatedObjConfig[validateProp]) {
      switch (validateValue) {
        case "positive":
          isValidated = obj[validateProp] > 0 && isValidated;
          break;
        case "required":
          console.log(obj[validateProp]);
          isValidated = !!obj[validateProp] && isValidated;
          break;
        default:
          console.error("validator not correctly set up!");
          return true;
      }
    }
  }
  console.log(isValidated);
  return isValidated;
}

class Course {
  @shouldBePositive
  price: number;
  @Required
  title: string;
  constructor(p: string, t: string) {
    this.price = +p;
    this.title = t;
  }
}

const coursePriceEl = document.querySelector("input[type='number']");
const courseTitleEl = document.querySelector("input[type='text']");
const courseFormEl = document.querySelector("form");

if (!!coursePriceEl && !!courseTitleEl && !!courseFormEl) {
  (courseFormEl as HTMLFormElement).addEventListener("submit", (e) => {
    e.preventDefault();
    const coursePrice = (coursePriceEl as HTMLInputElement).value;
    const courseTitle = (courseTitleEl as HTMLInputElement).value;
    const newCourse = new Course(coursePrice, courseTitle);
    if (validate(newCourse)) {
      console.log(newCourse);
    } else {
      confirm("course form fields are incorrect!");
    }
  });
}
 */
