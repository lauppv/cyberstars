
# Imagine de bază
FROM python:3.10-slim

# Director de lucru
WORKDIR /usr/src/app

# Rulează ca root pentru acces la volume montate
USER root

# Copiază scriptul de rulare și dă-i permisiuni
COPY run_code.sh .
RUN chmod +x run_code.sh

# Dezactivează buffering-ul Python
ENV PYTHONUNBUFFERED=1

# Codul utilizatorului va fi montat la rulare, nu aici
