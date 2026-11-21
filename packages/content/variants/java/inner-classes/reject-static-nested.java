import java.util.ArrayList;

class Gang {
    String name;
    ArrayList<Member> members = new ArrayList<>();

    Gang(String name) { this.name = name; }

    static class Member {
        String nick;
        String gang;
        Member(String nick, String gang) { this.nick = nick; this.gang = gang; }
        String badge() { return nick + " (" + gang + ")"; }
    }

    void recruit(String nick) { members.add(new Member(nick, name)); }
}

public class Main {
    public static void main(String[] args) {
        String gangName = "Vercetti Gang";
        String[] nicks = { "Lance", "Ken" };
        Gang gang = new Gang(gangName);
        for (String nick : nicks) gang.recruit(nick);
        for (Gang.Member m : gang.members) System.out.println(m.badge());
        System.out.println("Members: " + gang.members.size());
    }
}
