class Pet {
    // fields, constructor, methods
}

public class Main {
    public static void main(String[] args) {
        Pet p1 = new Pet("Rex", "Dog", 3);
        Pet p2 = new Pet("Whiskers", "Cat", 5);
        Pet p3 = new Pet("Nemo", "Fish", 1);

        p1.play();
        p1.play();
        p1.feed();
        p2.feed();
        p3.play();
        p3.play();
        p3.play();
        p3.play();

        System.out.println(p1.status());
        System.out.println(p2.status());
        System.out.println(p3.status());
    }

}
