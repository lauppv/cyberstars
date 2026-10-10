import java.util.*;

class CrewMember {
    private final String n;
    private final String r;

    CrewMember(String n, String r) {
        this.n = n;
        this.r = r;
    }

    @Override
    public String toString() {
        return n + " - " + r;
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

        List<CrewMember> gang = new ArrayList<>();
        String[] ns = {name1, name2, name3, name4};
        String[] rs = {role1, role2, role3, role4};
        for (int i = 0; i < ns.length; i++) {
            gang.add(new CrewMember(ns[i], rs[i]));
        }
        gang.remove(0);
        int i = 0;
        while (i < gang.size()) {
            System.out.println(gang.get(i));
            i++;
        }
    }
}
