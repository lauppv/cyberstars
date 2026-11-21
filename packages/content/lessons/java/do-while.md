A while loop checks its condition first. If the condition is false from the start, the body never runs. Sometimes you want the opposite: run the body once, then decide if you go again. That is the job of **do-while**

---

Here is a do-while that counts down

```java
public class Main {
    public static void main(String[] args) {
        int countdown = 3;
        do {
            System.out.println(countdown);
            countdown--;
        } while (countdown > 0);
        System.out.println("Go!");
    }
}
```

Output

```text
3
2
1
Go!
```

The body comes first, inside `do { ... }`. The condition comes after it, in `while (...)`. Notice the semicolon after the condition. A do-while is the only loop that ends with one

---

So what is the difference from a normal while? Look at what happens when the condition is false right away

```java
public class Main {
    public static void main(String[] args) {
        int fuel = 0;

        while (fuel > 0) {
            System.out.println("while: driving");
            fuel--;
        }

        do {
            System.out.println("do-while: driving");
            fuel--;
        } while (fuel > 0);
    }
}
```

Output

```text
do-while: driving
```

The while loop checks first, sees `0 > 0` is false, and skips its body. The do-while runs its body once, and only then checks. So a do-while always runs **at least once**

---

When is "at least once" what you want? A good example is reading the digits of a number. You take the last digit with `% 10`, then drop it with `/ 10`, and repeat while something is left

```java
public class Main {
    public static void main(String[] args) {
        int number = 905;
        int sum = 0;
        do {
            sum = sum + number % 10;
            number = number / 10;
        } while (number > 0);
        System.out.println("Sum of digits: " + sum);
    }
}
```

Output

```text
Sum of digits: 14
```

9 + 0 + 5 is 14. And if the number is 0, the body still runs once: it adds the digit 0 and stops. A while loop would not look at the 0 at all. With digits, the number 0 still has one digit, so do-while fits

---

## Mission: Odometer

Tommy bought a used Infernus and wants to read its odometer digit by digit. Store the distance in an `int` named `mileage`. Then:

1. Print the digits of `mileage` one per line, starting from the last digit
2. After them, print how many digits it has, as `Digits: N`

Use a do-while loop, so that a mileage of 0 still shows one digit.

**Example** for `mileage = 4072`

```text
2
7
0
4
Digits: 4
```

**Example** for `mileage = 0`

```text
0
Digits: 1
```

**Example** for `mileage = 50`

```text
0
5
Digits: 2
```
