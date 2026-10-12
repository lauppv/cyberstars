import java.util.ArrayList;
import java.util.Collections;

public class Main {
    static class CrewMember {
        String name;
        int missions;
        CrewMember(String name, int missions) { this.name = name; this.missions = missions; }
        int compareTo(CrewMember other) { return Integer.compare(missions, other.missions); }
    }

    public static void main(String[] args) {
        int missions1 = 47;
        int missions2 = 12;
        int missions3 = 8;
        int missions4 = 23;
        ArrayList<CrewMember> crew = new ArrayList<>();
        crew.add(new CrewMember("Tommy", missions1));
        crew.add(new CrewMember("Lance", missions2));
        crew.add(new CrewMember("Phil", missions3));
        crew.add(new CrewMember("Mercedes", missions4));
        Collections.sort(crew, (a, b) -> a.compareTo(b));
        for (CrewMember c : crew) {
            System.out.println(c.name + " - " + c.missions + " missions");
        }
    }
}
