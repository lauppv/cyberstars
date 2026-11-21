```java
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

record Recrut(String nume, int scor) {}

public class Main {
    public static void main(String[] args) {
        String[] nume = {"Phil", "Lance", "Candy", "Mitch", "Earnest"};
        int[] scoruri = {70, 85, 40, 90, 85};
        int minim = 60;

        ArrayList<Recrut> toti = new ArrayList<>();
        for (int i = 0; i < nume.length; i++) {
            toti.add(new Recrut(nume[i], scoruri[i]));
        }

        List<Recrut> angajati = toti.stream()
            .filter(r -> r.scor() >= minim)
            .sorted((a, b) -> b.scor() - a.scor())
            .toList();

        String lista = angajati.stream().map(Recrut::nume).collect(Collectors.joining(", "));
        int pricepere = angajati.stream().map(Recrut::scor).reduce(0, Integer::sum);
        Optional<Recrut> celMaiBun = angajati.stream().findFirst();

        System.out.println("Angajați: " + (angajati.isEmpty() ? "nimeni" : lista));
        System.out.println("Pricepere totală: " + pricepere);
        System.out.println("Cel mai bun: " + celMaiBun.map(Recrut::nume).orElse("nimeni"));
    }
}
```
