# Easy · FizzBuzz

Print the numbers from 1 to N, but with a twist: for multiples of 3 print `Fizz`, for multiples of 5 print `Buzz`, and for multiples of both 3 and 5 print `FizzBuzz`.

### Input

- A single integer `n` (1 <= n <= 100).

### Output

Print one value per line: the number itself, `Fizz`, `Buzz`, or `FizzBuzz`.

### Examples

```
Input:
5

Output:
1
2
Fizz
4
Buzz
```

```
Input:
15

Output:
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
```

```
Input:
1

Output:
1
```

With `n = 1` there is only one line of output: the number `1` itself.

### Hints

- Check divisibility by **both** 3 and 5 first — if you check for 3 alone first, you'll never reach `FizzBuzz`.
- Use the modulo operator `%`: `n % 3 == 0` means `n` is divisible by 3.
- A number is divisible by both 3 and 5 if and only if it's divisible by 15.
- Print each result on its own line.
