În Java, String-urile nu se pot schimba. De fiecare dată când scrii `text = text + "x"`, Java construiește un String nou-nouț și îl aruncă pe cel vechi. Pentru câteva bucăți e în regulă. Pentru un String pe care îl construiești într-o buclă, bucată cu bucată, există o unealtă mai bună: **StringBuilder**

---

Un StringBuilder e un String pe care îl poți schimba. Adaugi în el cu **append** și îl transformi într-un String normal cu **toString**

```java
public class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        sb.append("Vice");
        sb.append(" ");
        sb.append("City");
        sb.append(86);
        String rezultat = sb.toString();
        System.out.println(rezultat);
    }
}
```

Ieșire

```text
Vice City86
```

`append` primește orice: text, numere, char-uri. Schimbă de fiecare dată același StringBuilder, nu face unul nou

---

Strălucește în bucle. Aici construim un rând de stele

```java
public class Main {
    public static void main(String[] args) {
        int nota = 4;
        StringBuilder stele = new StringBuilder();
        for (int i = 0; i < nota; i++) {
            stele.append('*');
        }
        System.out.println(stele);
        System.out.println(stele.length());
    }
}
```

Ieșire

```text
****
4
```

println poate afișa direct un StringBuilder. `length()` merge ca la un String

---

Un StringBuilder are câteva trucuri pe care un String nu le are:

- `reverse()` îl întoarce de la coadă la cap
- `insert(pozitie, valoare)` pune ceva la mijloc
- `deleteCharAt(pozitie)` scoate un char
- `setCharAt(pozitie, c)` înlocuiește un char

```java
public class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder("Tommy");
        sb.reverse();
        System.out.println(sb);

        sb = new StringBuilder("Lance Vance");
        sb.insert(6, "cel ");
        System.out.println(sb);

        sb.deleteCharAt(0);
        sb.setCharAt(0, 'A');
        System.out.println(sb);
    }
}
```

Ieșire

```text
ymmoT
Lance cel Vance
Ance cel Vance
```

`new StringBuilder("Tommy")` îl pornește cu un text deja înăuntru. Pozițiile se numără de la 0, ca la `charAt`

---

Când folosești pe care?

- Câteva bucăți lipite o singură dată: `+` e clar și merge bine
- Multe bucăți adăugate într-o buclă, sau un String pe care îl schimbi la mijloc: StringBuilder

---

## Misiune: Graffiti

Banda lui Tommy își scrie numele pe ziduri de la coadă la cap și cu majuscule, cu o liniuță între litere. Stochează numele într-un `String` numit `nume`. Construiește graffiti-ul cu un StringBuilder și afișează-l, apoi afișează `Lungime: N` cu lungimea lui.

Pentru `vice` graffiti-ul e `E-C-I-V`. Un nume cu o singură literă nu are liniuță. Un nume gol dă un graffiti gol.

**Exemplu** pentru `nume = "vice"`

```text
E-C-I-V
Lungime: 7
```

**Exemplu** pentru `nume = "Ken"`

```text
N-E-K
Lungime: 5
```

**Exemplu** pentru `nume = "x"`

```text
X
Lungime: 1
```
