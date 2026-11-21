```java
import java.util.ArrayList;
import java.util.Comparator;

class Pilot {
    String nume;
    int timp;

    Pilot(String nume, int timp) {
        this.nume = nume;
        this.timp = timp;
    }
}

class DupaTimp implements Comparator<Pilot> {
    public int compare(Pilot a, Pilot b) {
        return a.timp - b.timp;
    }
}

class DupaNume implements Comparator<Pilot> {
    public int compare(Pilot a, Pilot b) {
        return a.nume.compareTo(b.nume);
    }
}

public class Main {
    public static void main(String[] args) {
        String[] piloti = {"Tommy", "Lance", "Phil", "Candy"};
        int[] timpi = {61, 58, 75, 61};

        ArrayList<Pilot> cursa = new ArrayList<>();
        for (int i = 0; i < piloti.length; i++) {
            cursa.add(new Pilot(piloti[i], timpi[i]));
        }

        cursa.sort(new DupaTimp());
        System.out.println("După timp:");
        for (Pilot p : cursa) {
            System.out.println(p.nume + " - " + p.timp + " s");
        }

        cursa.sort(new DupaNume());
        System.out.println("După nume:");
        for (Pilot p : cursa) {
            System.out.println(p.nume + " - " + p.timp + " s");
        }
    }
}
```
