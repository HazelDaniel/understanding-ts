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
  constructor(protected id: string, private reports: string[]) {
    super(id, "Accounting");
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

const accounting = new AccountingDepartment("id2", []);

accounting.addReport("something went wrong");
accounting.printReports();

//static methods and properties
const employee1 = Department.createEmployee("Hazel");
console.log(employee1, Department.fiscalYear);
