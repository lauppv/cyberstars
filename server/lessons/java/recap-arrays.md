Combine **methods**, **return values**, **string methods**, **arrays**, **looping over arrays**, and **break/continue** in a single mission

---

## Mission: Radio Station Filter

Tommy is listening to the Vice City police radio. The feed is full of static, and at some point the operator signs off. Write a filter that cleans up the transmission and keeps only the real names.

Put the signals in a `String` array, for example:

```java
String[] signals = { "tommy", "static", "lance", "static", "cortez", "static", "diaz", "out", "mercedes" };
```

Write a **method** that takes the array of signals and **returns** a new array containing only the valid names, in **uppercase**. The method should:

1. Loop through the array
2. **Skip** any signal equal to `"static"` (use `continue` and `.equals()`)
3. **Stop** completely when it hits `"out"` (use `break`) — everything after it is ignored
4. Turn the valid names with `.toUpperCase()` and collect them into the result array

In `main`, call the method, print each name on its own line, then print **how many** names are left.

**Tip**: since you don’t know up front how many names will be valid, walk the array **twice** — first just count them, then create the result array of the right size and fill it on the second pass.

**Example**

For `{ "tommy", "static", "lance", "static", "cortez", "static", "diaz", "out", "mercedes" }`

```text
TOMMY
LANCE
CORTEZ
DIAZ
Total: 4
```

**Example** when the sign-off comes first `{ "out", "tommy", "lance" }` (no valid names)

```text
Total: 0
```

**Example** with no static and no sign-off `{ "tommy", "lance" }`

```text
TOMMY
LANCE
Total: 2
```
