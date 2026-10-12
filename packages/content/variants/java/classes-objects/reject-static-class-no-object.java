public class Main {
    static class Dog {
        static String describe(String name, int age) {
            return name + " is " + age + " years old";
        }
    }

    public static void main(String[] args) {
        String name1 = "Rex";
        int age1 = 5;
        String name2 = "Buddy";
        int age2 = 3;
        System.out.println(Dog.describe(name1, age1));
        System.out.println(Dog.describe(name2, age2));
    }
}
