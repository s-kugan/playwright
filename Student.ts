import { Person } from './Person.ts';

export class Student extends Person{

    stuID:number;
    constructor(name:string,age:number,stuID:number){
        super(name,age);
        this.stuID=stuID;
    }

    getStudentInfo():string {

        return `${super.getPersonInfo()},StuID:${this.stuID}`;
    }

}