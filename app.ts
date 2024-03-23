type Combinable = number | string;
type conversionDescriptor = "as-number" | "as-text";

function combine(
  input1: Combinable,
  input2: Combinable,
  resultConversion: conversionDescriptor
) {
  let result;
  if (
    (typeof input1 === "number" && typeof input2 === "number") ||
    resultConversion === "as-number"
  ) {
    result = +input1 + +input2;
  } else {
    result = input1.toString() + input2.toString();
  }
  return result;
}

const numbs: [number, number] = [4, 6];
const strs: [string, string] = ["hello ", "typescript"];

console.log(combine(strs[0], strs[1], "as-text"));
console.log(combine(numbs[0], numbs[1], "as-number"));

function add(n1: number, n2: number) {
  return n1 + n2;
}

console.log(add(1, 2));
function printAddResult(n1: number, n2: number): void {
  console.log("result " + (n1 + n2));
}

let userInput: unknown;
let userName: string;

userName = "my user name";
// userName = userInput // this raises error can't assign unknown type to other types
if (typeof userInput === "string") {
  userName = userInput;
}
console.log(userName);

printAddResult(1, 14);

// inheritance
abstract class Department {
  protected employees: string[] = [];
  constructor(protected readonly id: string, public name: string) {}
  static fiscalYear = 2020;

  // abstract method
  abstract describe(this: Department): void;

  static createEmployee(name: string) {
    return { name };
  }

  addEmployee(employee: string) {
    this.employees.push(employee);
  }

  printEmployeeInformation() {
    console.log(this.employees.length);
    console.log(this.employees);
  }
}

// const accounting = new Department('d1', 'accounting');

// accounting.addEmployee("Daniel");
// accounting.addEmployee("Emmanuel");

class ITDepartment extends Department {
  constructor(protected id: string, public admins: string[]) {
    super(id, "IT");
  }

  // abstract base class inheritance
  describe(this: ITDepartment): void {
    console.log(`IT department - ID: ${this.id}`);
  }
}

class AccountingDepartment extends Department {
  private static instance: AccountingDepartment;

  private constructor(protected id: string, private reports: string[]) {
    super(id, "Accounting");
  }

  static getInstance(id: string, reports: string[]) {
    if (this.instance) return this.instance;
    return new AccountingDepartment(id, reports);
  }

  addEmployee(name: string) {
    if (name === "Daniel") {
      return;
    }
    this.employees.push(name);
  }

  addReport(text: string) {
    this.reports.push(text);
  }

  printReports() {
    console.log(this.reports);
  }

  // abstract base class inheritance
  describe(this: AccountingDepartment): void {
    console.log(`Accounting department - ID: ${this.id}`);
  }
}

const accounting = AccountingDepartment.getInstance("id2", []);
const accounting2 = AccountingDepartment.getInstance("id2", []);
console.log(accounting, accounting2);

accounting.addReport("something went wrong");
accounting.printReports();

//static methods and properties
const employee1 = Department.createEmployee("Hazel");
console.log(employee1, Department.fiscalYear);

// typing functions with interfaces
interface greeter {
  (salut: string): void;
}

// typing functions with custom types
// type greeter = (salut: string) => void;

// interface inheritance
interface Named {
  name: string;
}

interface Greetable extends Named {
  greet: greeter;
}
interface Person extends Greetable {
  about?: string;
  readonly age: number;
  notes?: () => string;
}

class Professional implements Person {
  constructor(
    public name: string,
    public age: number,
    public job: string,
    public about?: string
  ) {}

  greet(salut: string) {
    console.log(
      `${salut}!, my name is ${this.name} and ${
        this.about ? this.about : "passionate"
      }. I work as a ${this.job}`
    );
  }
}

let Hazel: Person;
Hazel = new Professional(
  "Hazel",
  4,
  "software engineer",
  "i am a 6 foot guy that loves making the world a better place"
);
Hazel.greet("Hi");

const holla: (input: string) => void = (input: string) => {
  return "input";
};

interface Creature {
  type: string;
}

interface Bird extends Creature {
  type: "bird";
  flyingSpeed: number;
}

interface Animal extends Creature {
  //discriminated unions
  type: "animal";
  runningSpeed: number;
}

// union types
type VaryingCreature = Animal | Bird;

let varyingCreature: VaryingCreature = {
  //discriminated unions
  type: "animal",
  runningSpeed: 2,
};

function setSpeed(creature: VaryingCreature) {
  if (creature.type === "bird") {
    creature.flyingSpeed = 120;
  } else {
    creature.runningSpeed = 80;
  }
}

setSpeed(varyingCreature);
// console.log(varyingCreature);

function WithTemplate() {
  return function <T extends { new (...args: any[]): { name: string } }>(
    oldConstructor: T,
    ..._: any[]
  ) {
    return class extends oldConstructor {
      constructor(..._: any[]) {
        super(_);
        const h2Tag = document.createElement("h2");
        h2Tag.innerHTML = this.name;
        document.body.appendChild(h2Tag);
      }
    };
  };
}

@WithTemplate()
class PersonDec {
  constructor(public name: string) {}
}

const personDec1 = new PersonDec("Hazel");
const personDec2 = new PersonDec("Hazel@gmail.com");
const personDec3 = new PersonDec("Daniel");
const personDec4 = new PersonDec("olaleyedaniel2000@gmail.com");
