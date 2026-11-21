Put together `raise`, your own exceptions, and `else` and `finally`

---

## Mission: Airlock Control

The airlock opens only when the pressure inside is safe: from 90 to 110. The pressure arrives as text from a sensor that sometimes sends noise. After every try, safe or not, the airlock runs its seal check

1. Write a class **AirlockError** that inherits from `Exception`, and a class **PressureError** that inherits from it. `PressureError` takes the pressure, keeps it as `pressure`, and has the message `pressure` and the pressure and `out of range`, like `pressure 85 out of range`
2. Write a function **open_airlock(text)** that turns the text into a whole number, raises `PressureError` when the number is below 90 or above 110, and returns `opened` otherwise. A text that isn't a number raises Python's own `ValueError`, which the function leaves alone
3. Start your program with a variable **readings**, a list of strings. For example `readings = ["100", "85", "abc", "110"]`
4. For each reading, call `open_airlock()` inside `try`. Print the reading, `: ` and:
   - on a `PressureError`, its message
   - on a `ValueError`, `not a number`
   - in `else`, what the function returned
5. In `finally`, count the seal checks. At the end, print `Opened: ` and how many times the airlock opened, `Seal checks: ` and how many checks ran, and `Farthest: ` and the pressure of the `PressureError` farthest from 100, or `none` if there was none. If two are as far, take the first

**readings** has from 1 to 10 readings

**Example** for the values above

```text
100: opened
85: pressure 85 out of range
abc: not a number
110: opened
Opened: 2
Seal checks: 4
Farthest: 85
```
