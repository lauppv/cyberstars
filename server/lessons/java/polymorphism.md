Polymorphism is a fancy word that means "many forms." In Java, it means a variable of a **parent** type can hold an object of any **child** type — and Java will call the RIGHT method automatically

```java
class Animal {
    String name;
    Animal(String name) { this.name = name; }
    void speak() { System.out.println("..."); }
}

class Dog extends Animal {
    Dog(String name) { super(name); }
    @Override
    void speak() { System.out.println("Woof!"); }
}

class Cat extends Animal {
    Cat(String name) { super(name); }
    @Override
    void speak() { System.out.println("Meow!"); }
}

public class Main {
    public static void main(String[] args) {
        Animal a = new Dog("Rex");  // parent type, child object
        a.speak();  // prints "Woof!" not "..."
    }
}
```

Even though `a` is declared as `Animal`, Java knows it's actually a `Dog` at runtime and calls Dog's `speak()`. This is called **dynamic dispatch** — Java dispatches the method call to the actual object type, not the declared type

---

This gets REALLY powerful with arrays and loops. Imagine you're building a game like GTA Vice City and you have different types of characters — all extending a base `Character` class. You can store them all in ONE array

```java
class Shape {
    double area() { return 0; }
}

class Circle extends Shape {
    double radius;
    Circle(double radius) { this.radius = radius; }

    @Override
    double area() { return Math.PI * radius * radius; }
}

class Rectangle extends Shape {
    double width, height;
    Rectangle(double w, double h) { this.width = w; this.height = h; }

    @Override
    double area() { return width * height; }
}

public class Main {
    public static void main(String[] args) {
        Shape[] shapes = { new Circle(5), new Rectangle(4, 6) };

        for (Shape s : shapes) {
            System.out.println(s.area());
        }
    }
}
```

Output

```text
78.53981633974483
24.0
```

We never checked "is this a circle or rectangle?" — Java figured it out for us. The loop just calls `s.area()` and Java routes it to the correct override. That's polymorphism in action

---

In Python this works too (duck typing), but Java does it with **type safety**. The compiler guarantees that every object in that `Shape[]` array has an `area()` method. No surprise `AttributeError` at runtime

---

Sometimes you need to check what type an object actually is. Java has the **instanceof** keyword for that

```java
public class Main {
    public static void main(String[] args) {
        Animal a = new Dog("Rex");

        if (a instanceof Dog) {
            System.out.println("It's a dog!");
        }
    }
}
```

This is useful when you need to access child-specific methods. But in general, if you're using `instanceof` a lot, you might be fighting against polymorphism instead of using it. The whole point is to NOT care about the specific type

---

Here's why this matters in real code. Imagine a method that takes any Shape

```java
public class Main {
    static void printArea(Shape s) {
        System.out.println("Area: " + s.area());
    }
}
```

You can pass a Circle, a Rectangle, a Triangle — anything that extends Shape. The method doesn't need to know or care. That's the power. One method handles ALL shapes, current and future

Like Cortez in Vice City — he gives missions to Tommy, Lance, whoever. He doesn't care about the specific person, just that they can do the job. The "job" is the method signature, and polymorphism makes sure the right person does it their way

---

Your turn! Create the `Shape`, `Circle`, and `Rectangle` classes from the override lesson (Shape has area() returning 0, Circle overrides with pi*r*r, Rectangle overrides with w\*h). Then create a `Shape[]` array containing a Circle with radius 5 and a Rectangle with width 4 and height 6. Loop through the array and print each area using `String.format("%.2f", s.area())`
