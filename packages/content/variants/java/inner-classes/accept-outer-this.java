import java.util.ArrayList;

class Gang {
    private final String name;
    private final ArrayList<Member> members = new ArrayList<>();

    Gang(String name) { this.name = name; }

    class Member {
        private final String nick;
        Member(String nick) { this.nick = nick; }
        String badge() { return nick + " (" + Gang.this.name + ")"; }
    }

    void recruit(String nick) { members.add(this.new Member(nick)); }

    void printAll() {
        for (Member m : members) System.out.println(m.badge());
        System.out.println("Members: " + members.size());
    }
}

public class Main {
    public static void main(String[] args) {
        String gangName = "Vercetti Gang";
        String[] nicks = { "Lance", "Ken" };
        Gang gang = new Gang(gangName);
        for (int i = 0; i < nicks.length; i++) gang.recruit(nicks[i]);
        gang.printAll();
    }
}
