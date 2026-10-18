```c
bool exista_drum(int s, int t) {
    bool vazut[MAX_N] = {false};
    int coada[MAX_N];
    int inceput = 0;
    int sfarsit = 0;
    vazut[s] = true;
    coada[sfarsit++] = s;
    while (inceput < sfarsit) {
        int u = coada[inceput++];
        if (u == t) {
            return true;
        }
        for (int i = 0; i < numar[u]; i++) {
            int v = vecini[u][i];
            if (!vazut[v]) {
                vazut[v] = true;
                coada[sfarsit++] = v;
            }
        }
    }
    return false;
}
```
