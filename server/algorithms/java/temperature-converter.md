# Easy · Temperature Converter

Create a **Temperature** class that stores a temperature value and its unit (`C` for Celsius, `F` for Fahrenheit). Add two methods:

- `toCelsius()` — returns the value in Celsius
- `toFahrenheit()` — returns the value in Fahrenheit

If the temperature is already in the target unit, return it unchanged. Use the formulas:
- °F to °C: `(value - 32) * 5 / 9`
- °C to °F: `value * 9 / 5 + 32`

Read a value and unit from stdin. Print both conversions, rounded to one decimal place.

### Input
- Line 1: a double and a character separated by a space — the value and unit (e.g. `100.0 C`)

### Output
- Line 1: `Celsius: X`
- Line 2: `Fahrenheit: X`

(X formatted to one decimal place)

### Examples

```
Input:
100.0 C

Output:
Celsius: 100.0
Fahrenheit: 212.0
```

```
Input:
32.0 F

Output:
Celsius: 0.0
Fahrenheit: 32.0
```

### Hints
- Use `double` for the temperature value to handle decimals.
- `String.format("%.1f", value)` formats a double to one decimal place.
- Store the unit as a `char` or `String` field in your class.
- Think about which method needs a conversion and which just returns the stored value.
