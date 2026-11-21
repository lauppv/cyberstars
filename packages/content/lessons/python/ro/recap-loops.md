Pune împreună range cu pas, enumerate, zip și listele imbricate

---

## Misiune: Manifestul de încărcătură

O navă cu provizii a andocat. Pentru fiecare fel de marfă nava are o listă de cutii, iar fiecare cutie are greutatea ei. Calculatorul stației are nevoie de un manifest, iar echipajul verifică de mână fiecare al treilea fel de marfă

1. Începe programul cu două variabile: **marfuri**, o listă de string-uri, și **cutii**, o listă de liste de numere întregi: greutățile cutiilor fiecărei mărfi, în kilograme, în aceeași ordine ca mărfurile. De exemplu `marfuri = ["apa", "mancare", "unelte", "combustibil"]` și `cutii = [[50, 50, 50], [20, 25], [], [80]]`
2. Pentru fiecare marfă, afișează numărul ei numărat de la 1, `. `, marfa, `: cutii `, câte cutii are, `, greutate ` și greutatea lor totală, apoi ` kg`
3. Afișează `Verificare: ` și mărfurile de pe pozițiile 0, 3, 6 și tot așa, unite cu `, `

Folosește `zip()` și `enumerate()`. Cele două liste au aceeași lungime, între 1 și 20 de mărfuri, iar fiecare marfă are între 0 și 10 cutii de 1 până la 100 kg

**Exemplu** pentru mărfurile și cutiile de mai sus

```text
1. apa: cutii 3, greutate 150 kg
2. mancare: cutii 2, greutate 45 kg
3. unelte: cutii 0, greutate 0 kg
4. combustibil: cutii 1, greutate 80 kg
Verificare: apa, combustibil
```
