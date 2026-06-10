# Easy · Temperature Converter

Creează o clasă **Temperature** care stochează o valoare de temperatură și unitatea ei (`C` pentru Celsius, `F` pentru Fahrenheit). Adaugă două metode:

- `toCelsius()` — returnează valoarea în Celsius
- `toFahrenheit()` — returnează valoarea în Fahrenheit

Dacă temperatura este deja în unitatea țintă, returnează-o neschimbată. Folosește formulele:

- °F la °C: `(value - 32) * 5 / 9`
- °C la °F: `value * 9 / 5 + 32`

Citește o valoare și o unitate de la stdin. Afișează ambele conversii, rotunjite la o zecimală.

### Date de intrare

- Linia 1: un double și un caracter separate printr-un spațiu — valoarea și unitatea (ex. `100.0 C`)

### Rezultat

- Linia 1: `Celsius: X`
- Linia 2: `Fahrenheit: X`

(X formatat la o zecimală)

### Exemple

```
Intrare:
100.0 C

Ieșire:
Celsius: 100.0
Fahrenheit: 212.0
```

```
Intrare:
32.0 F

Ieșire:
Celsius: 0.0
Fahrenheit: 32.0
```

### Indicii

- Folosește `double` pentru valoarea temperaturii pentru a gestiona zecimalele.
- `String.format("%.1f", value)` formatează un double la o zecimală.
- Stochează unitatea ca un câmp `char` sau `String` în clasa ta.
- Gândește-te care metodă necesită o conversie și care returnează doar valoarea stocată.
