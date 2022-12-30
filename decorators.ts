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
  console.log(target, name, position);
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
@Logger1("hazel is a person")
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

function Autobind(
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
  @Autobind
  printWork(this: Printer) {
    console.log(this.work);
  }
}

const printer = new Printer("it works!");

const buttonEl = document.querySelector("button")! as HTMLButtonElement;

buttonEl.addEventListener("click", printer.printWork);
