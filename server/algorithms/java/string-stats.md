Create a **StringAnalyzer** class that takes a string in its constructor and provides three methods:

- `vowelCount()` — returns the number of vowels (a, e, i, o, u — case-insensitive)
- `consonantCount()` — returns the number of consonants (letters that are not vowels)
- `wordCount()` — returns the number of words (separated by spaces)

Read a single line of text from stdin. Create a `StringAnalyzer` and print the three stats.

### Input

- Line 1: a string of text (letters and spaces only)

### Output

- Line 1: `Vowels: X`
- Line 2: `Consonants: X`
- Line 3: `Words: X`

### Examples

```
Input:
Hello World

Output:
Vowels: 3
Consonants: 7
Words: 2
```

```
Input:
Java is fun

Output:
Vowels: 4
Consonants: 5
Words: 3
```

```
Input:
Sky

Output:
Vowels: 0
Consonants: 3
Words: 1
```

`y` is not counted as a vowel here — only a, e, i, o, u count, so all three
letters in "Sky" are consonants.
