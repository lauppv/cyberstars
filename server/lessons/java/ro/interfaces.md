O **interfață** este ca un contract. Spune „orice clasă care mă implementează TREBUIE să aibă aceste metode." Este similară cu o clasă abstractă, dar și mai strictă — o interfață nu poate avea câmpuri obișnuite sau constructori (cu câteva excepții pe care le sărim deocamdată)

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

Observă că metoda din clasă trebuie să fie **public**. Metodele de interfață sunt mereu publice în mod implicit, așa că și implementarea ta trebuie să fie

---

În Python, ai folosi poate duck typing — „dacă are o metodă `afiseazaInfo`, e printabil." Java nu are atâta încredere în tine. Java vrea un contract semnat: `implements Afisabil`. Apoi ȘTIE la compilare că metoda există

---

Diferența mare dintre interfețe și clase abstracte: o clasă poate implementa **mai multe** interfețe, dar poate extinde doar **O SINGURĂ** clasă

```java
interface Afisabil {
    void afiseazaInfo();
}

interface Salvabil {
    void salveaza();
}

class Document implements Afisabil, Salvabil {
    @Override
    public void afiseazaInfo() {
        System.out.println("Info document");
    }

    @Override
    public void salveaza() {
        System.out.println("Document salvat!");
    }
}
```

Acesta este răspunsul Java la moștenirea multiplă. În Python poți face `class Caine(Animal, AnimalCompanie):` — în Java, ai face `class Caine extends Animal implements AnimalCompanie`. O singură clasă părinte, dar câte interfețe vrei

---

Gândește-te la asta ca la misiunile din GTA. Tommy Vercetti este un `Criminal` (clasa lui părinte). Dar el și `implements Inotator, Sofer, Tragator`. Acestea sunt toate „contracte" — abilități pe care le are. Personaje diferite ar putea implementa combinații diferite. Lance implementează `Sofer, Tragator` dar poate nu și `Inotator`. Cortez implementează `Comandant, Negociator`

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
        Carte c = new Carte("1984", "George Orwell");
        Film f = new Film("Inception", "Christopher Nolan");
        c.afiseazaInfo();
        f.afiseazaInfo();
    }
}
```

Output

```text
Carte: 1984 de George Orwell
Film: Inception regizat de Christopher Nolan
```

Și exact ca la polimorfism, poți folosi tipul interfeței pentru variabile

```java
public class Main {
    public static void main(String[] args) {
        Afisabil[] elemente = { new Carte("1984", "Orwell"), new Film("Inception", "Nolan") };
        for (Afisabil el : elemente) {
            el.afiseazaInfo();
        }
    }
}
```

---

**Când folosim interfață vs clasă abstractă?**

- **Interfață**: când vrei să definești o capabilitate pe care clase neînrudite o pot împărtăși. Cărțile și filmele nu sunt înrudite, dar amândouă pot fi Afisabil
- **Clasă abstractă**: când ai o familie de clase înrudite care împart cod comun. Câinii și pisicile sunt amândoi Animale, și împart câmpuri precum `nume`

Le poți chiar combina: `abstract class Animal implements Afisabil`

---

## Misiune: Catalogul Arhivei Stației

Arhiva digitală a stației spațiale conține atât cărți, cât și filme, dar vechiul software de catalog s-a prăbușit. Trebuie să reconstruiești sistemul de listare folosind o interfață `Afisabil` comună, astfel încât fiecare element să se poată descrie singur.

1. Creează o interfață `Afisabil` cu o metodă `afiseazaInfo()`
2. Creează o clasă `Carte` cu câmpurile `titlu` și `autor` care implementează `Afisabil` — `afiseazaInfo()` ar trebui să afișeze `"Carte: TITLU de AUTOR"`
3. Creează o clasă `Film` cu câmpurile `titlu` și `regizor` care implementează `Afisabil` — `afiseazaInfo()` ar trebui să afișeze `"Film: TITLU regizat de REGIZOR"`
4. În main, creează un `Carte("Vice City Stories", "Rockstar")` și un `Film("Scarface", "Brian De Palma")`, apoi apelează `afiseazaInfo()` pe amândouă

**Output**

```text
Carte: Vice City Stories de Rockstar
Film: Scarface regizat de Brian De Palma
```
