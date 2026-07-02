# Easy · Dice Roller

Create a **Dice** class that simulates rolling a die. The constructor takes the number of sides and a **seed**. Add a `roll()` method that returns the next result using `java.util.Random`.

**Important:** Create the `Random` object with `new Random(seed)` and use `nextInt(sides) + 1` so results are reproducible for a given seed.

Read the number of sides, the seed, and the number of rolls from stdin. Create a `Dice` object and print each roll result on a separate line.

### Input

- Line 1: three integers separated by spaces — sides, seed, numberOfRolls

### Output

- One line per roll with the result (an integer between 1 and sides).

### Examples

```
Input:
6 42 1

Output:
3
```

```
Input:
6 1 3

Output:
4
5
2
```

```
Input:
20 7 1

Output:
17
```

```
Input:
2 100 5

Output:
2
2
1
2
2
```

Different seeds (and different `sides`) produce completely different
sequences — but the same seed always reproduces the same sequence.

### Hints

- `new Random(seed)` creates a reproducible random number generator.
- `random.nextInt(sides)` returns a value from 0 to sides-1, so add 1.
- Encapsulate the `Random` object as a private field inside your `Dice` class.
- Using a seed means the same inputs always produce the same outputs — great for testing!
