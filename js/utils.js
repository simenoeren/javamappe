//console.log('utils')
export const value = 'utils';

const age = 23;
console.log(age);

/* How initialize variables
var age; 
console.log(age);
age = 23; */

let url;
console.log(url)
url = 'finn.no';
console.log(url);

const totalProducts = 23.98;


calculateAge();

// functions declaration
function calculateAge(age, name) {
    const target = '_blanc' // lives only inside the function
    console.log('calculate function' + url + ' ' + target);
    return true;
};

const calculateValue = () => {
    console.log('new value' + ' ' + url)
}

const calculateValue = (a, b) => console.log(a + b);

function calculateValue1(a, b) {
    return a+b;
}

calculateValue(2, 4);
calculateValue(10, 15);
calculateValue1(6, 9);