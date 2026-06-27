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
        ArrayList<CrewMember> crew = new ArrayList<>();
        crew.add(new CrewMember("Tommy", 47));
        crew.add(new CrewMember("Lance", 12));
        crew.add(new CrewMember("Phil", 8));
        crew.add(new CrewMember("Mercedes", 23));

        Collections.sort(crew);

        for (CrewMember m : crew) {
            System.out.println(m.name + " - " + m.missions + " missions");
        }
    }
}
```
