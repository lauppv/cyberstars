import java.util.List;

class CrewMember {
    final String who;
    CrewMember(String who) { this.who = who; }
}

class Driver extends CrewMember {
    final String ride;
    Driver(String who, String ride) {
        super(who);
        this.ride = ride;
    }
}

public class Main {
    public static void main(String[] args) {
        String name1 = "Lance Vance";
        String car1 = "Infernus";
        String name2 = "Mercedes Cortez";
        String name3 = "Hilary King";
        String car3 = "Sentinel";
        List<CrewMember> crew = List.of(new Driver(name1, car1), new CrewMember(name2), new Driver(name3, car3));
        int i = 0;
        while (i < crew.size()) {
            describe(crew.get(i++));
        }
    }

    static void describe(CrewMember m) {
        System.out.println("Name: " + m.who);
        if (m instanceof Driver d) {
            System.out.println("Car: " + d.ride);
        }
    }
}
