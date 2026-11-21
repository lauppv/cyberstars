```java
import java.util.ArrayList;

class Gang {
    String name;
    ArrayList<Member> members = new ArrayList<>();

    Gang(String name) {
        this.name = name;
    }

    class Member {
        String nick;

        Member(String nick) {
            this.nick = nick;
        }

        String badge() {
            return nick + " (" + name + ")";
        }
    }

    void recruit(String nick) {
        members.add(new Member(nick));
    }
}

public class Main {
    public static void main(String[] args) {
        String gangName = "Vercetti Gang";
        String[] nicks = { "Lance", "Ken" };

        Gang gang = new Gang(gangName);
        for (String nick : nicks) {
            gang.recruit(nick);
        }
        for (Gang.Member member : gang.members) {
            System.out.println(member.badge());
        }
        System.out.println("Members: " + gang.members.size());
    }
}
```
