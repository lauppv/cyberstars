Combine **interfaces**, **casting**, **exceptions**, and **String.format**

---

Build a **shape calculator** using interfaces. Create an interface **Shape** with:
- **double area()**
- **String describe()**

Create three classes that implement Shape:
- **Circle** — takes radius. Area = PI * r * r
- **Rectangle** — takes width and height. Area = w * h
- **Triangle** — takes base and height. Area = 0.5 * b * h

Write a method **static void printShape(Shape s)** that uses **String.format** to print: "Shape: describe — Area: X.XX"

In main, create an array of Shapes and print each one. Then try to **cast** one to Circle and print the radius. Wrap the cast in a **try/catch** for ClassCastException

```java
Shape[] shapes = {
    new Circle(5),
    new Rectangle(4, 6),
    new Triangle(3, 8)
};
```

Expected output
```text
Circle (r=5.0) — Area: 78.54
Rectangle (4.0 x 6.0) — Area: 24.00
Triangle (b=3.0, h=8.0) — Area: 12.00
Circle radius: 5.0
Not a circle!
```
