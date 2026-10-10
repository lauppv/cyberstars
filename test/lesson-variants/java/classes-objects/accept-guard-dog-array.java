class GuardDog {
    String dogName;
    int years;
}

public class Main {
    public static void main(String[] args) {
        String name1 = "Rex";
        int age1 = 5;
        String name2 = "Buddy";
        int age2 = 3;

        GuardDog[] pack = {new GuardDog(), new GuardDog()};
        pack[0].dogName = name1;
        pack[0].years = age1;
        pack[1].dogName = name2;
        pack[1].years = age2;
        for (GuardDog g : pack) {
            System.out.println(String.format("%s is %d years old", g.dogName, g.years));
        }
    }
}
