public class Main {
    static class Dog {
        String name;
        int age;

        String describe() {
            return name + " is " + age + " years old";
        }
    }

    public static void main(String[] args) {
        String name1 = "Rex";
        int age1 = 5;
        String name2 = "Buddy";
        int age2 = 3;
        Dog a = new Dog();
        Dog b = new Dog();
        a.name = name1;
        b.name = name2;
        a.age = age1;
        b.age = age2;
        System.out.print(a.describe() + "\n" + b.describe() + "\n");
    }
}
