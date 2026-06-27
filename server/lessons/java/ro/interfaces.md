O **interfață** este ca un contract. Spune „orice clasă care mă implementează TREBUIE să aibă aceste metode." Seamănă cu o clasă abstractă, dar e și mai strictă — o interfață nu poate avea câmpuri obișnuite sau constructori (cu câteva excepții pe care le sărim deocamdată)

```java
interface Afisabil {
    void afiseazaInfo();
}
```

Asta e tot. Niciun corp, niciun câmp, doar semnături de metode. Orice clasă care spune `implements Afisabil` TREBUIE să furnizeze o metodă `afiseazaInfo()`

```java
class Carte implements Afisabil {
    String titlu;
    String autor;

    Carte(String titlu, String autor) {
        this.titlu = titlu;
        this.autor = autor;
    }

    @Override
    public void afiseazaInfo() {
        System.out.println("Carte: " + titlu + " de " + autor);
    }
}
```

Observă că metoda din clasă trebuie să fie **public**. Metodele de interfață sunt mereu publice implicit, așa că și implementarea ta trebuie să fie la fel

---

Marea diferență dintre interfețe și clase abstracte: o clasă poate implementa **mai multe** interfețe, dar poate extinde doar **O SINGURĂ** clasă

```java
interface Sofer {
    void conduce();
}

interface Tragator {
    void trage();
}

class Asociat implements Sofer, Tragator {
    @Override
    public void conduce() {
        System.out.println("Conduc masina de evadare");
    }

    @Override
    public void trage() {
        System.out.println("Acopar echipa");
    }
}
```

Acesta este răspunsul Java la moștenirea multiplă: o singură clasă părinte, dar câte interfețe vrei

---

Gândește-te la asta ca la abilitățile din Vice City. Tommy Vercetti este un `Criminal` (clasa lui părinte). Dar el și `implements Inotator, Sofer, Tragator` — sunt „contracte", abilități pe care le are. Personaje diferite implementează combinații diferite: Lance implementează `Sofer, Tragator`, dar poate nu și `Inotator`. Cortez implementează `Comandant, Negociator`

---

Iată un exemplu complet

```java
interface Afisabil {
    void afiseazaInfo();
}

class Carte implements Afisabil {
    String titlu, autor;

    Carte(String titlu, String autor) {
        this.titlu = titlu;
        this.autor = autor;
    }

    @Override
    public void afiseazaInfo() {
        System.out.println("Carte: " + titlu + " de " + autor);
    }
}

class Film implements Afisabil {
    String titlu, regizor;

    Film(String titlu, String regizor) {
        this.titlu = titlu;
        this.regizor = regizor;
    }

    @Override
    public void afiseazaInfo() {
        System.out.println("Film: " + titlu + " regizat de " + regizor);
    }
}

public class Main {
    public static void main(String[] args) {
        Carte c = new Carte("Manualul Mafiotului", "Sonny Forelli");
        Film f = new Film("Scarface", "Brian De Palma");
        c.afiseazaInfo();
        f.afiseazaInfo();
    }
}
```

Output

```text
Carte: Manualul Mafiotului de Sonny Forelli
Film: Scarface regizat de Brian De Palma
```

Și exact ca la polimorfism, poți folosi tipul interfeței pentru variabile

```java
public class Main {
    public static void main(String[] args) {
        Afisabil[] elemente = { new Carte("Manualul Mafiotului", "Sonny Forelli"), new Film("Scarface", "Brian De Palma") };
        for (Afisabil el : elemente) {
            el.afiseazaInfo();
        }
    }
}
```

---

**Când folosim interfață vs clasă abstractă?**

- **Interfață**: când vrei să definești o capabilitate pe care clase neînrudite o pot împărtăși. O carte și un film nu sunt înrudite, dar amândouă pot fi Afisabil
- **Clasă abstractă**: când ai o familie de clase înrudite care împart cod comun. Un `Sofer` și un `Tragator` sunt amândoi `Criminal` și împart câmpuri precum `nume`

Le poți chiar combina: `abstract class Criminal implements Afisabil`

---

## Misiune: Catalogul lui Tommy

Tommy ține în vila lui din Vice City o colecție amestecată: cărți și filme. Vrea un catalog care listează fiecare obiect, indiferent de tip. Construiește-l folosind o interfață `Afisabil` comună, astfel încât fiecare element să se poată descrie singur.

1. Creează o interfață `Afisabil` cu o metodă `afiseazaInfo()`
2. Creează o clasă `Carte` cu câmpurile `titlu` și `autor` care implementează `Afisabil` — `afiseazaInfo()` afișează `"Carte: TITLU de AUTOR"`
3. Creează o clasă `Film` cu câmpurile `titlu` și `regizor` care implementează `Afisabil` — `afiseazaInfo()` afișează `"Film: TITLU regizat de REGIZOR"`
4. În `main`, creează un `Carte("Cronicile din Vice City", "Tommy Vercetti")` și un `Film("Top Gun", "Tony Scott")`, apoi apelează `afiseazaInfo()` pe amândouă

**Output**

```text
Carte: Cronicile din Vice City de Tommy Vercetti
Film: Top Gun regizat de Tony Scott
```
