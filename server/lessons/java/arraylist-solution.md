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
        String name1 = "Lance Vance";
        String role1 = "driver";
        String name2 = "Phil Cassidy";
        String role2 = "weapons";
        String name3 = "Umberto Robina";
        String role3 = "ally";
        String name4 = "Hilary King";
        String role4 = "driver";

        ArrayList<CrewMember> crew = new ArrayList<CrewMember>();
        crew.add(new CrewMember(name1, role1));
        crew.add(new CrewMember(name2, role2));
        crew.add(new CrewMember(name3, role3));
        crew.add(new CrewMember(name4, role4));

        crew.remove(0);

        for (CrewMember m : crew) {
            System.out.println(m.name + " - " + m.role);
        }
    }
}
```
