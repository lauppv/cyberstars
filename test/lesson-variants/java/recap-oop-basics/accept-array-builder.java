class CrewMember {
    String name;
    String role;
    int years;
    int respect;

    CrewMember(String n, String r, int y) {
        name = n;
        role = r;
        years = y;
        respect = 50;
    }

    void train() {
        respect = respect + 15 > 100 ? 100 : respect + 15;
    }

    void mission() {
        respect = respect + 10 > 100 ? 100 : respect + 10;
    }

    public String toString() {
        StringBuilder sb = new StringBuilder(name);
        sb.append(" (").append(role).append(", ").append(years).append(" years) - Respect: ").append(respect);
        return sb.toString();
    }
}

public class Main {
    public static void main(String[] args) {
        String name1 = "Tommy Vercetti";
        String role1 = "Boss";
        int years1 = 3;
        String name2 = "Lance Vance";
        String role2 = "Partner";
        int years2 = 5;
        String name3 = "Phil Cassidy";
        String role3 = "Gunsmith";
        int years3 = 2;

        CrewMember[] crew = {
            new CrewMember(name1, role1, years1),
            new CrewMember(name2, role2, years2),
            new CrewMember(name3, role3, years3)
        };
        int[] trainings = {2, 0, 4};
        int[] missions = {1, 1, 0};
        for (int i = 0; i < crew.length; i++) {
            for (int t = 0; t < trainings[i]; t++) crew[i].train();
            for (int m = 0; m < missions[i]; m++) crew[i].mission();
        }
        for (CrewMember c : crew) System.out.println(c);
    }
}
