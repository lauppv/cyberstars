```java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayDeque;
import java.util.Queue;

class Nod {
    int valoare;
    Nod stanga;
    Nod dreapta;

    Nod(int valoare) {
        this.valoare = valoare;
    }
}

public class Main {
    // Face dintr-o linie ca "8 4 11 2 null 9 15" noduri legate, nivel cu nivel.
    static Nod construiesteArbore(String linie) {
        String[] bucati = linie.trim().split("\\s+");
        if (bucati[0].isEmpty() || bucati[0].equals("null")) {
            return null;
        }
        Nod radacina = new Nod(Integer.parseInt(bucati[0]));
        Queue<Nod> coada = new ArrayDeque<>();
        coada.add(radacina);
        int i = 1;
        while (i < bucati.length) {
            Nod nod = coada.remove();
            if (!bucati[i].equals("null")) {
                nod.stanga = new Nod(Integer.parseInt(bucati[i]));
                coada.add(nod.stanga);
            }
            i++;
            if (i < bucati.length && !bucati[i].equals("null")) {
                nod.dreapta = new Nod(Integer.parseInt(bucati[i]));
                coada.add(nod.dreapta);
            }
            i++;
        }
        return radacina;
    }

    static boolean acelasiArbore(Nod primul, Nod alDoilea) {
        if (primul == null || alDoilea == null) {
            return primul == null && alDoilea == null;
        }
        return primul.valoare == alDoilea.valoare
                && acelasiArbore(primul.stanga, alDoilea.stanga)
                && acelasiArbore(primul.dreapta, alDoilea.dreapta);
    }

    public static void main(String[] args) throws Exception {
        BufferedReader cititor = new BufferedReader(new InputStreamReader(System.in));
        Nod primul = construiesteArbore(cititor.readLine());
        Nod alDoilea = construiesteArbore(cititor.readLine());
        System.out.println(acelasiArbore(primul, alDoilea));
    }
}
```
