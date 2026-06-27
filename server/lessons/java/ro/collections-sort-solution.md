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
        ArrayList<MembruEchipa> echipa = new ArrayList<>();
        echipa.add(new MembruEchipa("Tommy", 47));
        echipa.add(new MembruEchipa("Lance", 12));
        echipa.add(new MembruEchipa("Phil", 8));
        echipa.add(new MembruEchipa("Mercedes", 23));

        Collections.sort(echipa);

        for (MembruEchipa m : echipa) {
            System.out.println(m.nume + " - " + m.misiuni + " misiuni");
        }
    }
}
```
