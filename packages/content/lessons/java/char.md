You already used `charAt` to take one character out of a String. What it gives you is a **char**: a single character, like a letter, a digit or a space. Time to see what you can do with one

---

A char goes between single quotes. A String goes between double quotes

```java
public class Main {
    public static void main(String[] args) {
        char grade = 'A';
        String word = "A";
        System.out.println(grade);
        System.out.println(word);

        String name = "Tommy";
        char first = name.charAt(0);
        System.out.println(first);
    }
}
```

Output

```text
A
A
T
```

`'A'` and `"A"` print the same, but they are different types. A String can hold any number of characters, even zero. A char holds exactly one

---

Under the hood, a char is a number. Every character has a code: `'A'` is 65, `'B'` is 66, `'a'` is 97, and the digit `'0'` is 48. That is why you can count with chars

```java
public class Main {
    public static void main(String[] args) {
        char letter = 'a';
        letter++;
        System.out.println(letter);

        for (char c = 'A'; c <= 'E'; c++) {
            System.out.print(c);
        }
        System.out.println();
    }
}
```

Output

```text
b
ABCDE
```

The letters come one after the other in the code table, so `c++` moves to the next letter

---

The same trick turns a digit character into its number. The digits `'0'` to `'9'` sit next to each other, so `c - '0'` tells how far `c` is from `'0'`

```java
public class Main {
    public static void main(String[] args) {
        char c = '7';
        int value = c - '0';
        System.out.println(value + 1);
    }
}
```

Output

```text
8
```

Without `- '0'`, the char `'7'` would count as its code, 55

---

Java has a class full of helpers for chars, called **Character**. The ones you will use most:

- `Character.isLetter(c)`: is it a letter?
- `Character.isDigit(c)`: is it a digit, 0 to 9?
- `Character.isUpperCase(c)` and `Character.isLowerCase(c)`
- `Character.toUpperCase(c)` and `Character.toLowerCase(c)`

```java
public class Main {
    public static void main(String[] args) {
        String code = "aB3!";
        for (int i = 0; i < code.length(); i++) {
            char c = code.charAt(i);
            if (Character.isDigit(c)) {
                System.out.println(c + " is a digit");
            } else if (Character.isLetter(c)) {
                System.out.println(c + " is a letter, big: " + Character.toUpperCase(c));
            } else {
                System.out.println(c + " is something else");
            }
        }
    }
}
```

Output

```text
a is a letter, big: A
B is a letter, big: B
3 is a digit
! is something else
```

---

## Mission: License Plate

A car was seen leaving the bank, and a witness wrote down its plate. Store the plate in a `String` named `plate`. Go through it one char at a time and print:

1. `Letters: N`, how many letters it has
2. `Digits: N`, how many digits it has
3. `Other: N`, how many other characters it has (spaces, dashes...)
4. `Digit sum: N`, the sum of its digits

Use `Character.isLetter` and `Character.isDigit` to tell the chars apart.

**Example** for `plate = "VC 4-28"`

```text
Letters: 2
Digits: 3
Other: 2
Digit sum: 14
```

**Example** for `plate = "ABC"`

```text
Letters: 3
Digits: 0
Other: 0
Digit sum: 0
```

**Example** for `plate = "99-x"`

```text
Letters: 1
Digits: 2
Other: 1
Digit sum: 18
```
