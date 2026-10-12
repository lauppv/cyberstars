class CrewMember {
    private final String who;
    private final String job;
    private final int time;
    private int rep = 50;

    public CrewMember(String who, String job, int time) {
        this.who = who;
        this.job = job;
        this.time = time;
    }

    private void raise(int amount) {
        rep += amount;
        if (rep > 100) {
            rep = 100;
        }
    }

    public void train() {
        raise(15);
    }

    public void mission() {
        raise(10);
    }

    @Override
    public String toString() {
        return String.format("%s (%s, %d years) - Respect: %d", who, job, time, rep);
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

        CrewMember boss = new CrewMember(name1, role1, years1);
        CrewMember partner = new CrewMember(name2, role2, years2);
        CrewMember gunsmith = new CrewMember(name3, role3, years3);

        boss.train();
        boss.train();
        boss.mission();
        partner.mission();
        for (int i = 0; i < 4; i++) {
            gunsmith.train();
        }
        System.out.println(boss);
        System.out.println(partner);
        System.out.println(gunsmith);
    }
}
