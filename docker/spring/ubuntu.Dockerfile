# latest rolling devel
FROM ubuntu:latest
LABEL maintainer="Jeremy Zheng"

ENV DEBIAN_FRONTEND noninteractive

RUN apt update \
    && apt -y upgrade \
    && apt -y install debian-keyring debian-archive-keyring apt-transport-https software-properties-common curl wget gnupg

# https://launchpad.net/~ubuntu-toolchain-r/+archive/ubuntu/test
ENV AMD64_GCC_VERSION 13
ENV GCC_VERSION 12
RUN add-apt-repository -y ppa:ubuntu-toolchain-r/test
RUN echo "deb [arch=amd64] http://archive.ubuntu.com/ubuntu/ $(lsb_release -cs) main restricted universe multiverse" > /etc/apt/sources.list
RUN echo "deb [arch=amd64] http://archive.ubuntu.com/ubuntu/ $(lsb_release -cs)-updates main restricted universe multiverse" >> /etc/apt/sources.list
RUN echo "deb [arch=amd64] http://archive.ubuntu.com/ubuntu/ $(lsb_release -cs)-security main restricted universe multiverse" >> /etc/apt/sources.list
# https://apt.llvm.org/
ENV CLANG_VERSION 16
RUN echo "deb [arch=amd64] http://apt.llvm.org/$(lsb_release -cs)/ llvm-toolchain-$(lsb_release -cs)-${CLANG_VERSION} main" > /etc/apt/sources.list.d/llvm.list
RUN wget -qO- https://apt.llvm.org/llvm-snapshot.gpg.key | tee /etc/apt/trusted.gpg.d/apt.llvm.org.asc
# https://dart.dev/get-dart
RUN wget -qO- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/dart.gpg
RUN echo 'deb [signed-by=/usr/share/keyrings/dart.gpg arch=amd64] https://storage.googleapis.com/download.dartlang.org/linux/debian stable main' | tee /etc/apt/sources.list.d/dart_stable.list
# https://wiki.debian.org/ToolChain/Cross
RUN dpkg --add-architecture armhf
RUN dpkg --add-architecture arm64
RUN dpkg --add-architecture riscv64
RUN echo "deb [arch=armhf,arm64,riscv64] http://ports.ubuntu.com/ $(lsb_release -cs) main restricted universe multiverse" >> /etc/apt/sources.list
RUN echo "deb [arch=armhf,arm64,riscv64] http://ports.ubuntu.com/ $(lsb_release -cs)-security main restricted universe multiverse" >> /etc/apt/sources.list
RUN echo "deb [arch=armhf,arm64,riscv64] http://ports.ubuntu.com/ $(lsb_release -cs)-updates main restricted universe multiverse" >> /etc/apt/sources.list

# https://launchpad.net/~ondrej/+archive/ubuntu/php
RUN add-apt-repository -y ppa:ondrej/php
# https://launchpad.net/~ondrej/+archive/ubuntu/nginx
RUN add-apt-repository -y ppa:ondrej/nginx
# https://launchpad.net/~deadsnakes/+archive/ubuntu/ppa
RUN add-apt-repository -y ppa:deadsnakes/ppa

# https://www.envoyproxy.io/docs/envoy/latest/start/install#install-envoy-on-ubuntu-linux
RUN curl -sL 'https://deb.dl.getenvoy.io/public/gpg.8115BA8E629CC074.key' | gpg --dearmor -o /usr/share/keyrings/getenvoy-keyring.gpg
RUN echo a077cb587a1b622e03aa4bf2f3689de14658a9497a9af2c427bba5f4cc3c4723 /usr/share/keyrings/getenvoy-keyring.gpg | sha256sum --check
RUN echo "deb [arch=amd64 signed-by=/usr/share/keyrings/getenvoy-keyring.gpg] https://deb.dl.getenvoy.io/public/deb/ubuntu $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/getenvoy.list
RUN apt update && apt -y upgrade

ENV LUA_VERSION "5.4"
RUN apt-get install -y zsh git locales locales-all rsync openssh-client sshpass \
    vim tzdata pwgen zip unzip tree tmux dialog asciidoc doxygen \
    net-tools dnsutils net-tools iputils-arping iputils-ping telnet \
    imagemagick ffmpeg fonts-dejavu-extra texlive-full \
    build-essential g++-${GCC_VERSION} libstdc++-${GCC_VERSION}-dev \
    g++-${AMD64_GCC_VERSION} libstdc++-${AMD64_GCC_VERSION}-dev \
    crossbuild-essential-arm64 g++-${GCC_VERSION}-aarch64-linux-gnu libstdc++-${GCC_VERSION}-dev:arm64 \
    crossbuild-essential-armhf g++-${GCC_VERSION}-arm-linux-gnueabihf libstdc++-${GCC_VERSION}-dev:armhf \
    crossbuild-essential-riscv64 g++-${GCC_VERSION}-riscv64-linux-gnu libstdc++-${GCC_VERSION}-dev:riscv64 \
    clang-${CLANG_VERSION} clangd-${CLANG_VERSION} clang-tools-${CLANG_VERSION} clang-format-${CLANG_VERSION} lldb-${CLANG_VERSION} lld-${CLANG_VERSION} \
    cmake pkg-config libtool automake autoconf autoconf-archive binutils cpio mold \
    debhelper bison flex ninja-build \
    musl-tools musl-dev \
    python3-full python3-dev \
    php-fpm php-mbstring php-json php-xml php-pear php-bcmath php-curl php-zip \
    php-mysql php-pgsql php-sqlite3 php-redis php-mongodb php-amqp php-zmq \
    php-imagick php-gd phpunit \
    php-intl php-soap \
    liblua${LUA_VERSION}-dev dart haxe \
    erlang rebar \
    nginx-full rabbitmq-server redis postgresql mariadb-server getenvoy-envoy

RUN update-alternatives --install /usr/bin/clang++ clang++ /usr/bin/clang++-${CLANG_VERSION} 100 \
    && update-alternatives --install /usr/bin/clang clang /usr/bin/clang-${CLANG_VERSION} 100 \
    && update-alternatives --install /usr/bin/clang-format clang-format /usr/bin/clang-format-${CLANG_VERSION} 100 \
    && update-alternatives --install /usr/bin/lldb lldb /usr/bin/lldb-${CLANG_VERSION} 100 \
    && update-alternatives --install /usr/bin/lld lld /usr/bin/lld-${CLANG_VERSION} 100 \
    && update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-${AMD64_GCC_VERSION} 100 \
    && update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-${AMD64_GCC_VERSION} 100 \
    && update-alternatives --install /usr/bin/aarch64-linux-gnu-gcc aarch64-linux-gnu-gcc /usr/bin/aarch64-linux-gnu-gcc-${GCC_VERSION} 100 \
    && update-alternatives --install /usr/bin/aarch64-linux-gnu-g++ aarch64-linux-gnu-g++ /usr/bin/aarch64-linux-gnu-g++-${GCC_VERSION} 100 \
    && update-alternatives --install /usr/bin/arm-linux-gnueabihf-gcc arm-linux-gnueabihf-gcc /usr/bin/arm-linux-gnueabihf-gcc-${GCC_VERSION} 100 \
    && update-alternatives --install /usr/bin/arm-linux-gnueabihf-g++ arm-linux-gnueabihf-g++ /usr/bin/arm-linux-gnueabihf-g++-${GCC_VERSION} 100 \
    && update-alternatives --install /usr/bin/riscv64-linux-gnu-gcc riscv64-linux-gnu-gcc /usr/bin/riscv64-linux-gnu-gcc-${GCC_VERSION} 100 \
    && update-alternatives --install /usr/bin/riscv64-linux-gnu-g++ riscv64-linux-gnu-g++ /usr/bin/riscv64-linux-gnu-g++-${GCC_VERSION} 100


# https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/
# RUN wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
# RUN echo "deb [arch=amd64] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
# RUN apt update
# RUN apt install -y mongodb
# sudo chown root:root /usr/local/bin/pkl
# && sudo chown root:root /usr/local/bin/envoy
# && sudo chown root:root /usr/local/bin/minio
# && sudo chown root:root /usr/local/bin/dbmate

RUN echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && locale-gen
RUN useradd -s /bin/zsh -m deploy
RUN passwd -l deploy
RUN echo 'deploy ALL=(ALL:ALL) NOPASSWD: ALL' > /etc/sudoers.d/101-deploy
USER deploy
USER deploy

RUN apt -y autoremove && apt -y clean

RUN echo "en_US.UTF-8 UTF-8" > /etc/locale.gen \
    && locale-gen \
    && update-locale LANG=en_US.UTF-8

RUN update-alternatives --set editor /usr/bin/vim.basic

RUN mkdir -p $HOME/downloads $HOME/build $HOME/local $HOME/tmp


# https://github.com/ohmyzsh/ohmyzsh
RUN git clone https://github.com/ohmyzsh/ohmyzsh.git $HOME/.oh-my-zsh
RUN cp $HOME/.oh-my-zsh/templates/zshrc.zsh-template $HOME/.zshrc
RUN echo 'export LANG=en_US.UTF-8' >> $HOME/.zshrc \
    && echo 'export LC_ALL=en_US.UTF-8' >> $HOME/.zshrc \
    && echo 'export PATH=$HOME/.local/bin:$PATH' >> $HOME/.zshrc \
    && echo 'export PATH=$HOME/.yarn/bin:$PATH' >> $HOME/.zshrc

RUN git config --global core.quotepath false \
    && git config --global http.version HTTP/1.1 \
    && git config --global pull.rebase false \
    && git config --global url."https://".insteadOf git://
RUN echo 'set-option -g history-limit 102400' > $HOME/.tmux.conf \
    && echo 'set-option -g default-shell "/bin/zsh"' >> $HOME/.tmux.conf

# https://musl.cc/
RUN wget -q -P $HOME/downloads https://more.musl.cc/x86_64-linux-musl/x86_64-linux-musl-cross.tgz \
    && cd /opt \
    && tar xf $HOME/downloads/x86_64-linux-musl-cross.tgz \
    && echo 'export PATH=/opt/x86_64-linux-musl-cross/bin:$PATH' >> $HOME/.zshrc
RUN wget -q -P $HOME/downloads https://more.musl.cc/x86_64-linux-musl/armv7l-linux-musleabihf-cross.tgz \
    && cd /opt \
    && tar xf $HOME/downloads/armv7l-linux-musleabihf-cross.tgz \
    && echo 'export PATH=/opt/armv7l-linux-musleabihf-cross/bin:$PATH' >> $HOME/.zshrc
RUN wget -q -P $HOME/downloads https://more.musl.cc/x86_64-linux-musl/aarch64-linux-musl-cross.tgz \
    && cd /opt \
    && tar xf $HOME/downloads/aarch64-linux-musl-cross.tgz \
    && echo 'export PATH=/opt/aarch64-linux-musl-cross/bin:$PATH' >> $HOME/.zshrc
RUN wget -q -P $HOME/downloads https://more.musl.cc/x86_64-linux-musl/riscv64-linux-musl-cross.tgz \
    && cd /opt \
    && tar xf $HOME/downloads/riscv64-linux-musl-cross.tgz \
    && echo 'export PATH=/opt/riscv64-linux-musl-cross/bin:$PATH' >> $HOME/.zshrc


# https://pip.pypa.io/en/stable/installation/
# RUN sh -c ". $HOME/.profile && python3 -m ensurepip --upgrade"
RUN sh -c ". $HOME/.profile \
    && python3 -m venv $HOME/local/python3 \
    && . $HOME/local/python3/bin/activate \
    && pip install --upgrade pip \
    && pip install cmake ansible paramiko conan supervisor"
RUN echo 'source $HOME/local/python3/bin/activate' >> $HOME/.zshrc
RUN echo 'export ANSIBLE_HOST_KEY_CHECKING=False' >> $HOME/.zshrc \
    && echo 'alias peony="ANSIBLE_LOG_PATH=$HOME/tmp/$(date +%Y%m%d%H%M%S).log ansible-playbook"' >> $HOME/.zshrc

# https://getcomposer.org/doc/00-intro.md#installation-linux-unix-macos
RUN wget -q -O $HOME/downloads/composer https://getcomposer.org/installer
RUN cd $HOME/downloads \
    && php composer \
    && mkdir -p $HOME/.local/bin \
    && mv composer.phar $HOME/.local/bin/composer


# https://github.com/bazelbuild/bazelisk
ENV BAZEL_VERSION "v1.18.0"
RUN wget -q -O $HOME/.local/bin/bazel \
    https://github.com/bazelbuild/bazelisk/releases/download/${BAZEL_VERSION}/bazelisk-linux-amd64
RUN chmod +x $HOME/.local/bin/bazel

# https://github.com/rbenv/rbenv
ENV RUBY_VERSION "3.2.2"
RUN git clone https://github.com/rbenv/rbenv.git $HOME/.rbenv \
    && git clone https://github.com/rbenv/ruby-build.git $HOME/.rbenv/plugins/ruby-build \
    && git clone https://github.com/rbenv/rbenv-vars.git $HOME/.rbenv/plugins/rbenv-vars 
RUN echo 'eval "$(~/.rbenv/bin/rbenv init - zsh)"' >> ~/.zshrc
# https://github.com/rbenv/ruby-build
# https://github.com/rbenv/ruby-build/wiki#ubuntudebianmint
RUN apt-get install -y autoconf patch build-essential rustc libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libgmp-dev libncurses5-dev libffi-dev libgdbm6 libgdbm-dev libdb-dev uuid-dev
# FIXME
# RUN zsh -c "source $HOME/.zshrc \
#     && rbenv install ${RUBY_VERSION} \
#     && rbenv global ${RUBY_VERSION} \
#     && gem install bundler"

# https://go.dev/doc/install
ENV GO_VERSION "1.20.6"
RUN wget -q -P $HOME/downloads https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz
RUN tar xf $HOME/downloads/go${GO_VERSION}.linux-amd64.tar.gz -C $HOME/local
RUN echo 'export GOROOT=$HOME/local/go' >> $HOME/.zshrc \
    && echo 'export PATH=$GOROOT/bin:$PATH' >> $HOME/.zshrc \
    && echo 'export GOPATH=$HOME/go' >> $HOME/.zshrc

# https://github.com/sdkman/sdkman-cli
ENV JDK_VERSION "20.0.2-open"
ENV GRADLE_VERSION "8.2.1"
ENV THRIFT_JAVA_VERSION "19.0.2-open"
ENV THRIFT_GRADLE_VERSION "7.6.2"
RUN curl -s "https://get.sdkman.io" | bash
RUN sed -i -e 's/sdkman_auto_answer=false/sdkman_auto_answer=true/g' $HOME/.sdkman/etc/config
RUN zsh -c "source $HOME/.zshrc \
    && sdk install java ${JDK_VERSION} \
    && sdk install ant \
    && sdk install maven \
    && sdk install gradle ${GRADLE_VERSION} \
    && sdk install kotlin \
    && sdk install java  ${THRIFT_JAVA_VERSION} \
    && sdk install gradle ${THRIFT_GRADLE_VERSION} \
    && sdk default java ${JDK_VERSION} \
    && sdk default gradle ${GRADLE_VERSION}"

# https://github.com/nvm-sh/nvm
ENV NVM_VERSION "v0.39.5"
RUN git clone -b ${NVM_VERSION} https://github.com/nvm-sh/nvm.git $HOME/.nvm
RUN echo 'export NVM_DIR="$HOME/.nvm"' >> $HOME/.zshrc \
    && echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> $HOME/.zshrc \
    && echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> $HOME/.zshrc
# https://stackoverflow.com/questions/37324519/node-sass-does-not-yet-support-your-current-environment-linux-64-bit-with-false
RUN zsh -c "source $HOME/.zshrc \
    && nvm install node \
    && nvm use node \
    && npm i yarn -g \
    && nvm install --lts \
    && nvm use --lts \
    && npm i yarn -g \
    && nvm install lts/fermium \
    && nvm use lts/fermium \
    && npm i yarn -g"
RUN echo 'export PATH=$HOME/.yarn/bin:$PATH' >> $HOME/.zshrc

# https://www.rust-lang.org/tools/install
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
# https://doc.rust-lang.org/nightly/rustc/platform-support.html
RUN zsh -c "source $HOME/.cargo/env \
    && rustup component add rust-analyzer \
    && rustup target add armv7-unknown-linux-gnueabihf \
    && rustup target add aarch64-unknown-linux-gnu \
    && rustup target add x86_64-unknown-linux-musl \
    && rustup target add aarch64-unknown-linux-musl \
    && rustup target add loongarch64-unknown-linux-gnu"

RUN apt install -y libpq-dev libmysqlclient-dev libsqlite3-dev
RUN zsh -c "source $HOME/.zshrc \
    && cargo install diesel_cli \
    && cargo install --locked cargo-outdated \
    && cargo install mdbook"

# https://www.swift.org/download/#releases
ENV SWIFT_VERSION "5.8.1"
RUN wget -q -P $HOME/downloads https://download.swift.org/swift-${SWIFT_VERSION}-release/ubuntu2204/swift-${SWIFT_VERSION}-RELEASE/swift-${SWIFT_VERSION}-RELEASE-ubuntu22.04.tar.gz \
    && cd /opt \
    && tar xf $HOME/downloads/swift-${SWIFT_VERSION}-RELEASE-ubuntu22.04.tar.gz \
    && echo "export PATH=/opt/swift-${SWIFT_VERSION}-RELEASE-ubuntu22.04/bin:\$PATH" >> $HOME/.zshrc

# https://github.com/microsoft/vcpkg
RUN git clone https://github.com/microsoft/vcpkg.git $HOME/local/vcpkg
RUN $HOME/local/vcpkg/bootstrap-vcpkg.sh \
    && echo 'export VCPKG_DISABLE_METRICS=1' >> $HOME/.zshrc

# https://opensearch.org/downloads.html#opensearch
ENV OPENSEARCH_VERSION "2.9.0"
RUN wget -q -P $HOME/downloads \
    https://artifacts.opensearch.org/releases/bundle/opensearch/${OPENSEARCH_VERSION}/opensearch-${OPENSEARCH_VERSION}-linux-x64.tar.gz
RUN tar xf $HOME/downloads/opensearch-${OPENSEARCH_VERSION}-linux-x64.tar.gz -C /opt \
    && mv /opt/opensearch-${OPENSEARCH_VERSION} /opt/opensearch

# https://min.io/download#/linux
RUN wget -q -O /usr/bin/minio \
    https://dl.min.io/server/minio/release/linux-amd64/minio
RUN chmod +x /usr/bin/minio

# https://github.com/grpc/grpc
ENV GRPC_VERSION "v1.57.0"
RUN git clone --recurse-submodules -b $GRPC_VERSION https://github.com/grpc/grpc.git $HOME/downloads/grpc
# ENV PROTOBUF_VERSION "v3.21.8"
# RUN cd $HOME/downloads/grpc/third_party/protobuf \
#     && git checkout ${PROTOBUF_VERSION} \
#     && git submodule update --init --recursive
RUN zsh -c "source $HOME/.zshrc \
    && mkdir -pv $HOME/build/grpc \
    && cd $HOME/build/grpc \
    && cmake -DCMAKE_BUILD_TYPE=Release \
    -DgRPC_INSTALL=ON \
    -DgRPC_SSL_PROVIDER=package \
    -DgRPC_BUILD_TESTS=OFF \
    -DCMAKE_INSTALL_PREFIX=$HOME/.local $HOME/downloads/grpc \
    && make \
    && make install"

# https://github.com/grpc/grpc-web#code-generator-plugin
ENV GRPC_WEB_PLUGIN_VERSION "1.4.2"
RUN wget -q -O $HOME/.local/bin/protoc-gen-grpc-web \
    https://github.com/grpc/grpc-web/releases/download/${GRPC_WEB_PLUGIN_VERSION}/protoc-gen-grpc-web-${GRPC_WEB_PLUGIN_VERSION}-linux-x86_64
RUN chmod +x $HOME/.local/bin/protoc-gen-grpc-web

# https://github.com/protocolbuffers/protobuf-javascript
ENV GRPC_JS_PLUGIN_VERSION "3.21.2"
RUN wget -q -P $HOME/downloads \
    https://github.com/protocolbuffers/protobuf-javascript/releases/download/v${GRPC_JS_PLUGIN_VERSION}/protobuf-javascript-${GRPC_JS_PLUGIN_VERSION}-linux-x86_64.tar.gz
RUN mkdir -p $HOME/build/protobuf-javascript \
    && cd $HOME/build/protobuf-javascript \
    && tar xf $HOME/downloads/protobuf-javascript-${GRPC_JS_PLUGIN_VERSION}-linux-x86_64.tar.gz \
    && cp bin/protoc-gen-js $HOME/.local/bin/

# https://repo1.maven.org/maven2/io/grpc/protoc-gen-grpc-java/
# https://github.com/grpc/grpc-java
ENV GRPC_JAVA_PLUGIN_VERSION "1.57.2"
RUN wget -q -O $HOME/.local/bin/grpc_java_plugin \
    https://repo1.maven.org/maven2/io/grpc/protoc-gen-grpc-java/${GRPC_JAVA_PLUGIN_VERSION}/protoc-gen-grpc-java-${GRPC_JAVA_PLUGIN_VERSION}-linux-x86_64.exe
RUN chmod +x $HOME/.local/bin/grpc_java_plugin

# https://github.com/grpc/grpc-node
# https://github.com/grpc/grpc-node/tree/master/examples/helloworld/static_codegen
RUN zsh -c "source $HOME/.zshrc \
    && yarn global add grpc-tools"

# https://grpc.io/docs/languages/go/quickstart/
RUN zsh -c "source $HOME/.zshrc \
    && go install google.golang.org/protobuf/cmd/protoc-gen-go@latest \
    && go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest"

# https://github.com/google/flatbuffers
ENV FLATBUFFERS_VERSION "v23.5.26"
RUN git clone -b $FLATBUFFERS_VERSION https://github.com/google/flatbuffers.git $HOME/downloads/flatbuffers
RUN zsh -c "source $HOME/.zshrc \
    && mkdir -pv $HOME/build/flatbuffers \
    && cd $HOME/build/flatbuffers \
    && CC=/usr/bin/clang CXX=/usr/bin/clang++ cmake -G 'Unix Makefiles' -DCMAKE_BUILD_TYPE=Release -DFLATBUFFERS_BUILD_TESTS=OFF \
    -DCMAKE_INSTALL_PREFIX=$HOME/.local $HOME/downloads/flatbuffers \
    && make \
    && make install"

# https://github.com/amacneil/dbmate
RUN curl -fsSL -o $HOME/.local/bin/dbmate https://github.com/amacneil/dbmate/releases/latest/download/dbmate-linux-amd64
RUN chmod +x $HOME/.local/bin/dbmate

# https://github.com/apache/thrift
# https://thrift.apache.org/docs/install/
ENV THRIFT_VERSION "v0.18.1"
RUN git clone -b $THRIFT_VERSION https://github.com/apache/thrift.git $HOME/downloads/thrift
RUN apt install -y libboost-all-dev libevent-dev libz-dev zlib1g-dev \
    mono-devel \
    libglib2.0-dev \
    libbit-vector-perl libclass-accessor-perl
# Could not find method classifier() for arguments [test] on task ':testJar'

# TODO 
# composer: Continue as root/super user confirm
# haxelib setup
# haxelib install uuid
# haxelib install hxcpp
# FIXME make install && make install/fast
# RUN zsh -c "source $HOME/.zshrc \
#     && cd $HOME/downloads/thrift \
#     && sdk use java ${THRIFT_JAVA_VERSION} \
#     && sdk use gradle ${THRIFT_GRADLE_VERSION} \
#     && ./bootstrap.sh \
#     && ./configure MAKE=gmake CXXFLAGS='-g -O2' CFLAGS='-g -O2' --prefix=$HOME/.local --disable-tests"


# ADD conan /opt/conan
# RUN zsh -c "source $HOME/.zshrc && cd /opt/conan && ./install.sh amd64"
# RUN zsh -c "source $HOME/.zshrc && cd /opt/conan && ./install.sh arm64"
# RUN zsh -c "source $HOME/.zshrc && cd /opt/conan && ./install.sh armhf"

# https://opensearch.org/docs/latest/opensearch/install/tar/
RUN echo "network.host: 0.0.0.0" >> /opt/opensearch/config/opensearch.yml \
    && echo "discovery.type: single-node" >> /opt/opensearch/config/opensearch.yml \
    && echo "plugins.security.disabled: true" >> /opt/opensearch/config/opensearch.yml \
    && chown -R nobody /opt/opensearch

RUN mkdir -p /var/lib/minio/data \
    && chown -R nobody /var/lib/minio

RUN sed -i 's/127.0.0.1/0.0.0.0/g' /etc/mysql/mariadb.conf.d/50-server.cnf

RUN su - postgres -c "/usr/lib/postgresql/14/bin/initdb -D /var/lib/postgresql/data"
RUN echo "listen_addresses = '0.0.0.0'" >> /var/lib/postgresql/data/postgresql.conf \
    && echo "host  all  all 0.0.0.0/0 md5" >> /var/lib/postgresql/data/pg_hba.conf

ADD etc/redis/* /etc/redis/
RUN cd /var/lib \
    && mkdir redis-s redis-1 redis-2 redis-3 redis-4 redis-5 redis-6 \
    && chown redis:redis redis-s redis-1 redis-2 redis-3 redis-4 redis-5 redis-6 \
    && chmod 750 redis-s redis-1 redis-2 redis-3 redis-4 redis-5 redis-6

RUN mkdir -p /run/php \
    && echo "<?php phpinfo(); ?>" > /var/www/html/info.php \
    && echo "daemon off;" >> /etc/nginx/nginx.conf
ADD etc/nginx.conf /etc/nginx/sites-enabled/default

ADD etc/envoy.yaml /etc/
ADD etc/supervisor /etc/supervisor

RUN echo "$(date -u +%4Y%m%d%H%M%S)" | tee /VERSION

VOLUME /workspace
WORKDIR /workspace

CMD ["/bin/zsh", "-l"]
