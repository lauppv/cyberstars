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
            .sorted((a, b) -> b.score() - a.score()).toList();
        System.out.println("Hired: " + (hired.isEmpty() ? "nobody"
            : hired.stream().map(Recruit::name).collect(Collectors.joining(", "))));
        System.out.println("Team skill: " + hired.stream().mapToInt(Recruit::score).sum());
        String best = "nobody";
        int top = -1;
        for (Recruit r : all) if (r.score() >= minimum && r.score() >= top) { top = r.score(); best = r.name(); }
        System.out.println("Best: " + best);
    }
}
