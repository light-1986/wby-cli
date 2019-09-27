// import { a } from './a';
// console.log(a)
// let b = 123;
// console.log(b)

let [ a, b, c] = [4, 5, 6];
console.log(a, b, c)

let d = {...{e:23}}

const ab = Object.assign({}, d);
console.log(ab)

Object.keys(d).map((item) => {
    return item + 1;
})