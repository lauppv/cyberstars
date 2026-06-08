def adauga_sarcina(sarcini, nume): # adaugă o sarcină nouă: {"nume": nume, "done": False}
    pass

def finalizeaza_sarcina(sarcini, index): # marchează sarcina de la index ca terminată
    pass

def numara_finalizate(sarcini): # returnează câte sarcini au done == True
    pass

sarcini = []
adauga_sarcina(sarcini, "Rulează diagnoza")
adauga_sarcina(sarcini, "Realimentează reactorul")
adauga_sarcina(sarcini, "Trasează traseul")
finalizeaza_sarcina(sarcini, 0)
finalizeaza_sarcina(sarcini, 2)

# afișează fiecare sarcină ca "0. [terminat] Rulează diagnoza" sau "1. [în așteptare] Realimentează reactorul",

# apoi afișează "Finalizat: " + câte sunt terminate + "/" + totalul
