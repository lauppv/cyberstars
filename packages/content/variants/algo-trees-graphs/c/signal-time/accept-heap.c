int heap[MAX_N * MAX_N][2];
int size;

void push(int d, int v) {
    int i = size++;
    while (i > 0 && heap[(i - 1) / 2][0] > d) {
        heap[i][0] = heap[(i - 1) / 2][0];
        heap[i][1] = heap[(i - 1) / 2][1];
        i = (i - 1) / 2;
    }
    heap[i][0] = d;
    heap[i][1] = v;
}

void pop(int *d, int *v) {
    *d = heap[0][0];
    *v = heap[0][1];
    size--;
    int last_d = heap[size][0];
    int last_v = heap[size][1];
    int i = 0;
    while (2 * i + 1 < size) {
        int child = 2 * i + 1;
        if (child + 1 < size && heap[child + 1][0] < heap[child][0]) {
            child++;
        }
        if (heap[child][0] >= last_d) {
            break;
        }
        heap[i][0] = heap[child][0];
        heap[i][1] = heap[child][1];
        i = child;
    }
    heap[i][0] = last_d;
    heap[i][1] = last_v;
}

int signal_time(int s) {
    int dist[MAX_N];
    for (int v = 0; v < n; v++) {
        dist[v] = -1;
    }
    dist[s] = 0;
    push(0, s);
    while (size > 0) {
        int d, u;
        pop(&d, &u);
        if (d > dist[u]) {
            continue;
        }
        for (int i = 0; i < count[u]; i++) {
            int v = adj[u][i];
            if (dist[v] == -1 || d + weight[u][i] < dist[v]) {
                dist[v] = d + weight[u][i];
                push(dist[v], v);
            }
        }
    }
    int slowest = 0;
    for (int v = 0; v < n; v++) {
        if (dist[v] == -1) {
            return -1;
        }
        if (dist[v] > slowest) {
            slowest = dist[v];
        }
    }
    return slowest;
}
