```java
import java.util.ArrayList;
import java.util.Collections;

class CrewMember implements Comparable<CrewMember> {
    String name;
    int missions;

    CrewMember(String name, int missions) {
        this.name = name;
        this.missions = missions;
    }

    public int compareTo(CrewMember other) {
        return this.missions - other.missions;
    }
}

public class Main {
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

        Collections.sort(crew);

        for (CrewMember m : crew) {
            System.out.println(m.name + " - " + m.missions + " missions");
        }
    }
}
```
