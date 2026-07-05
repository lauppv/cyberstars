# Easy · Temperature Converter

Create a **Temperature** class that stores a temperature value and its unit (`C` for Celsius, `F` for Fahrenheit). Add two methods:

- `toCelsius()` — returns the value in Celsius
- `toFahrenheit()` — returns the value in Fahrenheit

If the temperature is already in the target unit, return it unchanged. Use the formulas:

- °F to °C: `(value - 32) * 5 / 9`
- °C to °F: `value * 9 / 5 + 32`

Read a value and unit from stdin. Print both conversions, rounded to one decimal place.

### Input

- Line 1: the value (decimal number)
- Line 2: the unit (a single character: `C` or `F`)

### Output

- Line 1: `Celsius: X`
- Line 2: `Fahrenheit: X`

(X formatted to one decimal place)

### Examples

```
Input:
100.0
C

Output:
Celsius: 100.0
Fahrenheit: 212.0
```

```
Input:
32.0
F

Output:
Celsius: 0.0
Fahrenheit: 32.0
```

```
Input:
0.0
C

Output:
Celsius: 0.0
Fahrenheit: 32.0
```

The reverse direction: starting from 0°C also lands on 32°F.

```
Input:
-40.0
C

Output:
Celsius: -40.0
Fahrenheit: -40.0
```

-40 is the one point where the Celsius and Fahrenheit scales agree.
