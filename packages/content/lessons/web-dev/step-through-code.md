```js average-crew.js
function sum(numbers) {
  let total = 0;
  for (const number of numbers) {
    total += number;
    return total;
  }
}

export default function averageCrew(ships) {
  const crews = ships.map((ship) => ship.crew);
  return sum(crews) / crews.length;
}
```
