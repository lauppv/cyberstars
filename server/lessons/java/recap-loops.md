Combine **while loops**, **methods**, and **input**

---

Build a **number cruncher**. Write these methods:

**static int factorial(int n)** — calculate factorial using a **while loop** (not recursion). 5! = 5 * 4 * 3 * 2 * 1 = 120

**static boolean isPrime(int n)** — check if a number is prime using a **while loop**. A prime is only divisible by 1 and itself

**static int sumDigits(int n)** — sum all digits of a number using a **while loop** (use `% 10` and `/ 10`)

Test with these values in main:
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("5! = " + factorial(5));
        System.out.println("7! = " + factorial(7));
        System.out.println("13 prime? " + isPrime(13));
        System.out.println("15 prime? " + isPrime(15));
        System.out.println("Digits of 9876: " + sumDigits(9876));
    }
}
```

Expected output
```text
5! = 120
7! = 5040
13 prime? true
15 prime? false
Digits of 9876: 30
```
