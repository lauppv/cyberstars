FROM python:3.10-slim

# Crează user non-root
RUN useradd -m codeuser

# Directorul de lucru
WORKDIR /usr/src/app

# Copiază serverul Python
COPY app.py ./

# Permisiuni
RUN chmod +x app.py

# Folosește user non-root
USER codeuser

# Expune portul
EXPOSE 5000

# Rulează serverul
CMD ["python3", "app.py"]
