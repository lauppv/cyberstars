public class Main {
    static boolean mayEnter(boolean e, boolean w, boolean g, boolean i) {
        return (e && w) || (g && i);
    }

    public static void main(String[] args) {
        boolean employee = true;
        boolean workingDay = true;
        boolean guest = false;
        boolean invitation = false;
        System.out.println("Access " + (mayEnter(employee, workingDay, guest, invitation) ? "granted" : "denied"));
    }
}
