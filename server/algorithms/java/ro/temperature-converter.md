Creează o clasă **Temperatura** care stochează o valoare de temperatură și unitatea ei (`C` pentru Celsius, `F` pentru Fahrenheit). Adaugă două metode:

- `laCelsius()` — returnează valoarea în Celsius
- `laFahrenheit()` — returnează valoarea în Fahrenheit

Dacă temperatura este deja în unitatea țintă, returnează-o neschimbată. Folosește formulele:

- °F la °C: `(valoare - 32) * 5 / 9`
- °C la °F: `valoare * 9 / 5 + 32`

Citește o valoare și o unitate de la stdin. Afișează ambele conversii, rotunjite la o zecimală.

### Date de intrare

- Linia 1: valoarea (număr zecimal)
- Linia 2: unitatea (un singur caracter: `C` sau `F`)

### Rezultat

- Linia 1: `Celsius: X`
- Linia 2: `Fahrenheit: X`

(X formatat la o zecimală)

### Exemple

```
Intrare:
100.0
C

Ieșire:
Celsius: 100.0
Fahrenheit: 212.0
```

```
Intrare:
32.0
F

Ieșire:
Celsius: 0.0
Fahrenheit: 32.0
```

```
Intrare:
0.0
C

Ieșire:
Celsius: 0.0
Fahrenheit: 32.0
```

Direcția inversă: pornind de la 0°C se ajunge tot la 32°F.

```
Intrare:
-40.0
C

Ieșire:
Celsius: -40.0
Fahrenheit: -40.0
```

-40 este singurul punct în care scalele Celsius și Fahrenheit coincid.
