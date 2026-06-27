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
        CrewMember p1 = new CrewMember("Tommy Vercetti", "Boss", 3);
        CrewMember p2 = new CrewMember("Lance Vance", "Partner", 5);
        CrewMember p3 = new CrewMember("Phil Cassidy", "Gunsmith", 2);

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
