Știi cum să creezi un HashMap și să adaugi lucruri. Acum hai să-l **parcurgem** — pentru că apelarea manuală a lui **.get()** pentru fiecare cheie devine plictisitoare repede când ai 50 de intrări

---

**Modul 1: Parcurge cheile cu keySet()**

Metoda **.keySet()** îți dă toate cheile. Le poți parcurge cu o buclă for-each, apoi folosești **.get(cheie)** ca să iei fiecare valoare

```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> scoruri = new HashMap<String, Integer>();
        scoruri.put("Tommy", 9500);
        scoruri.put("Lance", 7200);
        scoruri.put("Phil", 3100);

        for (String nume : scoruri.keySet()) {
            System.out.println(nume + " a făcut " + scoruri.get(nume) + " puncte");
        }
    }
}
```

Rezultat (ordinea poate varia deoarece HashMap nu garantează ordinea)

```text
Tommy a făcut 9500 puncte
Phil a făcut 3100 puncte
Lance a făcut 7200 puncte
```

Citește **for (String nume : scoruri.keySet())** ca: "pentru fiecare String numit nume **din** mulțimea de chei." Este ca **for name in scores:** din Python

---

**Modul 2: Parcurge intrările cu entrySet()**

Uneori vrei **și** cheia **și** valoarea în același timp fără să apelezi **.get()** separat. Asta îți dă **entrySet()** — o mulțime de obiecte **Map.Entry**, fiecare ținând o pereche cheie-valoare

```java
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> scoruri = new HashMap<String, Integer>();
        scoruri.put("Tommy", 9500);
        scoruri.put("Lance", 7200);
        scoruri.put("Phil", 3100);

        for (Map.Entry<String, Integer> intrare : scoruri.entrySet()) {
            System.out.println(intrare.getKey() + " -> " + intrare.getValue());
        }
    }
}
```

Rezultat (ordinea poate varia)

```text
Tommy -> 9500
Phil -> 3100
Lance -> 7200
```

Da, **Map.Entry\<String, Integer\>** arată intimidant. Hai să-l descompunem

- **Map.Entry** este un tip care reprezintă o pereche cheie-valoare
- **\<String, Integer\>** se potrivește cu tipurile HashMap-ului tău
- **intrare.getKey()** îți dă cheia
- **intrare.getValue()** îți dă valoarea

E mai mult de scris decât keySet(), dar este puțin mai eficient pentru map-uri mari pentru că nu trebuie să cauți fiecare valoare separat

---

În Python, asta ar fi

```python
for name, score in scores.items():
    print(f"{name} -> {score}")
```

**.items()** din Python este ca **.entrySet()** din Java, iar **.keys()** din Python este ca **.keySet()** din Java. Aceleași concepte, sintaxă diferită

---

Hai să facem ceva practic. Sonny Forelli vrea să afle care membri ai echipajului îi datorează mai mult de $5000

```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> datorii = new HashMap<String, Integer>();
        datorii.put("Tommy", 10000);
        datorii.put("Lance", 3000);
        datorii.put("Phil", 7500);
        datorii.put("Cortez", 500);

        for (String nume : datorii.keySet()) {
            if (datorii.get(nume) > 5000) {
                System.out.println(nume + " datorează $" + datorii.get(nume));
            }
        }
    }
}
```

Asta afișează doar Tommy și Phil (ei datorează mai mult de 5000). Bucla verifică fiecare intrare și filtrează în funcție de valoare

---

Poți de asemenea parcurge doar **valorile** cu **.values()**, deși asta este mai puțin frecvent deoarece de obicei vrei și cheia

```java
public class Main {
    public static void main(String[] args) {
        int total = 0;
        for (int datorie : datorii.values()) {
            total += datorie;
        }
        System.out.println("Total datorii: $" + total);
    }
}
```

Rezultat **Total datorii: $21000**

---

## Misiune: Scanner de Frecvențe ale Semnalelor

Antena de comunicații a stației a interceptat semnale cu cuvinte cheie din spațiul adânc. Sarcina ta este să scanezi jurnalul și să marchezi orice cuvânt cheie care a apărut de mai multe ori — acelea ar putea fi apeluri de ajutor repetate.

Creează un **HashMap\<String, Integer\>** numit `contor_cuvinte` cu aceste intrări de semnale:

1. `"java"` a apărut de `5` ori
2. `"python"` a apărut de `3` ori
3. `"bug"` a apărut de `1` dată
4. `"loop"` a apărut de `1` dată
5. `"class"` a apărut de `4` ori

Parcurge map-ul și afișează doar cuvintele cheie care apar de mai multe ori, în formatul `cuvant: contor`.

**Input** (deja setat în codul tău — schimbă valorile ca să testezi):

- `"java"`, `"python"`, `"bug"`, `"loop"`, `"class"` — cuvintele cheie interceptate
- `5`, `3`, `1`, `1`, `4` — de câte ori a fost detectat fiecare

**Exemplu**

Cu valorile de start, programul tău ar trebui să afișeze (ordinea poate varia)

```text
java: 5
python: 3
class: 4
```
