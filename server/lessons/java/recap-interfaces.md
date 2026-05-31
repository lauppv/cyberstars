Combine **interfaces**, **casting**, **exceptions**, and **String.format**

---

## Mission: Hull Geometry Scanner

The station's hull integrity scanner detects structural shapes and calculates their area for stress analysis. Build the shape system using interfaces, then demonstrate safe casting with exception handling.

Create an interface **`Shape`** with:

- `double area()`
- `String describe()`

Create three classes that implement Shape:

- **Circle** — takes radius. Area = PI _ r _ r. Describe returns `"Circle (r=X.X)"`
- **Rectangle** — takes width and height. Area = w \* h. Describe returns `"Rectangle (X.X x X.X)"`
- **Triangle** — takes base and height. Area = 0.5 _ b _ h. Describe returns `"Triangle (b=X.X, h=X.X)"`

The `printShape` method and shape array are already on the right. After printing all shapes, cast `shapes[0]` to Circle and print its radius, then try casting `shapes[1]` to Circle and catch the `ClassCastException`.

**Output**

```text
Circle (r=5.0) — Area: 78.54
Rectangle (4.0 x 6.0) — Area: 24.00
Triangle (b=3.0, h=8.0) — Area: 12.00
Circle radius: 5.0
Not a circle!
```
