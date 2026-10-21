const unsorted: number[] = [5, 3, 8, 1, 2];



const sorted = (numbers: number[]) => {

    for(let i=0;i<numbers.length;i++){

        for(let j=i+1;j<numbers.length;j++){
            ``
            if (numbers[j]<numbers[i]){
                const temp = numbers[i];
                numbers[i] = numbers[j];
                numbers[j] = temp;
            }
        }
    }

    return numbers;
 }
 
 console.log(sorted(unsorted));