Put together dictionary and set comprehensions, generators and generator expressions

---

## Mission: Sensor Stream

The station's sensors send a stream of short lines. Each line is a sensor's name, a colon, and a whole number it measured, like `temp:21`. A sensor can send many lines, and the newest value is the one that counts

1. Start your program with a variable **stream**, a list of strings. For example `stream = ["temp:21", "air:98", "temp:23", "noise:4"]`
2. Write a generator **parse(lines)** that hands out one pair for each line: the sensor's name and its value as a whole number. Use `yield`
3. Print `Sensors: ` and the sorted list of the sensors' names, each name once, made with a set comprehension
4. Print `Latest: ` and a dictionary with each sensor's newest value, made with a dictionary comprehension. The sensors are in the order they first appear in the stream
5. Print `Sum: ` and the total of all the values in the stream, made with a generator expression

**stream** has from 1 to 30 lines. A name has from 1 to 10 small letters, and a value is from -1000 to 1000

**Example** for the stream above

```text
Sensors: ['air', 'noise', 'temp']
Latest: {'temp': 23, 'air': 98, 'noise': 4}
Sum: 146
```

`temp` stays first in Latest, where it first appears, but it holds 23, its newest value
