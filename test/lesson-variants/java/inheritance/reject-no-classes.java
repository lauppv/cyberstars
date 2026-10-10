public class Main {
    static void speak(String role, String name) {
        System.out.println("I'm the " + role + " " + name);
    }

    public static void main(String[] args) {
        String name1 = "Tommy";
        String name2 = "Lance";
        speak("driver", name1);
        speak("gunman", name2);
    }
}
