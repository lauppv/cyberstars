Put do-while, the ternary operator, switch expressions, chars and the Math class to work together in one program

---

## Mission: Pay Phone

Tommy doesn't trust cell phones, so he makes his calls from a pay phone. Write the phone's brain.

Store the number he dials in a `String` named `dialed` and the length of the call in an `int` named `minutes`. The number can have dashes or spaces in it, like `305-555-0142`.

1. Keep only the digits of `dialed`. A real number has exactly 10 digits. If it doesn't, print `Invalid number` and nothing else
2. The first 3 digits are the area code. Write a method that takes the area code and gives back where the call goes, with a switch expression:
   - `305` or `786`: `Vice City`
   - `212`: `Liberty City`
   - `415`: `San Fierro`
   - anything else: `Long distance`
3. A minute costs 1 coin in Vice City, 3 coins in Liberty City or San Fierro, and 5 coins for long distance. Even a call of 0 minutes is charged as 1 minute
4. Print `Calling <place>`, then `Cost: N coins`, or `Cost: 1 coin` when it is exactly one. Pick the word with the ternary operator

**Example** for `dialed = "305-555-0142"` and `minutes = 3`

```text
Calling Vice City
Cost: 3 coins
```

**Example** for `dialed = "212 555 0199"` and `minutes = 0`

```text
Calling Liberty City
Cost: 3 coins
```

**Example** for `dialed = "786-555-0100"` and `minutes = 1`

```text
Calling Vice City
Cost: 1 coin
```

**Example** for `dialed = "555-0142"` and `minutes = 2`

```text
Invalid number
```
