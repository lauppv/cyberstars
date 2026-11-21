Să extinzi `Thread` merge, dar amestecă două lucruri: treaba și thread-ul care o face. Java are un fel mai curat. Scrie treaba ca un **Runnable**, o interfață cu o singură metodă, `run()`, și dă-o unui `Thread`

---

```java
class Paznic implements Runnable {
    @Override
    public void run() {
        System.out.println("Pazesc strada");
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(new Paznic());
        t.start();
        t.join();
        System.out.println("Tura s-a terminat");
    }
}
```

Ieșire

```text
Pazesc strada
Tura s-a terminat
```

Clasa ta spune doar ce e de făcut. Thread-ul se ocupă de rulare. Fiindcă `Paznic` nu extinde Thread, e liberă să extindă o altă clasă de-a ta

---

Runnable are o singură metodă, deci e o interfață funcțională. Asta înseamnă că o poți scrie ca lambda, chiar acolo unde faci thread-ul

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(() -> System.out.println("Pazesc strada"));
        t.start();
        t.join();
        System.out.println("Tura s-a terminat");
    }
}
```

Ieșire

```text
Pazesc strada
Tura s-a terminat
```

Așa pornește azi thread-urile cel mai mult cod Java

---

Ca să rulezi multe thread-uri, ține-le într-un array. Pornește-le întâi pe toate, apoi fă join la toate. Dacă ai face join la fiecare imediat după ce l-ai pornit, ar rula unul după altul, nu în același timp

O lambda poate folosi doar variabile locale care nu se schimbă niciodată, iar `i`-ul buclei se schimbă. Așa că copiază-l într-o variabilă nouă în buclă

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        int[] numere = { 3, 5, 7 };
        int[] patrate = new int[numere.length];
        Thread[] muncitori = new Thread[numere.length];
        for (int i = 0; i < numere.length; i++) {
            int index = i;
            muncitori[i] = new Thread(() -> patrate[index] = numere[index] * numere[index]);
            muncitori[i].start();
        }
        for (Thread m : muncitori) {
            m.join();
        }
        for (int p : patrate) {
            System.out.println(p);
        }
    }
}
```

Ieșire

```text
9
25
49
```

Fiecare thread scrie în locul lui din `patrate`, așa că nu se încurcă niciodată unul pe altul. Main citește array-ul abia după toate join-urile

---

## Misiune: Coduri radio

Paznicii lui Tommy trimit cuvinte-cod prin radio. Cu cât un cuvânt are mai multe vocale, cu atât e mai urgent. Stochează cuvintele într-un array de `String` numit `cuvinte`.

Pornește câte un thread pentru fiecare cuvânt, fiecare făcut dintr-o lambda, care numără vocalele din cuvântul lui (`a`, `e`, `i`, `o`, `u`, mici sau mari) și ține numărul în locul lui dintr-un array de `int`. Pornește toate thread-urile, apoi fă join la toate. Nu extinde `Thread`.

Apoi afișează `<cuvant>: N vocale` pentru fiecare cuvânt, în ordine, și `Cel mai urgent: <cuvant>`, cuvântul cu cele mai multe vocale. Dacă două cuvinte sunt la egalitate, câștigă primul. Există mereu cel puțin un cuvânt.

**Exemplu** pentru `cuvinte = { "Malibu", "doc", "Ocean" }`

```text
Malibu: 3 vocale
doc: 1 vocale
Ocean: 3 vocale
Cel mai urgent: Malibu
```

**Exemplu** pentru `cuvinte = { "xyz" }`

```text
xyz: 0 vocale
Cel mai urgent: xyz
```
