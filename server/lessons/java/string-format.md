In Python, you've probably used **f-strings** like `f"Hello, {name}!"`. Java doesn't have f-strings, but it has something just as powerful: **String.format()**

```java
String name = "Tommy Vercetti";
String message = String.format("Hello, %s!", name);
System.out.println(message);
```
Output
```text
Hello, Tommy Vercetti!
```

The **%s** is a **placeholder** — it means "put a String here." When Java runs `String.format(...)`, it replaces `%s` with the value of `name`. Think of it like a mad-libs template where you fill in the blanks

---

There are different placeholders for different types

- **%s** — String (or anything, really — Java converts it to text)
- **%d** — integer (int, long)
- **%f** — floating-point number (double, float)

```java
String player = "Lance Vance";
int kills = 47;
double accuracy = 82.5;

String stats = String.format("Player: %s | Kills: %d | Accuracy: %f", player, kills, accuracy);
System.out.println(stats);
```
Output
```text
Player: Lance Vance | Kills: 47 | Accuracy: 82.500000
```

Wait, that's a lot of decimals! By default, **%f** shows 6 decimal places. To control it, use **%.Nf** where N is the number of decimals you want

---

**%.2f** means "show 2 decimal places." This is the one you'll use most often

```java
double price = 4.5;
System.out.println(String.format("Price: $%.2f", price));
```
Output
```text
Price: $4.50
```

You can mix and match placeholders in one format string. They get filled in **left to right**

```java
String name = "Cortez";
int missions = 12;
double rating = 9.7;

String report = String.format("%s completed %d missions with a %.1f rating", name, missions, rating);
System.out.println(report);
```
Output
```text
Cortez completed 12 missions with a 9.7 rating
```

---

Java also has **printf()** which is basically a shortcut — it formats AND prints in one step, so you don't need `String.format()` plus `System.out.println()` separately

```java
String name = "Tommy";
int score = 1500;
System.out.printf("Player: %s | Score: %d%n", name, score);
```

Notice **%n** at the end — that's the newline for printf. Without it, the next print would continue on the same line. You can also use `\n` but `%n` is the "proper" Java way

Compare the two approaches

```java
// approach 1: String.format + println
System.out.println(String.format("Score: %d", 100));

// approach 2: printf (shorter!)
System.out.printf("Score: %d%n", 100);
```

Both produce the same output. Use whichever you prefer — `String.format()` is great when you want to store the formatted string in a variable, and `printf()` is great when you just want to print it right away

---

Here's a GTA Vice City scoreboard example putting it all together

```java
String name = "Phil Cassidy";
int score = 2300;
double rating = 8.95;

String line = String.format("Player: %s | Score: %d | Rating: %.2f", name, score, rating);
System.out.println(line);
```
Output
```text
Player: Phil Cassidy | Score: 2300 | Rating: 8.95
```

---

Your turn! Create three variables: a String **name** set to `"Tommy Vercetti"`, an int **score** set to `1500`, and a double **rating** set to `4.75`. Use **String.format()** to create and print this exact line:

```text
Player: Tommy Vercetti | Score: 1500 | Rating: 4.75
```

Make sure to use **%.2f** for the rating so it shows exactly 2 decimal places