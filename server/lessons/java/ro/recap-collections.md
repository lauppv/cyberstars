Combină **ArrayList**, **buclele pe ArrayList**, **HashMap**, și **buclele pe HashMap**

---

## Misiune: Registrul de Comerț al Stației

Postul de comerț al stației a înregistrat vânzările de azi, dar datele sunt brute. Intendentul are nevoie de un raport-sumar: câte din fiecare obiect s-au vândut, care obiect s-a vândut cel mai mult, și care obiecte sunt populare.

Datele sunt deja în dreapta:

```java
String[] sales = {"Sword", "Shield", "Potion", "Sword", "Potion", "Potion", "Armor", "Sword"};
```

Fă următoarele, în ordine:

1. Construiește un **`HashMap<String, Integer>`** care numără câte din fiecare obiect s-au vândut
2. Parcurge HashMap-ul și afișează fiecare obiect cu numărul lui
3. Găsește **cel mai bine vândut** (obiectul vândut cel mai mult) parcurgând HashMap-ul
4. Construiește un **`ArrayList<String>`** cu obiectele care s-au vândut de **mai multe ori**
5. Afișează cel mai bine vândut și lista cu obiectele populare

Notă: dacă două obiecte sunt la egalitate pentru primul loc, oricare dintre ele e bun.

**Output**

```text
Sword: 3
Shield: 1
Potion: 3
Armor: 1
Best seller: Sword
Popular items: [Sword, Potion]
```
