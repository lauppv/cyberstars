class ContBancar {
}

public class Main {
    public static void main(String[] args) {
        ContBancar a1 = new ContBancar("Tommy", 1000);
        ContBancar a2 = new ContBancar("Lance", 500);

        a1.depune(250);
        a2.retrage(200);
        a2.retrage(400);

        System.out.println(a1);
        System.out.println(a2);
        System.out.println("Total conturi: " + ContBancar.getTotalConturi());
    }
}
