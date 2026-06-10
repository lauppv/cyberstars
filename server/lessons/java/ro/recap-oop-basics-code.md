class AnimalCompanie {
}

public class Main {
    public static void main(String[] args) {
        AnimalCompanie p1 = new AnimalCompanie("Rex", "Caine", 3);
        AnimalCompanie p2 = new AnimalCompanie("Whiskers", "Pisica", 5);
        AnimalCompanie p3 = new AnimalCompanie("Nemo", "Peste", 1);

        p1.joaca();
        p1.joaca();
        p1.hraneste();
        p2.hraneste();
        p3.joaca();
        p3.joaca();
        p3.joaca();
        p3.joaca();

        System.out.println(p1.status());
        System.out.println(p2.status());
        System.out.println(p3.status());
    }
}
