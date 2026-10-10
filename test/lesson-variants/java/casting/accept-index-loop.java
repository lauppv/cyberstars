public class Main {
    static class CrewMember {
        String name;
        CrewMember(String name) { this.name = name; }
    }

    static class Driver extends CrewMember {
        String car;
        Driver(String name, String car) { super(name); this.car = car; }
    }

    public static void main(String[] args) {
        String name1 = "Lance Vance";
        String car1 = "Infernus";
        String name2 = "Mercedes Cortez";
        String name3 = "Hilary King";
        String car3 = "Sentinel";
        CrewMember[] team = new CrewMember[3];
        team[0] = new Driver(name1, car1);
        team[1] = new CrewMember(name2);
        team[2] = new Driver(name3, car3);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < team.length; i++) {
            sb.append("Name: ").append(team[i].name).append("\n");
            if (team[i] instanceof Driver) {
                sb.append("Car: ").append(((Driver) team[i]).car).append("\n");
            }
        }
        System.out.print(sb);
    }
}
