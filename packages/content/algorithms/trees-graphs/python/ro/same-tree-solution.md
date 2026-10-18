```py
def acelasi_arbore(primul, al_doilea):
    if primul is None or al_doilea is None:
        return primul is None and al_doilea is None
    return (
        primul.valoare == al_doilea.valoare
        and acelasi_arbore(primul.stanga, al_doilea.stanga)
        and acelasi_arbore(primul.dreapta, al_doilea.dreapta)
    )
```
