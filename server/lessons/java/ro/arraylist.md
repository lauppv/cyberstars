Array-urile sunt grozave, dar au o limitare mare: **mărimea lor este fixă**. Odată ce creezi un array cu 5 elemente, este blocat la 5. Nu poți adăuga un al 6-lea. În programele reale, adesea nu știi câte elemente vei avea nevoie. Intră în scenă **ArrayList**

Un **ArrayList** este un **array dinamic** — crește și se micșorează după nevoie. În Python, listele obișnuite funcționează deja așa (doar faci **append** la lucruri). În Java, ai nevoie de ArrayList pentru acea flexibilitate

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> echipaj = new ArrayList<String>();
        echipaj.add("Tommy Vercetti");
        echipaj.add("Lance Vance");
        echipaj.add("Phil Cassidy");

        System.out.println(echipaj);
    }
}
```

Output

```text
[Tommy Vercetti, Lance Vance, Phil Cassidy]
```

Câteva lucruri de desfăcut aici

---

Mai întâi, **import**-ul. ArrayList trăiește în pachetul **java.util**, așa că trebuie să-l importăm în partea de sus a fișierului. Asta este ca **from collections import something** din Python — Java doar are nevoie să fii explicit despre ce folosești

---

Apoi, partea **\<String\>**. Asta se numește **tip generic**. Îi spune lui Java ce tip de lucruri ține lista. Gândește-te la ea ca la o etichetă pe o cutie: **ArrayList\<String\>** este „o listă care ține String-uri." Poți avea și **ArrayList\<Integer\>**, **ArrayList\<Double\>**, etc.

O mică capcană: nu poți folosi tipuri primitive precum **int** sau **double** direct. Trebuie să folosești versiunile lor „wrapper": **Integer**, **Double**, **Boolean**. Java convertește automat între ele, așa că este în mare parte nedureros

```java
public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> scoruri = new ArrayList<Integer>();
        scoruri.add(100);    // Java convertește automat int 100 în Integer 100
        scoruri.add(85);
        scoruri.add(92);
        System.out.println(scoruri);   // [100, 85, 92]
    }
}
```

---

Principalele metode pe care le vei folosi pe un ArrayList

**add(element)** — adaugă un element la final

```java
public class Main {
    public static void main(String[] args) {
        ArrayList<String> lista = new ArrayList<String>();
        lista.add("primul");
        lista.add("al doilea");
        // lista este acum [primul, al doilea]
    }
}
```

**get(indice)** — ia elementul de la acel indice (începând de la 0, ca array-urile)

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(lista.get(0));   // primul
        System.out.println(lista.get(1));   // al doilea
    }
}
```

**size()** — returnează câte elemente sunt în listă

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(lista.size());   // 2
    }
}
```

Observă că este **.size()** cu paranteze, nu **.length** ca la array-uri. Da, asta este încă una dintre inconsecvențele fermecătoare ale lui Java

**remove(indice)** — elimină elementul de la acel indice și mută tot ce vine după el în jos

```java
public class Main {
    public static void main(String[] args) {
        lista.remove(0);   // elimină "primul"
        // lista este acum [al doilea]
    }
}
```

---

Hai să vedem totul împreună. Lance gestionează lista de invitați a lui Cortez pentru o petrecere pe iaht

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> invitati = new ArrayList<String>();

        invitati.add("Tommy");
        invitati.add("Lance");
        invitati.add("Mercedes");
        invitati.add("Sonny");

        System.out.println("Numar invitati: " + invitati.size());
        System.out.println("Primul invitat: " + invitati.get(0));

        // Sonny NU este invitat
        invitati.remove(3);
        System.out.println("Dupa eliminare: " + invitati);
    }
}
```

Output

```text
Numar invitati: 4
Primul invitat: Tommy
Dupa eliminare: [Tommy, Lance, Mercedes]
```

---

În Python, asta ar fi

```python
invitati = ["Tommy", "Lance", "Mercedes", "Sonny"]
print(len(invitati))
print(invitati[0])
invitati.pop(3)   # sau del invitati[3]
print(invitati)
```

Destul de asemănător! Java doar are nevoie de mai mult ceremonial cu tipurile

---

## Misiune: Playlist Sala de Recreere

Sala de recreere a stației ține un playlist dinamic de jocuri. Construiește-l pas cu pas:

1. Creează un `ArrayList<String>` numit `jocuri`
2. Adaugă trei jocuri: `"GTA"`, `"Minecraft"`, `"Zelda"`
3. Adaugă un al 4-lea joc: `"Elden Ring"`
4. Elimină al 2-lea joc (indicele 1)
5. Afișează fiecare joc rămas pe linia lui folosind o buclă for cu `.get(i)` și `.size()`

**Exemplu**

După adăugări și eliminare, programul tău ar trebui să afișeze

```text
GTA
Zelda
Elden Ring
```
