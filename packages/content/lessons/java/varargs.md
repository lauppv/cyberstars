Some methods should take any number of values: add up 2 numbers, or 5, or none. Writing one method for each count would be silly. With **varargs** one method takes as many values as the caller gives

---

You write three dots after the type of the last parameter

```java
public class Main {
    static int sum(int... numbers) {
        int total = 0;
        for (int n : numbers) {
            total += n;
        }
        return total;
    }

    public static void main(String[] args) {
        System.out.println(sum(4, 5));
        System.out.println(sum(1, 2, 3, 4));
        System.out.println(sum());
    }
}
```

Output

```text
9
10
0
```

Inside the method, `numbers` is a normal `int[]`. Java collects the values the caller gives into an array for you. With no values at all, the array is just empty

---

Since it is an array inside, you can also pass an array you already have

```java
public class Main {
    static int sum(int... numbers) {
        int total = 0;
        for (int n : numbers) {
            total += n;
        }
        return total;
    }

    public static void main(String[] args) {
        int[] tips = { 10, 20, 5 };
        System.out.println(sum(tips));
    }
}
```

Output

```text
35
```

---

A method can have normal parameters too, but the varargs one must come last, and there can be only one. Otherwise Java couldn't tell where the extra values end

```java
public class Main {
    static void shout(String who, String... words) {
        System.out.println(who + " says " + words.length + " words");
    }

    public static void main(String[] args) {
        shout("Lance", "hey", "Tommy");
        shout("Ken");
    }
}
```

Output

```text
Lance says 2 words
Ken says 0 words
```

`who` always gets the first value. Everything after it goes into `words`

You have used varargs already without knowing it: `String.format` and `printf` take a pattern, and then any number of values

---

## Mission: Roll Call

Before a job, Tommy calls the roll. Write a method `roll` that takes the leader's name and then any number of crew member names, and gives back one line:

- `<leader> leads N: <names>`, with the names separated by a comma and a space
- `<leader> works alone` when there is nobody else

In `main`, store the leader in a `String` named `leader` and the crew in a `String` array named `crew`. Print the roll call twice: first for the leader with the whole crew, then for the leader alone, with no crew given at all.

**Example** for `leader = "Tommy"` and `crew = { "Lance", "Ken" }`

```text
Tommy leads 2: Lance, Ken
Tommy works alone
```

**Example** for `leader = "Sonny"` and `crew = { "Diaz" }`

```text
Sonny leads 1: Diaz
Sonny works alone
```

**Example** for `leader = "Avery"` and `crew = { }`

```text
Avery works alone
Avery works alone
```
