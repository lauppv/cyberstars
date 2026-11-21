Strings in Java can't change. Every time you write `text = text + "x"`, Java builds a brand new String and throws the old one away. For a few pieces that is fine. For a String you build in a loop, piece by piece, there is a better tool: **StringBuilder**

---

A StringBuilder is a String you can change. You add to it with **append**, and turn it into a normal String with **toString**

```java
public class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        sb.append("Vice");
        sb.append(" ");
        sb.append("City");
        sb.append(86);
        String result = sb.toString();
        System.out.println(result);
    }
}
```

Output

```text
Vice City86
```

`append` takes anything: text, numbers, chars. It changes the same StringBuilder each time, it doesn't make a new one

---

It shines in loops. Here we build a row of stars

```java
public class Main {
    public static void main(String[] args) {
        int rating = 4;
        StringBuilder stars = new StringBuilder();
        for (int i = 0; i < rating; i++) {
            stars.append('*');
        }
        System.out.println(stars);
        System.out.println(stars.length());
    }
}
```

Output

```text
****
4
```

println can print a StringBuilder directly. `length()` works like on a String

---

A StringBuilder has a few tricks a String doesn't have:

- `reverse()` turns it back to front
- `insert(position, value)` puts something in the middle
- `deleteCharAt(position)` removes one char
- `setCharAt(position, c)` replaces one char

```java
public class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder("Tommy");
        sb.reverse();
        System.out.println(sb);

        sb = new StringBuilder("Lance Vance");
        sb.insert(6, "the ");
        System.out.println(sb);

        sb.deleteCharAt(0);
        sb.setCharAt(0, 'A');
        System.out.println(sb);
    }
}
```

Output

```text
ymmoT
Lance the Vance
Ance the Vance
```

`new StringBuilder("Tommy")` starts it with some text already inside. The positions count from 0, like with `charAt`

---

When should you use which?

- A few pieces glued once: `+` is clear and fine
- Many pieces added in a loop, or a String you change in the middle: StringBuilder

---

## Mission: Graffiti Tag

Tommy's crew tags their names on the walls backwards and in capitals, with a dash between the letters. Store the name in a `String` named `name`. Build the tag with a StringBuilder and print it, then print `Length: N` with the length of the tag.

For `vice` the tag is `E-C-I-V`. A name with one letter has no dash. An empty name gives an empty tag.

**Example** for `name = "vice"`

```text
E-C-I-V
Length: 7
```

**Example** for `name = "Ken"`

```text
N-E-K
Length: 5
```

**Example** for `name = "x"`

```text
X
Length: 1
```
