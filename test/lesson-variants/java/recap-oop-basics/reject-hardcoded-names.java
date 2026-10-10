class CrewMember {
    String name;
    String role;
    int years;
    int respect = 50;

    CrewMember(String name, String role, int years) {
        this.name = name;
        this.role = role;
        this.years = years;
    }

    void train() {
        respect = Math.min(respect + 15, 100);
    }

    void mission() {
        respect = Math.min(respect + 10, 100);
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

        CrewMember p1 = new CrewMember(name1, role1, years1);
        CrewMember p2 = new CrewMember(name2, role2, years2);
        CrewMember p3 = new CrewMember(name3, role3, years3);
        p1.train();
        p1.train();
        p1.mission();
        p2.mission();
        p3.train();
        p3.train();
        p3.train();
        p3.train();
        System.out.println("Tommy Vercetti (Boss, 3 years) - Respect: " + p1.respect);
        System.out.println("Lance Vance (Partner, 5 years) - Respect: " + p2.respect);
        System.out.println("Phil Cassidy (Gunsmith, 2 years) - Respect: " + p3.respect);
    }
}
