```java
import java.util.ArrayList;

public class Main {
    static void schimba(ArrayList<Integer> heap, int i, int j) {
        int temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }

    static void adaugaInHeap(ArrayList<Integer> heap, int valoare) {
        heap.add(valoare);
        int i = heap.size() - 1;
        while (i > 0) {
            int parinte = (i - 1) / 2;
            if (heap.get(i) < heap.get(parinte)) {
                schimba(heap, i, parinte);
                i = parinte;
            } else {
                break;
            }
        }
    }

    static int scoateDinHeap(ArrayList<Integer> heap) {
        int celMaiMic = heap.get(0);
        int ultim = heap.remove(heap.size() - 1);
        if (heap.size() > 0) {
            heap.set(0, ultim);
            int i = 0;
            while (true) {
                int stanga = 2 * i + 1;
                int dreapta = 2 * i + 2;
                int copil = i;
                if (stanga < heap.size() && heap.get(stanga) < heap.get(copil)) {
                    copil = stanga;
                }
                if (dreapta < heap.size() && heap.get(dreapta) < heap.get(copil)) {
                    copil = dreapta;
                }
                if (copil == i) {
                    break;
                }
                schimba(heap, i, copil);
                i = copil;
            }
        }
        return celMaiMic;
    }

    public static void main(String[] args) {
        int[] valori = {5, 3, 8, 1, 9, 6};
        int extrageri = 2;

        ArrayList<Integer> heap = new ArrayList<>();
        for (int valoare : valori) {
            adaugaInHeap(heap, valoare);
        }

        System.out.print("Heap: ");
        for (int valoare : heap) {
            System.out.print(valoare + " ");
        }
        System.out.println();

        System.out.print("Extrase: ");
        for (int i = 0; i < extrageri; i++) {
            System.out.print(scoateDinHeap(heap) + " ");
        }
        System.out.println();

        System.out.print("Ramase: ");
        for (int valoare : heap) {
            System.out.print(valoare + " ");
        }
        System.out.println();
    }
}
```
