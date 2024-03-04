type Combinable = number | string
type conversionDescriptor = 'as-number' | 'as-text'

function combine(input1: Combinable, input2: Combinable, resultConversion: conversionDescriptor) {
	let result;
	if (typeof input1 === "number" && typeof input2 === "number" || resultConversion === "as-number") {
		result = +input1 + +input2;
	} else {
		result = input1.toString() + input2.toString()
	}
	return result
}

const numbs: [number, number] = [4, 6]
const strs: [string, string] = ["hello ", "typescript"]

console.log(combine(strs[0], strs[1], "as-text"))
console.log(combine(numbs[0], numbs[1], "as-number"))


function add(n1: number, n2: number) {
  return n1 + n2
}

console.log(add(1, 2));
function printAddResult(n1: number, n2: number): void {
	console.log('result ' + (n1 + n2));
}

let userInput: unknown;
let userName: string;

userName = "my user name";
// userName = userInput // this raises error can't assign unknown type to other types
if (typeof userInput === 'string') {
	userName = userInput;
}
console.log(userName)

printAddResult(1, 14);
