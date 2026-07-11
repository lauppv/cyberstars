```java
import java.util.ArrayList;
import java.util.Collections;

class MembruEchipa implements Comparable<MembruEchipa> {
    String nume;
    int misiuni;

    MembruEchipa(String nume, int misiuni) {
        this.nume = nume;
        this.misiuni = misiuni;
    }

    public int compareTo(MembruEchipa alt) {
        return this.misiuni - alt.misiuni;
    }
}

public class Main {
    public static void main(String[] args) {
        int misiuni1 = 47;
        int misiuni2 = 12;
        int misiuni3 = 8;
        int misiuni4 = 23;

        ArrayList<MembruEchipa> echipa = new ArrayList<>();
        echipa.add(new MembruEchipa("Tommy", misiuni1));
        echipa.add(new MembruEchipa("Lance", misiuni2));
        echipa.add(new MembruEchipa("Phil", misiuni3));
        echipa.add(new MembruEchipa("Mercedes", misiuni4));

        Collections.sort(echipa);

        for (MembruEchipa m : echipa) {
            System.out.println(m.nume + " - " + m.misiuni + " misiuni");
        }
    }
}
```
