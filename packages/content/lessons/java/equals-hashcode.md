For Strings you learned to compare with `.equals()`, never with `==`. Your own classes work the same way, with one catch: Java doesn't know what "equal" means for your class until you tell it. You tell it by overriding **equals**, and together with it, **hashCode**

---

By default, the `equals` that comes from Object does the same as `==`: it only asks "is this the very same object?"

```java
class Car {
    String model;
    int year;

    Car(String model, int year) {
        this.model = model;
        this.year = year;
    }
}

public class Main {
    public static void main(String[] args) {
        Car a = new Car("Infernus", 1986);
        Car b = new Car("Infernus", 1986);
        System.out.println(a == b);
        System.out.println(a.equals(b));
    }
}
```

Output

```text
false
false
```

Two cars with the same model and year, and Java says they are not equal. They are two separate objects, and that's all the default `equals` looks at

---

To say "two cars are equal when the model and the year match", override `equals`. It takes an `Object`, because anything can be compared with anything

```java
class Car {
    String model;
    int year;

    Car(String model, int year) {
        this.model = model;
        this.year = year;
    }

    @Override
    public boolean equals(Object other) {
        if (!(other instanceof Car)) {
            return false;
        }
        Car car = (Car) other;
        return model.equals(car.model) && year == car.year;
    }
}

public class Main {
    public static void main(String[] args) {
        Car a = new Car("Infernus", 1986);
        Car b = new Car("Infernus", 1986);
        System.out.println(a.equals(b));
        System.out.println(a.equals("Infernus"));
    }
}
```

Output

```text
true
false
```

Step by step: if the other thing isn't even a Car, they can't be equal. If it is, cast it to Car and compare the fields that matter. Strings inside are compared with `equals` too

---

Now the catch. HashMap doesn't start with `equals`. First it asks the key for its **hashCode**, a number that tells it in which drawer to look. Two equal objects must give the same number, or HashMap looks in the wrong drawer and never finds the key

The rule: **when you override equals, override hashCode too**, and build it from the same fields. `Objects.hash` does it for you

```java
import java.util.HashMap;
import java.util.Objects;

class Car {
    String model;
    int year;

    Car(String model, int year) {
        this.model = model;
        this.year = year;
    }

    @Override
    public boolean equals(Object other) {
        if (!(other instanceof Car)) {
            return false;
        }
        Car car = (Car) other;
        return model.equals(car.model) && year == car.year;
    }

    @Override
    public int hashCode() {
        return Objects.hash(model, year);
    }
}

public class Main {
    public static void main(String[] args) {
        HashMap<Car, String> owners = new HashMap<>();
        owners.put(new Car("Infernus", 1986), "Tommy");
        System.out.println(owners.get(new Car("Infernus", 1986)));
    }
}
```

Output

```text
Tommy
```

Remove `hashCode` from this class and the program prints `null`: the two Car objects land in different drawers. Many methods use `equals` behind the scenes too, like `contains` on an ArrayList

---

## Mission: Car Count

Tommy's showroom got a delivery list, and some cars show up more than once. Write a class `Car` with a `String model` and an `int year`, where two cars are equal when both the model and the year match. Override `equals` and `hashCode`.

Store the models in a `String` array named `models` and the years in an `int` array named `years`, in the same order: car number `i` is `models[i]` from `years[i]`.

Count each car with a `HashMap<Car, Integer>`. Keep the different cars in an `ArrayList<Car>`, in the order you first see them, adding a car only if the list doesn't `contains` it yet. Then print, for each different car, `<model> <year>: <count>`, and at the end `Different cars: N`.

**Example** for `models = { "Infernus", "Cheetah", "Infernus", "Infernus" }` and `years = { 1986, 1986, 1986, 1985 }`

```text
Infernus 1986: 2
Cheetah 1986: 1
Infernus 1985: 1
Different cars: 3
```

**Example** for `models = { "Stinger", "Stinger" }` and `years = { 1984, 1984 }`

```text
Stinger 1984: 2
Different cars: 1
```
