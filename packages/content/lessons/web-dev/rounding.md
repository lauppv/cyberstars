10 friends are going to the cinema, and a car takes 4. How many cars? 10 ÷ 4 is 2.5, but nobody drives half a car: you need 3. And how many cars are completely full? 2. Real life often needs a whole number, rounded the right way.

## Three ways to round

JavaScript has a toolbox called `Math`, with three rounding tools:

```js
console.log(Math.round(2.5));
console.log(Math.floor(2.5));
console.log(Math.ceil(2.5));
```

```text
3
2
3
```

- `Math.round` goes to the **nearest** whole number: 2.4 becomes 2, 2.5 becomes 3;
- `Math.floor` always goes **down**: 2.9 becomes 2. Think of the floor, below you;
- `Math.ceil` always goes **up**: 2.1 becomes 3. Think of the ceiling, above you.

## Which one?

Ask what the number means:

```js
const friends = 10;
const seatsPerCar = 4;
console.log(Math.ceil(friends / seatsPerCar));   // cars needed
console.log(Math.floor(friends / seatsPerCar));  // cars completely full
```

```text
3
2
```

Cars **needed** rounds up: even 1 friend left over needs a car. **Full** cars rounds down: a car with 2 people isn't full.

## Break it on purpose

Use `Math.round` for the cars:

```js
console.log(Math.round(9 / 4));
```

```text
2
```

9 ÷ 4 is 2.25, the nearest whole number is 2, and one friend is left on the pavement. Rounding the wrong way gives a number that looks fine and is wrong.

---

## Mission: Days of oxygen

Your oxygen lasts 140 hours. The crew wants to know how that works out in days, and how many tanks to order for a 31-day trip.

**Example**: when `crew.html` opens, the console shows, among its other lines:

```text
Full days of oxygen: 5
Tanks for 31 days: 38
```

- The console shows `Full days of oxygen: 5`: only the days the oxygen fully covers.
- The console shows `Tanks for 31 days: 38`: enough 20-hour tanks for 31 days of 24 hours, rounded the way that never leaves the crew short.

Psst, "full" rounds one way, "enough" the other :)
