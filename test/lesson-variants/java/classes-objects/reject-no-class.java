public class Main {
    public static void main(String[] args) {
        String name1 = "Rex";
        int age1 = 5;
        String name2 = "Buddy";
        int age2 = 3;
        String[] names = {name1, name2};
        int[] ages = {age1, age2};
        for (int i = 0; i < names.length; i++) {
            System.out.println(names[i] + " is " + ages[i] + " years old");
        }
    }
}
