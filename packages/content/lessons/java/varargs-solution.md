```java
public class Main {
    static String roll(String leader, String... members) {
        if (members.length == 0) {
            return leader + " works alone";
        }
        StringBuilder names = new StringBuilder();
        for (int i = 0; i < members.length; i++) {
            if (i > 0) {
                names.append(", ");
            }
            names.append(members[i]);
        }
        return leader + " leads " + members.length + ": " + names;
    }

    public static void main(String[] args) {
        String leader = "Tommy";
        String[] crew = { "Lance", "Ken" };

        System.out.println(roll(leader, crew));
        System.out.println(roll(leader));
    }
}
```
