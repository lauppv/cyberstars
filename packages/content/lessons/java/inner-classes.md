A class can live inside another class. When the inside class only makes sense as part of the outer one, putting it there keeps them together. Java has two kinds: **inner classes** and **static nested classes**

---

An **inner class** is declared inside another class, without `static`. Every object of it belongs to one object of the outer class, and it can read that object's fields directly

```java
class Garage {
    String owner;

    Garage(String owner) {
        this.owner = owner;
    }

    class Car {
        String model;

        Car(String model) {
            this.model = model;
        }

        String label() {
            return model + " from " + owner + "'s garage";
        }
    }

    Car park(String model) {
        return new Car(model);
    }
}

public class Main {
    public static void main(String[] args) {
        Garage garage = new Garage("Tommy");
        Garage.Car car = garage.park("Infernus");
        System.out.println(car.label());
    }
}
```

Output

```text
Infernus from Tommy's garage
```

Look at `label()`: it uses `owner`, a field of Garage, as if it were its own. The Car was made by `garage.park(...)`, so it knows which garage it belongs to. From outside, the type is written `Garage.Car`

---

A **static nested class** has `static` in front. It doesn't belong to any outer object, so it can't read the outer class's fields. It is just a class kept inside another one for order

```java
class Race {
    static class Result {
        String driver;
        int time;

        Result(String driver, int time) {
            this.driver = driver;
            this.time = time;
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Race.Result r = new Race.Result("Lance", 61);
        System.out.println(r.driver + " " + r.time);
    }
}
```

Output

```text
Lance 61
```

You create it with `new Race.Result(...)`, without any Race object

---

Which one to pick? If the inside class needs the outer object's data, make it an inner class. If it doesn't, make it static nested: it is simpler and lighter

---

## Mission: Gang Badges

Tommy prints badges for his gang. Write a class `Gang` with a `String name` and an `ArrayList` of members. Inside it, write an inner class `Member` with a `String nick` and a method `badge()` that gives back `<nick> (<the gang's name>)`, reading the name of the gang it belongs to.

Give `Gang` a method `recruit(String nick)` that creates a `Member` and adds it to the list.

In `main`, store the gang's name in a `String` named `gangName` and the nicknames in a `String` array named `nicks`. Recruit everyone, then print each member's badge and finally `Members: N`.

**Example** for `gangName = "Vercetti Gang"` and `nicks = { "Lance", "Ken" }`

```text
Lance (Vercetti Gang)
Ken (Vercetti Gang)
Members: 2
```

**Example** for `gangName = "Sharks"` and `nicks = { }`

```text
Members: 0
```
