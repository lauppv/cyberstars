Pune împreună clasele și obiectele, `__init__`, metodele, `__str__` și atributele clasei

---

## Misiune: Echipajul de roboți

Roboții stației fac munca grea. Un robot consumă 10% din baterie pentru fiecare oră de muncă și refuză o sarcină pe care nu o poate termina. La finalul zilei, fiecare robot sub 50% merge la încărcătorul lui

1. Scrie o clasă **Robot** cu:
   - un atribut al clasei `facuti`, care numără câți roboți au fost făcuți
   - un `__init__` care primește un `nume`, setează atributele `nume` și `baterie` (care pornește de la 100) și adună 1 la `facuti`
   - o metodă **lucreaza(ore)** care ia bateria pentru sarcină și returnează True dacă robotul are destulă, sau nu schimbă nimic și returnează False dacă nu
   - o metodă **incarca()** care aduce bateria înapoi la 100
   - un `__str__` care returnează numele și bateria, ca `Rex (70%)`
2. Începe programul cu două variabile: **nume**, o listă de nume de roboți, și **sarcini**, o listă de string-uri, fiecare numele unui robot și un număr de ore, ca `"Rex 3"`. De exemplu `nume = ["Rex", "Bolt"]` și `sarcini = ["Rex 3", "Bolt 8", "Rex 8"]`
3. Fă câte un `Robot` pentru fiecare nume. Apoi, pentru fiecare sarcină, afișează sarcina, `: `, `gata` sau `prea obosit`, apoi `->` cu câte un spațiu de fiecare parte, și robotul, cum îl arată `__str__`
4. Încarcă fiecare robot cu mai puțin de 50% baterie și afișează `Incarcati: ` și numele lor unite cu `, `, în ordinea din **nume**, sau `niciunul`
5. Afișează `Roboti facuti: ` și numărul clasei

Sunt între 1 și 6 roboți, cu nume diferite, și între 0 și 15 sarcini, fiecare pentru un robot din listă, de 1 până la 10 ore

**Exemplu** pentru valorile de mai sus

```text
Rex 3: gata -> Rex (70%)
Bolt 8: gata -> Bolt (20%)
Rex 8: prea obosit -> Rex (70%)
Incarcati: Bolt
Roboti facuti: 2
```
