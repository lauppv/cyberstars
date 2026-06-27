Arrays are great, but they have one big limitation: their **size is fixed**. Once you create an array of 5 elements, you can't add a 6th. In real programs, you often don't know upfront how many items you'll need. This is where **ArrayList** comes in

An **ArrayList** is a **dynamic array** — it grows and shrinks as needed. You need to import it from `java.util`

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> crew = new ArrayList<String>();
        crew.add("Tommy Vercetti");
        crew.add("Lance Vance");
        crew.add("Phil Cassidy");

        System.out.println(crew);
    }
}
```

Output

```text
[Tommy Vercetti, Lance Vance, Phil Cassidy]
```

The **\<String\>** part is called a **generic type** — it tells Java what type of elements the list holds. `ArrayList<String>` means "a list that holds Strings." For numbers you use **ArrayList\<Integer\>** or **ArrayList\<Double\>** (not `int`/`double` directly — Java converts automatically)

---

Main methods

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> guests = new ArrayList<String>();

        // add -- adds to the end
        guests.add("Tommy");
        guests.add("Lance");
        guests.add("Mercedes");
        guests.add("Sonny");

        // size -- how many elements
        System.out.println("Total: " + guests.size());

        // get -- element at an index (starting from 0)
        System.out.println("First: " + guests.get(0));

        // remove -- removes at an index
        guests.remove(3);
        System.out.println("After removal: " + guests);
    }
}
```

Output

```text
Total: 4
First: Tommy
After removal: [Tommy, Lance, Mercedes]
```

`.size()` with parentheses, not `.length` like arrays — one of the differences to remember

---

**Iterating with a classic for** — when you need the index

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> crew = new ArrayList<String>();
        crew.add("Tommy Vercetti");
        crew.add("Lance Vance");
        crew.add("Phil Cassidy");

        for (int i = 0; i < crew.size(); i++) {
            System.out.println(i + ": " + crew.get(i));
        }
    }
}
```

Output

```text
0: Tommy Vercetti
1: Lance Vance
2: Phil Cassidy
```

**Iterating with for-each** — cleaner when you don't need the index

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> crew = new ArrayList<String>();
        crew.add("Tommy Vercetti");
        crew.add("Lance Vance");
        crew.add("Phil Cassidy");

        for (String name : crew) {
            System.out.println("Member: " + name);
        }
    }
}
```

Output

```text
Member: Tommy Vercetti
Member: Lance Vance
Member: Phil Cassidy
```

Read `for (String name : crew)` as: "for each String called `name` in `crew`"

---

ArrayList becomes really powerful when you hold **objects** in it — not just Strings or numbers, but instances of your own classes

```java
import java.util.ArrayList;

class Car {
    String name;
    int speed;

    Car(String name, int speed) {
        this.name = name;
        this.speed = speed;
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Car> garage = new ArrayList<Car>();
        garage.add(new Car("Infernus", 240));
        garage.add(new Car("Cheetah", 230));
        garage.add(new Car("Banshee", 200));

        for (Car c : garage) {
            System.out.println(c.name + " - " + c.speed + " km/h");
        }
    }
}
```

Output

```text
Infernus - 240 km/h
Cheetah - 230 km/h
Banshee - 200 km/h
```

`ArrayList<Car>` holds objects of type `Car`. You can access each object's fields directly in the loop

---

Quick comparison

|          | Array   | ArrayList   |
| -------- | ------- | ----------- |
| Size     | Fixed   | Dynamic     |
| Length   | .length | .size()     |
| Access   | arr[i]  | list.get(i) |
| For-each | works   | works       |
| Adding   | no      | .add()      |
| Removing | no      | .remove()   |

---

## Mission: The Crew List

Tommy keeps a list of his Vice City crew members. Each member has a name and a role. Tommy starts with Lance Vance (driver), Phil Cassidy (weapons), Umberto Robina (ally), and Hilary King (driver). At some point, Lance betrays him and needs to be removed from the list

Build a class for crew members. In `main`, create an ArrayList with all the members, remove Lance (the first in the list), then iterate through the list and print each remaining member

**Example**

```text
Phil Cassidy - weapons
Umberto Robina - ally
Hilary King - driver
```
