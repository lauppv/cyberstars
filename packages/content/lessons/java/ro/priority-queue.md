O coadă servește oamenii în ordinea în care au venit. Dar la spital, cazul cel mai grav intră primul, chiar dacă a venit ultimul. Asta e o **PriorityQueue** (coadă cu priorități): `poll()` îți dă mereu cel mai mic element, nu pe cel mai vechi

```java
import java.util.PriorityQueue;

public class Main {
    public static void main(String[] args) {
        PriorityQueue<Integer> numere = new PriorityQueue<>();
        numere.offer(40);
        numere.offer(5);
        numere.offer(17);

        System.out.println(numere.poll());
        System.out.println(numere.poll());
        System.out.println(numere.poll());
    }
}
```

Ieșire

```text
5
17
40
```

Are aceleași metode ca o coadă: `offer`, `poll`, `peek`, `isEmpty`, `size`. Doar ordinea diferă. String-urile ies în ordine alfabetică

---

O surpriză: dacă afișezi toată PriorityQueue, ea nu e sortată. Înăuntru, coada are grijă doar ca cel mai mic să fie în față. Restul stă într-o ordine oarecare. Dacă le vrei în ordine, scoate-le unul câte unul cu `poll()`

```java
import java.util.PriorityQueue;

public class Main {
    public static void main(String[] args) {
        PriorityQueue<Integer> numere = new PriorityQueue<>();
        numere.offer(3);
        numere.offer(9);
        numere.offer(1);
        numere.offer(8);

        System.out.println(numere);
        while (!numere.isEmpty()) {
            System.out.println(numere.poll());
        }
    }
}
```

Ieșire

```text
[1, 8, 3, 9]
1
3
8
9
```

---

Și cu obiectele tale? PriorityQueue trebuie să știe care e „mai mic”. La fel ca `Collections.sort`, folosește `compareTo` din interfața **Comparable**

```java
import java.util.PriorityQueue;

class Pacient implements Comparable<Pacient> {
    String nume;
    int durere;

    Pacient(String nume, int durere) {
        this.nume = nume;
        this.durere = durere;
    }

    public int compareTo(Pacient altul) {
        return altul.durere - this.durere;
    }
}

public class Main {
    public static void main(String[] args) {
        PriorityQueue<Pacient> sala = new PriorityQueue<>();
        sala.offer(new Pacient("Phil", 4));
        sala.offer(new Pacient("Lance", 9));
        sala.offer(new Pacient("Kent", 6));

        while (!sala.isEmpty()) {
            Pacient p = sala.poll();
            System.out.println(p.nume + " (durere " + p.durere + ")");
        }
    }
}
```

Ieșire

```text
Lance (durere 9)
Kent (durere 6)
Phil (durere 4)
```

`altul.durere - this.durere` face ca durerea cea mai mare să fie elementul „cel mai mic”, așa că intră primul

---

## Misiune: Cel Mai Urgent Primul

Tommy are o listă de treburi pentru noaptea asta. Fiecare treabă are un număr de urgență: 1 înseamnă „fă-o acum”, numerele mai mari pot aștepta. Tommy vrea să le facă de la cea mai urgentă la cea mai puțin urgentă

Treburile sunt într-un array `String[] treburi`, iar urgența lor într-un array `int[] urgenta`. `treburi[i]` are urgența `urgenta[i]`. Pune fiecare treabă într-o PriorityQueue și scoate-le una câte una. Afișează fiecare ca `urgență - treabă`. Când două treburi au aceeași urgență, prima merge cea al cărei nume vine primul în ordine alfabetică

**Exemplu**

```text
1 - Plătesc poliția
2 - Mă văd cu Diaz
2 - Îl iau pe Lance
5 - Cumpăr o barcă
```

**Exemplu**

```text
3 - Îl sun pe Kent
```
