import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

record Recruit(String name, int score) {}

public class Main {
    public static void main(String[] args) {
        String[] names = {"Phil", "Lance", "Candy", "Mitch", "Earnest"};
        int[] scores = {70, 85, 40, 90, 85};
        int minimum = 60;
        ArrayList<Recruit> all = new ArrayList<>();
        for (int i = 0; i < names.length; i++) all.add(new Recruit(names[i], scores[i]));
        List<Recruit> hired = all.stream().filter(r -> r.score() >= minimum)
            .sorted((a, b) -> a.score() - b.score()).toList();
        System.out.println("Hired: " + (hired.isEmpty() ? "nobody"
            : hired.stream().map(Recruit::name).collect(Collectors.joining(", "))));
        System.out.println("Team skill: " + hired.stream().mapToInt(Recruit::score).sum());
        System.out.println("Best: " + hired.stream().reduce((a, b) -> b).map(Recruit::name).orElse("nobody"));
    }
}
