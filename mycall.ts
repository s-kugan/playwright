import {Student} from './Student.ts'

const student = new Student('Siva',24,78
console.log(student.getStudentInfo());

const arrayofstudents = [
    new Student('Siva',24,789),
    new Student('Ravi',55,456),
    new Student('Anu',23,123),
    new Student('Maya',45,987)
]

const studentsover40 = arrayofstudents.filter((student)=>{return student.age>40})
console.log(studentsover40);

const uppercaseStudentname = studentsover40.map((student)=>{return student.name.toUpperCase()});
console.log(uppercaseStudentname);

const averageAgeofStudents = arrayofstudents.reduce((total,student)=>{return total+student.age},0)/arrayofstudents.length;
console.log(averageAgeofStudents);

