Multe clase doar transportă date: un punct are un x și un y, o vânzare are un produs și un preț. Pentru ele scrii mereu aceleași lucruri: câmpuri, un constructor, getteri, toString, equals, hashCode. Un **record** le scrie pe toate pentru tine într-o singură linie

---

```java
record Punct(int x, int y) {
}

public class Main {
    public static void main(String[] args) {
        Punct p = new Punct(3, 4);
        System.out.println(p.x());
        System.out.println(p.y());
        System.out.println(p);
    }
}
```

Ieșire

```text
3
4
Punct[x=3, y=4]
```

Din `record Punct(int x, int y)` Java face:

- două câmpuri private și final, `x` și `y`
- un constructor care le primește în ordinea asta
- câte o metodă pentru fiecare, cu numele câmpului: `p.x()`, nu `p.getX()`
- un `toString` care arată numele și toate valorile

---

Face și `equals` și `hashCode`, comparând fiecare câmp. Două record-uri cu aceleași valori sunt egale și merg pe loc drept chei într-un HashMap

```java
record Punct(int x, int y) {
}

public class Main {
    public static void main(String[] args) {
        Punct a = new Punct(1, 2);
        Punct b = new Punct(1, 2);
        System.out.println(a.equals(b));
        System.out.println(a == b);
    }
}
```

Ieșire

```text
true
false
```

---

Un record nu se poate schimba după ce e făcut: câmpurile lui sunt final și nu are setteri. Ca să „muți” un punct, faci unul nou

Poți totuși adăuga metodele tale între acolade

```java
record Vanzare(String produs, int pret, int cantitate) {
    int total() {
        return pret * cantitate;
    }
}

public class Main {
    public static void main(String[] args) {
        Vanzare v = new Vanzare("Pistol", 100, 3);
        System.out.println(v.produs() + ": " + v.total());
    }
}
```

Ieșire

```text
Pistol: 300
```

Folosește un record când obiectul înseamnă doar datele lui. Folosește o clasă când obiectul trebuie să se schimbe în timp, ca un cont bancar al cărui sold urcă și coboară

---

## Misiune: Registrul de vânzări

Tommy ține un registru cu vânzările din noaptea asta de la Ammu-Nation. Scrie un record `Vanzare` cu un `String produs`, un `int pret` și un `int cantitate`, și dă-i o metodă `total()` care dă înapoi prețul înmulțit cu cantitatea.

Stochează produsele într-un array de `String` numit `produse`, prețurile într-un array de `int` numit `preturi` și cantitățile într-un array de `int` numit `cantitati`, în aceeași ordine. Fă o `Vanzare` pentru fiecare și afișeaz-o ca `<vanzarea> -> <totalul ei>`, lăsând toString-ul record-ului să scrie vânzarea. Apoi afișează `Totalul noptii: N`.

**Exemplu** pentru `produse = { "Pistol", "Shotgun" }`, `preturi = { 100, 450 }` și `cantitati = { 3, 1 }`

```text
Vanzare[produs=Pistol, pret=100, cantitate=3] -> 300
Vanzare[produs=Shotgun, pret=450, cantitate=1] -> 450
Totalul noptii: 750
```

**Exemplu** pentru `produse = { "Cutit" }`, `preturi = { 20 }` și `cantitati = { 0 }`

```text
Vanzare[produs=Cutit, pret=20, cantitate=0] -> 0
Totalul noptii: 0
```
