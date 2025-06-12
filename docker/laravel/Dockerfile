FROM ubuntu:latest
LABEL maintainer="Jeremy Zheng"

ENV DEBIAN_FRONTEND noninteractive
ARG PHP_VERSION=8.4

RUN apt update
RUN apt -y install lsb-release apt-utils \
    debian-keyring debian-archive-keyring apt-transport-https software-properties-common curl wget gnupg
RUN apt -y upgrade
RUN apt -y install git vim locales locales-all tzdata unzip
RUN apt -y autoremove
RUN apt -y clean

RUN echo "en_US.UTF-8 UTF-8" > /etc/locale.gen
RUN locale-gen
RUN update-locale LANG=en_US.UTF-8
RUN update-alternatives --set editor /usr/bin/vim.basic

RUN mkdir -p $HOME/downloads $HOME/build $HOME/local $HOME/tmp

RUN TERM=xterm bash -i -c "$(curl -fsSL https://php.new/install/linux/8.4)"
RUN bash -i -c "composer global require laravel/installer"

# https://github.com/nvm-sh/nvm
ENV NVM_VERSION "v0.40.3"
RUN git clone -b ${NVM_VERSION} https://github.com/nvm-sh/nvm.git $HOME/.nvm
RUN echo 'export NVM_DIR="$HOME/.nvm"' >> $HOME/.bashrc
RUN echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> $HOME/.bashrc
RUN echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> $HOME/.bashrc
RUN bash -i -c "nvm install --lts"
RUN bash -i -c "npm install -g yarn"

RUN echo "$(date -u +%4Y%m%d%H%M%S)" | tee /VERSION

VOLUME /workspace
WORKDIR /workspace

CMD ["/bin/bash", "-l"]
