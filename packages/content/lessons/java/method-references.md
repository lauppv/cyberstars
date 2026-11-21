Many lambdas do nothing but call one method

```text
names.forEach(n -> System.out.println(n));
```

The lambda takes `n` and hands it straight to `println`. Java has a shorter way to say that: a **method reference**, written with two colons

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> crew = new ArrayList<>();
        crew.add("Tommy");
        crew.add("Lance");

        crew.forEach(System.out::println);
    }
}
```

Output

```text
Tommy
Lance
```

`System.out::println` means "the println method of System.out". You don't call it yourself, you hand it over, and `forEach` calls it for every item

---

A method reference can also point to a method of the item itself. `String::toUpperCase` means "take the String and call its toUpperCase"

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> crew = new ArrayList<>();
        crew.add("tommy");
        crew.add("lance");

        crew.replaceAll(String::toUpperCase);
        System.out.println(crew);
    }
}
```

Output

```text
[TOMMY, LANCE]
```

`replaceAll` swaps every item of the list for what the function gives back. Here, the same name in capitals

---

It works with static methods too, like `Integer::parseInt`, and with your own methods

```java
import java.util.function.Function;

public class Main {
    static int tip(int bill) {
        return bill / 10;
    }

    public static void main(String[] args) {
        Function<String, Integer> read = Integer::parseInt;
        Function<Integer, Integer> tipFor = Main::tip;

        int bill = read.apply("450");
        System.out.println(tipFor.apply(bill));
    }
}
```

Output

```text
45
```

---

Here are the lambdas and the method references that do the same thing

```text
n -> System.out.println(n)       System.out::println
s -> s.toUpperCase()             String::toUpperCase
s -> Integer.parseInt(s)         Integer::parseInt
(a, b) -> a.compareTo(b)         String::compareTo
name -> new Car(name)            Car::new
```

Use a method reference when the lambda only calls one method. When it does more, keep the lambda

---

## Mission: The Call List

Kent Paul hands Tommy a list of people to call. Kent wrote it in a hurry: some names have capitals, some don't, and the order is a mess. Tommy wants it clean

The names are in a `String[] names` array. Put them in an ArrayList. Turn every name into capitals, sort the list alphabetically, and print one name per line. Then print `Calls to make: ` and how many names there are. Use method references, not lambdas

**Example**

```text
CORTEZ
KENT
LANCE
PHIL
Calls to make: 4
```

**Example**

```text
Calls to make: 0
```
