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
        List<Recruit> crew = all.stream().filter(r -> r.score() >= minimum)
            .sorted((a, b) -> Integer.compare(b.score(), a.score()))
            .collect(Collectors.toList());
        String out = "";
        int total = 0;
        for (Recruit r : crew) {
            out += (out.isEmpty() ? "" : ", ") + r.name();
            total += r.score();
        }
        System.out.println("Hired: " + (crew.isEmpty() ? "nobody" : out));
        System.out.println("Team skill: " + total);
        System.out.println("Best: " + (crew.isEmpty() ? "nobody" : crew.get(0).name()));
    }
}
