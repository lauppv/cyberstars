import java.util.ArrayList;

public class Main {
    static class CrewMember {
        String name, role;

        CrewMember(String name, String role) {
            this.name = name;
            this.role = role;
        }
    }

    static void show(ArrayList<CrewMember> list) {
        StringBuilder out = new StringBuilder();
        for (CrewMember c : list) {
            out.append(c.name).append(" - ").append(c.role).append('\n');
        }
        System.out.print(out);
    }

    public static void main(String[] args) {
        var name1 = "Lance Vance";
        var role1 = "driver";
        var name2 = "Phil Cassidy";
        var role2 = "weapons";
        var name3 = "Umberto Robina";
        var role3 = "ally";
        var name4 = "Hilary King";
        var role4 = "driver";
        ArrayList<CrewMember> team = new ArrayList<>();
        team.add(new CrewMember(name1, role1));
        team.add(new CrewMember(name2, role2));
        team.add(new CrewMember(name3, role3));
        team.add(new CrewMember(name4, role4));
        CrewMember traitor = team.get(0);
        team.remove(traitor);
        show(team);
    }
}
