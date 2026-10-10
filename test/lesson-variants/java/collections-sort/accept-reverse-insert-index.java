import java.util.ArrayList;
import java.util.Collections;

public class Main {
    static class CrewMember implements Comparable<CrewMember> {
        String name;
        int missions;
        CrewMember(String name, int missions) { this.name = name; this.missions = missions; }
        public int compareTo(CrewMember other) {
            if (missions < other.missions) return -1;
            if (missions > other.missions) return 1;
            return 0;
        }
    }

    public static void main(String[] args) {
        int missions1 = 47;
        int missions2 = 12;
        int missions3 = 8;
        int missions4 = 23;
        ArrayList<CrewMember> crew = new ArrayList<>();
        crew.add(new CrewMember("Mercedes", missions4));
        crew.add(new CrewMember("Phil", missions3));
        crew.add(new CrewMember("Lance", missions2));
        crew.add(new CrewMember("Tommy", missions1));
        Collections.sort(crew);
        for (int i = 0; i < crew.size(); i++) {
            CrewMember c = crew.get(i);
            System.out.println(c.name + " - " + c.missions + " missions");
        }
    }
}
