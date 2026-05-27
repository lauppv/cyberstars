Combine **classes/objects**, **constructors**, **methods inside classes**, and **Math class**

---

Build a **Pet Shelter** system. Create a class **Pet** with:

- Fields: **name** (String), **species** (String), **age** (int), **happiness** (int, starts at 50)
- **Constructor** that takes name, species, and age
- Method **play()** — increases happiness by 15, but caps at 100 (use **Math.min**)
- Method **feed()** — increases happiness by 10, but caps at 100
- Method **status()** — returns a String: "Name (Species, age Y) - Happiness: X"

In main, create 3 pets, interact with them, and print their status:

```java
public class Main {
    public static void main(String[] args) {
        Pet p1 = new Pet("Rex", "Dog", 3);
        Pet p2 = new Pet("Whiskers", "Cat", 5);
        Pet p3 = new Pet("Nemo", "Fish", 1);

        p1.play();
        p1.play();
        p1.feed();
        p2.feed();
        p3.play();
        p3.play();
        p3.play();
        p3.play();
    }
}
```

Print each pet's status after the interactions

Expected output

```text
Rex (Dog, age 3) - Happiness: 90
Whiskers (Cat, age 5) - Happiness: 60
Nemo (Fish, age 1) - Happiness: 100
```

Nemo caps at 100 even though 50 + 4\*15 = 110
