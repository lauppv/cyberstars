import java.io.BufferedReader;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader r = new BufferedReader(new InputStreamReader(System.in));
        String name = r.readLine();
        int age = Integer.parseInt(r.readLine().trim());
        System.out.println("Hello " + name + ", you are " + age + " years old. Next year you will be " + (age + 1));
    }
}
