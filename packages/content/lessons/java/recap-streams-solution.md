```java
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

record Recruit(String name, int score) {}

public class Main {
    public static void main(String[] args) {
        String[] names = {"Phil", "Lance", "Candy", "Mitch", "Earnest"};
        int[] scores = {70, 85, 40, 90, 85};
        int minimum = 60;

        ArrayList<Recruit> all = new ArrayList<>();
        for (int i = 0; i < names.length; i++) {
            all.add(new Recruit(names[i], scores[i]));
        }

        List<Recruit> hired = all.stream()
            .filter(r -> r.score() >= minimum)
            .sorted((a, b) -> b.score() - a.score())
            .toList();

        String list = hired.stream().map(Recruit::name).collect(Collectors.joining(", "));
        int skill = hired.stream().map(Recruit::score).reduce(0, Integer::sum);
        Optional<Recruit> best = hired.stream().findFirst();

        System.out.println("Hired: " + (hired.isEmpty() ? "nobody" : list));
        System.out.println("Team skill: " + skill);
        System.out.println("Best: " + best.map(Recruit::name).orElse("nobody"));
    }
}
```
