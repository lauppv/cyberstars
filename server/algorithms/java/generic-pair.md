# Hard · Generic Pair

Create a generic **Pair<A, B>** class that holds two values of potentially different types. The class should have `getFirst()`, `getSecond()`, and a `swap()` method that returns a new `Pair<B, A>` with the values swapped.

Read two values from stdin (a string and an integer), create a Pair, swap it, and print both the original and swapped pairs.

### Input

- Line 1: a string value
- Line 2: an integer value

### Output

- Line 1: `(FIRST, SECOND)` — the original pair
- Line 2: `(FIRST, SECOND)` — the swapped pair

### Examples

```
Input:
hello
42

Output:
(hello, 42)
(42, hello)
```

```
Input:
Java
100

Output:
(Java, 100)
(100, Java)
```

```
Input:
world
0

Output:
(world, 0)
(0, world)
```

### Hints

- Use generics: `class Pair<A, B>`.
- `swap()` returns `new Pair<B, A>(second, first)`.
- Override `toString()` to return `(first, second)`.
- When creating the pair, use `Pair<String, Integer>`.
- The swapped pair has type `Pair<Integer, String>`.
