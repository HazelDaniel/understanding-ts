function add (n1: number,n2: number,shouldShowStatement: boolean,statement: string){
    const result = n1 + n2;
    if(shouldShowStatement){
        console.log(statement + result);
    }else{
        return result;
    }
}

let number1 = 5;
const number2 = 2;
const showStatement = true;
const resultStatement = "the result was ";

enum Mode {AUTHOR, READER, UNAUTHORIZED};

const person: { //sub-optimal way
    name: string;
    age: number;
    hobbies: string[];
    role: [number, string];
    mode: number;
} = {
    name: "hazel",
    age: 23,
    hobbies: ["coding","rap"],
    role: [1, "author"], // here , the sub-optimal way shines in the sense that you cannot assign an item in an array to a type it isn't
    mode: Mode.READER,

}
const person1 = { //optimal way reason: typescript does type inference 
    name: "hazel",
    age: 23,
    hobbies: ["coding","rap"],
    role: [1, "author"],
    mode: Mode.AUTHOR
}
console.log(person.age);
console.log(person1.mode);