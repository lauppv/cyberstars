class Dog {
    String name;
    int age;
}

public class Main {
    public static void main(String[] args) {
        String name1 = "Rex";
        int age1 = 5;
        String name2 = "Buddy";
        int age2 = 3;
        Dog d1 = new Dog();
        d1.name = name1;
        d1.age = age1;
        Dog d2 = new Dog();
        d2.name = name2;
        d2.age = age2;
        System.out.println("Rex is 5 years old");
        System.out.println("Buddy is 3 years old");
    }
}
