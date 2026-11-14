```js crew-total.js
export default function totalCrew(ships) {
  let total = 0;
  for (let i = 1; i < ships.length; i++) {
    total += ships[i].crew;
  }
  return total;
}
```
