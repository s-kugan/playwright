const Palindrome = (text:String)=>{

    let reversed=""
    for(let i=text.length-1;i>=0;i--){
        reversed+=text[i]
    }

    return reversed;
}

console.log(Palindrome("siva"));

let numberArray : number[] = [1,5,6,8,0];
console.log(numberArray);

const addition = (a:number,b:number):number=>{
    return a+b;
}
console.log(addition(5,10));

let user:{name:string,age:number} = {name:"Siva", age:25};
console.log(user);

