```java
import java.util.ArrayList;

class CrewMember {
    String name;
    String role;

    CrewMember(String name, String role) {
        this.name = name;
        this.role = role;
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<CrewMember> crew = new ArrayList<CrewMember>();
        crew.add(new CrewMember("Lance Vance", "driver"));
        crew.add(new CrewMember("Phil Cassidy", "weapons"));
        crew.add(new CrewMember("Umberto Robina", "ally"));
        crew.add(new CrewMember("Hilary King", "driver"));

        crew.remove(0);

        for (CrewMember m : crew) {
            System.out.println(m.name + " - " + m.role);
        }
    }
}
```
