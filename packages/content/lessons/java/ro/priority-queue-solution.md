```java
import java.util.PriorityQueue;

class Treaba implements Comparable<Treaba> {
    String nume;
    int urgenta;

    Treaba(String nume, int urgenta) {
        this.nume = nume;
        this.urgenta = urgenta;
    }

    public int compareTo(Treaba alta) {
        if (this.urgenta != alta.urgenta) {
            return this.urgenta - alta.urgenta;
        }
        return this.nume.compareTo(alta.nume);
    }
}

public class Main {
    public static void main(String[] args) {
        String[] treburi = {"Il iau pe Lance", "Cumpar o barca", "Platesc politia", "Ma vad cu Diaz"};
        int[] urgenta = {2, 5, 1, 2};

        PriorityQueue<Treaba> diseara = new PriorityQueue<>();
        for (int i = 0; i < treburi.length; i++) {
            diseara.offer(new Treaba(treburi[i], urgenta[i]));
        }

        while (!diseara.isEmpty()) {
            Treaba t = diseara.poll();
            System.out.println(t.urgenta + " - " + t.nume);
        }
    }
}
```
