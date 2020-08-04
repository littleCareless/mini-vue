import { Observer } from './ob'
import Watcher from './watch'

let car = new Observer({
  brand: 'BMW',
  price: 3000,
})

let asd = new Watcher('', '', () => {
  console.log('123')
})
console.log(car);
console.log(asd)
car.value.brand = 'aodi'
console.log(car.value.brand)
console.log(car.value.brand)
console.log(car.value.brand)
console.log(car.value.brand = 'adds')
console.log(car.value.brand)