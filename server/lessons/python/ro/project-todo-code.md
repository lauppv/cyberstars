def add_task(tasks, nume): # adaugă o sarcină nouă: {"nume": nume, "done": False}
pass

def complete_task(tasks, index): # marchează sarcina de la index ca terminată
pass

def count_done(tasks): # returnează câte sarcini au done == True
pass

tasks = []
add_task(tasks, "Rulează diagnoza")
add_task(tasks, "Realimentează reactorul")
add_task(tasks, "Trasează traseul")
complete_task(tasks, 0)
complete_task(tasks, 2)

# afișează fiecare sarcină ca "0. [terminat] Rulează diagnoza" sau "1. [în așteptare] Realimentează reactorul",

# apoi afișează "Finalizat: " + câte sunt terminate + "/" + totalul
