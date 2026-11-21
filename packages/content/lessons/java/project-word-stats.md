Last project of the course! Ken Rosenberg writes long letters, and he wants to know how he writes: how many words, which words he uses most, his longest word. Let's build a small text analyzer, the kind every word processor has inside

It brings together files, chars and StringBuilder, a TreeMap, a Comparator and streams. Step by step

---

**Step 1: The text goes into a file**

Ken's letter comes as one String with `\n` where each line ends. We save it to a file first, the way a real program would get it

```text
try (PrintWriter out = new PrintWriter(new FileWriter("letter.txt"))) {
    out.print(text);
}
```

`print`, not `println`: the text already has its own line breaks, and we don't want an extra empty line at the end

---

**Step 2: Reading it back, line by line**

`Files.readAllLines` gives us the lines, and their count is the first number Ken wants

```text
List<String> lines = Files.readAllLines(Path.of("letter.txt"));
System.out.println("Lines: " + lines.size());
```

---

**Step 3: Cutting a line into words**

A word is a run of letters. Everything else (spaces, commas, dots, `!`) ends a word. We walk the line one char at a time, and a StringBuilder collects the letters of the current word. We also turn every word into small letters, so `The` and `the` count as the same word

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        String line = "Sit down, Tommy. Sit!";
        ArrayList<String> words = new ArrayList<>();

        StringBuilder word = new StringBuilder();
        for (char ch : (line + " ").toCharArray()) {
            if (Character.isLetter(ch)) {
                word.append(Character.toLowerCase(ch));
            } else if (word.length() > 0) {
                words.add(word.toString());
                word.setLength(0);
            }
        }
        System.out.println(words);
    }
}
```

Output

```text
[sit, down, tommy, sit]
```

The extra space added at the end of the line makes sure the last word gets saved too. `setLength(0)` empties the StringBuilder for the next word

---

**Step 4: Counting the words**

A TreeMap from word to count, like in the TreeMap lesson. The total number of words and the number of different words come out of it for free

```text
TreeMap<String, Integer> count = new TreeMap<>();
for (String w : words) {
    count.put(w, count.getOrDefault(w, 0) + 1);
}
int total = 0;
for (int n : count.values()) {
    total += n;
}
System.out.println("Words: " + total);
System.out.println("Different words: " + count.size());
```

---

**Step 5: The longest word**

A stream over the keys, with `max` and a Comparator on the length. The keys of a TreeMap come in alphabetical order, and `max` keeps the first of two equal ones, so a tie goes to the word that comes first alphabetically

```text
String longest = count.keySet().stream()
    .max((a, b) -> a.length() - b.length())
    .orElse("");
```

---

**Step 6: The top three**

Sort the map's entries: the highest count first, and for the same count, alphabetical order. Then keep the first three with `limit(3)`

```java
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        TreeMap<String, Integer> count = new TreeMap<>();
        count.put("money", 3);
        count.put("cars", 1);
        count.put("boats", 3);
        count.put("guns", 2);

        count.entrySet().stream()
            .sorted((a, b) -> {
                if (!a.getValue().equals(b.getValue())) {
                    return b.getValue() - a.getValue();
                }
                return a.getKey().compareTo(b.getKey());
            })
            .limit(3)
            .forEach(e -> System.out.println(e.getKey() + " (" + e.getValue() + ")"));
    }
}
```

Output

```text
boats (3)
money (3)
guns (2)
```

`limit(n)` is one more stream step: it lets only the first n items through. Compare counts with `equals`, not `==`, because the values are `Integer` objects

---

## Mission: Ken's Letters

Build the analyzer from the steps above and run it on one of Ken's letters

The letter is in a `String text`, with `\n` between the lines. It always has at least one word. Save it to the file `letter.txt`, read it back, and print:

- `Lines: ` and how many lines the file has
- `Words: ` and how many words there are in all
- `Different words: ` and how many different words there are
- `Longest: ` and the longest word, the first in alphabetical order if several are that long
- `Top 3:` and then up to three lines `1. word (count)`, `2. ...`, `3. ...`, the most used words first, and alphabetical order for the same count

Words are runs of letters, counted in small letters

**Example**

```text
Lines: 2
Words: 13
Different words: 9
Longest: lance
Top 3:
1. the (3)
2. is (2)
3. money (2)
```

**Example**

```text
Lines: 1
Words: 1
Different words: 1
Longest: help
Top 3:
1. help (1)
```
