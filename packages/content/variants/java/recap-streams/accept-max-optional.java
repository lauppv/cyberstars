import java.util.*;
import java.util.stream.Collectors;

public class Main {
    static class R {
        String n; int s;
        R(String n, int s) { this.n = n; this.s = s; }
    }

    public static void main(String[] args) {
        String[] names = {"Phil", "Lance", "Candy", "Mitch", "Earnest"};
        int[] scores = {70, 85, 40, 90, 85};
        int minimum = 60;
        List<R> people = new ArrayList<>();
        for (int i = 0; i < names.length; i++) people.add(new R(names[i], scores[i]));
        String hired = people.stream()
            .filter(r -> r.s >= minimum)
            .sorted(Comparator.comparingInt((R r) -> r.s).reversed())
            .map(r -> r.n)
            .collect(Collectors.joining(", "));
        int skill = people.stream().filter(r -> r.s >= minimum).mapToInt(r -> r.s).sum();
        Optional<R> best = people.stream().filter(r -> r.s >= minimum).max((a, b) -> a.s - b.s);
        System.out.println("Hired: " + (hired.isEmpty() ? "nobody" : hired));
        System.out.println("Team skill: " + skill);
        System.out.println("Best: " + (best.isPresent() ? best.get().n : "nobody"));
    }
}
