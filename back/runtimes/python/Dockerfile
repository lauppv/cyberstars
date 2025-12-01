# Imagine de bază
FROM python:3.10-slim

# Director de lucru
WORKDIR /usr/src/app

# Rulează ca root pentru a avea acces la volume montate
USER root

# Copiază scriptul de rulare
COPY run_code.sh .
RUN chmod +x run_code.sh

# Nu mai copiem codul utilizatorului, va fi montat cu -v
