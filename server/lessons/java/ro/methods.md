În Python le-am numit **funcții**. În Java, sunt de obicei numite **metode**. Ideea este aceeași: o bucată de cod pe care o scriem **o singură dată** și o refolosim de multe ori

```java
public class Main {
    public static void saluta(String nume) {
        System.out.println("Salut, " + nume + "!");
    }

    public static void main(String[] args) {
        saluta("Cortez");
        saluta("Tommy Vercetti");
        saluta("Lance Vance");
    }
}
```

Output

```text
Salut, Cortez!
Salut, Tommy Vercetti!
Salut, Lance Vance!
```

Hai să descompunem asta. Linia

```java
public class Main {
    public static void saluta(String nume)
}
```

declară o metodă numită **saluta**. Fiecare parte are un sens, și vom explica deocamdată doar esențialul

- **public** — oricine poate apela această metodă
- **static** — deocamdată, doar scrie-l. Îl vei înțelege în profunzime când vei studia clasele și obiectele
- **void** — metoda **NU** întoarce nimic (doar afișează)
- **saluta** — numele metodei
- **(String nume)** — primește un **parametru** numit **nume**, de tip **String**. Observă tipul **înaintea** parametrului, nu după

Trebuie să punem **public static void** la început. Nu-ți face griji de ce deocamdată, doar **ai încredere în boilerplate** :)

---

O metodă poate și **întoarce** o valoare. În acel caz, în loc de **void**, scriem tipul de retur

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

Metoda **aduna** primește două int-uri și întoarce un int. Înăuntru, folosim **return** ca să dăm înapoi valoarea. Imediat ce Java ajunge la **return**, metoda **iese imediat** — orice scris după **return** este cod mort

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

```java
public class Main {
    public static int aduna(int a, int b) {
        return "hello";   // EROARE
    }
}
```

Metoda promite să întoarcă un **int**, dar încearcă să dea înapoi un **String**. Java refuză să compileze. Este unul dintre obiceiurile **stricte**, dar **utile**, ale Java — multe bug-uri sunt prinse înainte ca programul să ruleze măcar :)

---

O metodă fără **return**, declarată ca **void**, doar își face treaba și iese. Putem totuși folosi **return** singur (fără valoare) ca să ieșim mai devreme

```java
public class Main {
    public static void saluta(String nume) {
        if (nume.length() == 0) {
            return;   // iese mai devreme, niciun salut pentru nume goale
        }
        System.out.println("Salut, " + nume + "!");
    }
}
```

---

## Misiune: Calculatorul Navei

Calculatorul de bord al stației are nevoie de o metodă **calculator**. Deja se ocupă de adunare, dar echipajul are nevoie și de **scădere** (`-`), **înmulțire** (`*`) și **împărțire** (`/`).

Completează metoda `calculator` din dreapta ca să trateze toți cei patru operatori. Pentru orice operator nerecunoscut, ar trebui să afișeze `Operator invalid`.

Metoda primește trei parametri: `numar1`, `numar2` și `operator`. Ar trebui să afișeze o linie de forma `14 + 12 = 26`.

O mică **capcană**: în Java, compari șirurile cu `.equals(...)`, **NU** cu `==`. Deci scrie `operator.equals("+")`, nu `operator == "+"`.

**Input** (apelurile sunt deja în `main` — schimbă valorile ca să testezi):

- `numar1` — primul operand
- `numar2` — al doilea operand
- `operator` — unul dintre `"+"`, `"-"`, `"*"`, `"/"`

**Exemplu**

Cu apelurile de start, programul tău ar trebui să afișeze

```text
14 + 12 = 26
10 - 3 = 7
5 * 4 = 20
10 / 2 = 5
Operator invalid
```
