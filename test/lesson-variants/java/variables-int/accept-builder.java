public class Main {
    public static void main(String[] args) {
        int age = 57;
        double height = 1.67;

        StringBuilder line = new StringBuilder("My name is Cortez, I am ");
        line.append(age).append(" years old and ").append(height).append(" m tall");
        System.out.println(line);
    }
}
