```java
class CrewMember {
    String name;
    String role;
    int years;
    int respect;

    CrewMember(String name, String role, int years) {
        this.name = name;
        this.role = role;
        this.years = years;
        this.respect = 50;
    }

    void train() {
        respect = Math.min(respect + 15, 100);
    }

    void mission() {
        respect = Math.min(respect + 10, 100);
    }

    @Override
    public String toString() {
        return name + " (" + role + ", " + years + " years) - Respect: " + respect;
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

        System.out.println(p1);
        System.out.println(p2);
        System.out.println(p3);
    }
}
```
