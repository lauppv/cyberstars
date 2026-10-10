import java.util.*;

class CrewMember implements Comparable<CrewMember> {
    private final String who;
    private final int count;

    CrewMember(String who, int count) {
        this.who = who;
        this.count = count;
    }

    @Override
    public int compareTo(CrewMember o) {
        return Integer.compare(count, o.count);
    }

    @Override
    public String toString() {
        return who + " - " + count + " missions";
    }
}

public class Main {
    public static void main(String[] args) {
        int missions1 = 47;
        int missions2 = 12;
        int missions3 = 8;
        int missions4 = 23;
        List<CrewMember> ranking = new ArrayList<>(List.of(
            new CrewMember("Tommy", missions1),
            new CrewMember("Lance", missions2),
            new CrewMember("Phil", missions3),
            new CrewMember("Mercedes", missions4)));
        Collections.sort(ranking);
        ranking.forEach(System.out::println);
    }
}
