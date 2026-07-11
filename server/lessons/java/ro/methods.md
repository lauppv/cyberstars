Până acum tot codul nostru a stat înghesuit în **main**. O **metodă** este o bucată de cod căreia îi dăm un nume, o scriem **o singură dată** și o refolosim de câte ori vrem. De fapt ai folosit deja una de zeci de ori: **System.out.println** este o metodă

Hai să ne scriem propria metodă

```java
public class Main {
    public static void saluta(String nume) {
        System.out.println("Salut, " + nume);
    }

    public static void main(String[] args) {
        saluta("Cortez");
        saluta("Tommy Vercetti");
        saluta("Lance Vance");
    }
}
```

Ieșire

```text
Salut, Cortez
Salut, Tommy Vercetti
Salut, Lance Vance
```

Am scris logica de salut **o singură dată**, dar am folosit-o de trei ori. Hai să descompunem linia care declară metoda

```text
public static void saluta(String nume)
```

Fiecare parte are un sens — deocamdată explicăm doar esențialul

- **public** — oricine poate apela această metodă
- **static** — deocamdată, doar scrie-l. Îl vei înțelege în profunzime când vei studia clasele și obiectele
- **void** — metoda **nu** întoarce nimic (doar afișează ceva)
- **saluta** — numele metodei
- **(String nume)** — primește un **parametru** numit **nume**, de tip **String**. Observă tipul **înaintea** parametrului

Trebuie să punem **public static void** la început. Nu-ți face griji de ce deocamdată, doar ai încredere în acest tipar

---

O metodă poate și **întoarce** o valoare. În acel caz, în loc de **void**, scriem tipul valorii întoarse

```java
public class Main {
    public static int aduna(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        int rezultat = aduna(2, 3);
        System.out.println(rezultat);
    }
}
```

Output **5**

Metoda **aduna** primește două int-uri și întoarce un int. Înăuntru, folosim **return** ca să dăm înapoi valoarea. Imediat ce Java ajunge la **return**, metoda **iese imediat** — orice e scris după **return** este cod mort

Putem folosi rezultatul și direct într-o altă expresie

```java
public class Main {
    public static int aduna(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        System.out.println(aduna(2, 3) * 10);
    }
}
```

Output **50**. Java calculează mai întâi **aduna(2, 3) = 5**, apoi **5 \* 10 = 50**, apoi afișează

---

Tipul de retur **trebuie să se potrivească** cu ceea ce întoarcem de fapt

```text
public class Main {
    public static int aduna(int a, int b) {
        return "salut";   // eroare
    }
}
```

Metoda promite să întoarcă un **int**, dar încearcă să dea înapoi un **String**. Java refuză să compileze. Este unul dintre obiceiurile **stricte**, dar **utile**, ale Java — multe bug-uri sunt prinse înainte ca programul să ruleze măcar

---

O metodă **void** doar își face treaba și iese. Putem totuși folosi **return** singur (fără valoare) ca să ieșim mai devreme

```text
public class Main {
    public static void saluta(String nume) {
        if (nume.length() == 0) {
            return;   // iese mai devreme, niciun salut pentru nume goale
        }
        System.out.println("Salut, " + nume);
    }
}
```

---

## Misiune: Împărțirea Prăzii

După o lovitură reușită, Tommy împarte prada în mod egal între membrii echipei. Vrei o metodă care face calculul o singură dată și pe care o poți refolosi pentru fiecare lovitură.

Scrie o metodă care primește **prada totală** și **numărul de membri** din echipă și **întoarce** partea fiecăruia (folosește împărțirea întreagă — ce nu se împarte exact se pierde). Apoi, în **main**, stochează prada într-o variabilă numită `prada` și mărimea echipei într-o variabilă numită `membri`, apelează metoda și afișează o linie de forma `prada / membri = parte`.

**Exemplu**

Dacă prada e `10000` și echipa are `4` membri, programul tău ar trebui să afișeze

```text
10000 / 4 = 2500
```
