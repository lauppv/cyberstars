Uneori vrei o clasă care este un **șablon** — definește ce TREBUIE să facă clasele copil, dar nu poate fi folosită singură. Asta este o **clasă abstractă**

Gândește-te așa: „Vehicul" este un concept. Nu poți construi pur și simplu un „vehicul" generic — construiești o mașină, un camion, o motocicletă. Dar toate împărtășesc ideea de a fi un vehicul. În Java, ai face Vehicul **abstract**

```java
abstract class Vehicul {
    String nume;

    Vehicul(String nume) {
        this.nume = nume;
    }

    abstract String tipCombustibil();  // fără corp! copiii TREBUIE să implementeze asta

    void claxon() {
        System.out.println(nume + " face BIP!");
    }
}
```

Două lucruri cheie aici:

- Clasa este marcată `abstract` — NU poți face `new Vehicul("ceva")`
- Metoda `tipCombustibil()` este marcată `abstract` — NU are corp (fără acolade), doar un punct și virgulă. Orice copil ne-abstract TREBUIE să furnizeze corpul

---

```java
public class Main {
    public static void main(String[] args) {
        Vehicul v = new Vehicul("test");  // EROARE DE COMPILARE! Nu poți instanția o clasă abstractă
    }
}
```

Este ca și cum ai încerca să cumperi un „vehicul" la un dealer. Vânzătorul ar spune „ce FEL de vehicul?" Ai nevoie de un tip concret

---

O clasă copil care extinde o clasă abstractă TREBUIE să implementeze toate metodele abstracte — sau trebuie să fie ea însăși abstractă

```java
abstract class Vehicul {
    String nume;
    Vehicul(String nume) { this.nume = nume; }
    abstract String tipCombustibil();
}

class MasinaElectrica extends Vehicul {
    MasinaElectrica(String nume) {
        super(nume);
    }

    @Override
    String tipCombustibil() {
        return "Electric";
    }
}

class CamionBenzina extends Vehicul {
    CamionBenzina(String nume) {
        super(nume);
    }

    @Override
    String tipCombustibil() {
        return "Benzina";
    }
}

public class Main {
    public static void main(String[] args) {
        MasinaElectrica tesla = new MasinaElectrica("Tesla Model 3");
        CamionBenzina camion = new CamionBenzina("Ford F-150");
        System.out.println(tesla.nume + ": " + tesla.tipCombustibil());
        System.out.println(camion.nume + ": " + camion.tipCombustibil());
    }
}
```

Output

```text
Tesla Model 3: Electric
Ford F-150: Benzina
```

---

O clasă abstractă poate avea **atât** metode abstracte (pe care copiii trebuie să le implementeze) **cât și** metode **obișnuite** (pe care copiii le moștenesc gratuit)

```java
abstract class Personaj {
    String nume;
    int viata;

    Personaj(String nume, int viata) {
        this.nume = nume;
        this.viata = viata;
    }

    // Abstract — fiecare personaj luptă diferit
    abstract void ataca();

    // Concret — toate personajele primesc daune la fel
    void primesteDaune(int cantitate) {
        viata -= cantitate;
        System.out.println(nume + " primește " + cantitate + " daune! HP: " + viata);
    }
}
```

Tommy Vercetti și Lance Vance ar extinde amândoi `Personaj`. Fiecare ar avea propriul stil de `ataca()`, dar `primesteDaune()` funcționează la fel pentru toți

---

**Când folosești o clasă abstractă vs o clasă obișnuită?**

Folosește o **clasă obișnuită** când are sens să creezi obiecte de acel tip direct. Un `Caine` este un lucru real — poți crea unul

Folosește o **clasă abstractă** când clasa este doar un concept sau o categorie. „Formă" este abstractă — nu există așa ceva ca o formă generică. „Animal" ar putea fi oricare dintre cele două, în funcție de designul tău

Regula de bază: dacă nu ai vrea niciodată ca cineva să scrie `new ClasaTa()`, fă-o abstractă

---

În Python nu există un cuvânt cheie `abstract` încorporat — ai folosi modulul `abc`. Java îl face o caracteristică de primă clasă, pentru că lui Java îi place să fie explicit despre orice

---

## Misiune: Raport Combustibil Flotă

Flota terestră a stației are diferite tipuri de vehicule, fiecare funcționând pe un combustibil diferit. Ofițerul de logistică are nevoie de un raport care să arate fiecare vehicul și tipul său de combustibil — dar „Vehicul" în sine este doar un concept, nu ceva ce poți construi direct.

Creează o clasă abstractă `Vehicul` cu un câmp `String nume`, un constructor și o metodă abstractă `tipCombustibil()` care returnează un String. Apoi creează două clase concrete:

1. `MasinaElectrica` — `tipCombustibil()` returnează `"Electric"`
2. `CamionBenzina` — `tipCombustibil()` returnează `"Benzina"`

În `main`, creează o MasinaElectrica numită `"Tesla"` și un CamionBenzina numit `"Ford"`. Afișează fiecare în formatul `Nume: TipCombustibil`.

**Input** (deja setat în codul tău — schimbă valorile ca să testezi):

- `"Tesla"` — numele mașinii electrice
- `"Ford"` — numele camionului pe benzină

**Exemplu**

Cu valorile de start, programul tău ar trebui să afișeze

```text
Tesla: Electric
Ford: Benzina
```
