FROM ubuntu:22.04

# Evitar que la instalación de paquetes pida confirmación
ENV DEBIAN_FRONTEND=noninteractive

# Instalar paquetes básicos del sistema
RUN apt-get update && apt-get install -y \
    curl \
    git \
    nano \
    vim \
    gnupg \
    ca-certificates \
    sudo \
    && apt-get clean

# Crear un usuario "estudiante" con permisos para usar sudo
# (sin que nos pida contraseña al usar sudo, para no atorarnos durante el lab)
RUN useradd -m -s /bin/bash estudiante \
    && echo "estudiante:password" | chpasswd \
    && usermod -aG sudo estudiante \
    && echo "estudiante ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/estudiante \
    && chmod 0440 /etc/sudoers.d/estudiante

# Instalar Node.js 20 LTS usando NVM (Node Version Manager)
# para el usuario "estudiante"
USER estudiante
WORKDIR /home/estudiante

# Volver a root para los pasos finales del Dockerfile
USER root

# Abrir los puertos 80 (web) y 3000 (Express)
EXPOSE 80 3000

# Mantener el contenedor encendido
CMD ["tail", "-f", "/dev/null"]