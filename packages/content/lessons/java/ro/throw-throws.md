Până acum, Java arunca excepțiile: împărțire la zero, un index greșit, un text care nu e număr. Și codul tău poate arunca una, cu **throw**. O faci când ceva e greșit și metoda nu poate continua

```java
public class Main {
    static int imparte(int bani, int oameni) {
        if (oameni <= 0) {
            throw new IllegalArgumentException("Nu am cu cine să împart");
        }
        return bani / oameni;
    }

    public static void main(String[] args) {
        System.out.println(imparte(900, 3));
        System.out.println(imparte(900, 0));
        System.out.println("Gata");
    }
}
```

Ieșire

```text
300
```

Apoi programul se oprește cu `IllegalArgumentException: Nu am cu cine să împart`. „Gata” nu se mai afișează. `throw` încheie metoda pe loc, ca un `return`, dar cu o eroare

---

`new IllegalArgumentException("...")` face un obiect excepție cu un mesaj. Java are multe gata făcute. Două care se potrivesc în cele mai multe cazuri

- `IllegalArgumentException`: metoda a primit o valoare cu care nu poate lucra
- `IllegalStateException`: obiectul nu e în starea potrivită pentru acest apel

---

Cine apelează metoda poate prinde excepția, cum ai făcut înainte cu `try` și `catch`. `getMessage()` îți dă textul pe care l-ai scris

```java
public class Main {
    static int imparte(int bani, int oameni) {
        if (oameni <= 0) {
            throw new IllegalArgumentException("Nu am cu cine să împart");
        }
        return bani / oameni;
    }

    public static void main(String[] args) {
        int[] echipe = {3, 0, 2};
        for (int oameni : echipe) {
            try {
                System.out.println("Fiecare primește " + imparte(900, oameni));
            } catch (IllegalArgumentException e) {
                System.out.println("Problemă: " + e.getMessage());
            }
        }
    }
}
```

Ieșire

```text
Fiecare primește 300
Problemă: Nu am cu cine să împart
Fiecare primește 450
```

Metoda găsește problema. Cel care o apelează decide ce face cu ea

---

O metodă poate spune și în primul ei rând ce excepții poate arunca, cu **throws**

```text
static int imparte(int bani, int oameni) throws IllegalArgumentException {
```

Pentru `IllegalArgumentException` asta e doar o notă pentru cititor. În lecția următoare vei întâlni excepții la care Java face din `throws` o obligație

```java
public class Main {
    static void verificaVarsta(int varsta) throws IllegalArgumentException {
        if (varsta < 18) {
            throw new IllegalArgumentException("Prea tânăr pentru club: " + varsta);
        }
        System.out.println("Intră");
    }

    public static void main(String[] args) {
        try {
            verificaVarsta(25);
            verificaVarsta(16);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}
```

Ieșire

```text
Intră
Prea tânăr pentru club: 16
```

---

## Misiune: Treaba de la Bancă

Tommy are un cont la o bancă din Vice City și trimite o listă de retrageri. Banca plătește doar ce are sens

Scrie o metodă `retrage(int sold, int suma)` care întoarce noul sold. Ea aruncă o `IllegalArgumentException` cu mesajul `Suma trebuie să fie pozitivă` când suma e 0 sau mai mică și cu `Nu sunt destui bani` când suma e mai mare decât soldul

Banii pornesc în `int sold`, iar retragerile sunt într-un array `int[] retrageri`. Pentru fiecare, apelează `retrage`. Dacă merge, afișează `Am scos suma, a rămas sold`. Dacă aruncă, afișează `Refuzat: ` și mesajul. La final afișează `Sold: ` și ce a rămas

**Exemplu**

```text
Am scos 300, a rămas 700
Refuzat: Nu sunt destui bani
Refuzat: Suma trebuie să fie pozitivă
Am scos 700, a rămas 0
Sold: 0
```

**Exemplu**

```text
Sold: 50
```
