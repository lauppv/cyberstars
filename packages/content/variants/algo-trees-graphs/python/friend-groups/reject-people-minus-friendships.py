# adj[u] lists the neighbours of vertex u.
def count_groups(adj):
    friendships = sum(len(friends) for friends in adj) // 2
    return len(adj) - friendships
