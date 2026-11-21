```java
import java.util.ArrayList;

class Raft<T extends Comparable<T>> {
    ArrayList<T> lucruri = new ArrayList<>();

    void adauga(T lucru) {
        lucruri.add(lucru);
    }

    int marime() {
        return lucruri.size();
    }

    T celMaiMic() {
        T min = lucruri.get(0);
        for (T lucru : lucruri) {
            if (lucru.compareTo(min) < 0) {
                min = lucru;
            }
        }
        return min;
    }

    T celMaiMare() {
        T max = lucruri.get(0);
        for (T lucru : lucruri) {
            if (lucru.compareTo(max) > 0) {
                max = lucru;
            }
        }
        return max;
    }
}

public class Main {
    static <T extends Comparable<T>> String raport(String eticheta, Raft<T> raft) {
        if (raft.marime() == 0) {
            return eticheta + ": gol";
        }
        return eticheta + ": " + raft.marime() + " lucruri, cel mai mic " + raft.celMaiMic() + ", cel mai mare " + raft.celMaiMare();
    }

    public static void main(String[] args) {
        String[] nume = { "Tommy", "Ken", "Lance" };
        Integer[] greutati = { 12, 5, 30 };

        Raft<String> raftNume = new Raft<>();
        for (String n : nume) {
            raftNume.adauga(n);
        }
        Raft<Integer> raftGreutati = new Raft<>();
        for (Integer g : greutati) {
            raftGreutati.adauga(g);
        }
        System.out.println(raport("Nume", raftNume));
        System.out.println(raport("Greutati", raftGreutati));
    }
}
```
