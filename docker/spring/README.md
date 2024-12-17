# USAGE

- add to `/etc/sysctl.d/60-palm.conf` and then `reboot` or `sysctl --system`

  ```text
  vm.overcommit_memory = 1
  vm.max_map_count = 262144
  ```

- start container [dashboard](http://localhost:10001)

  ```bash
  $ cd ~/workspace
  $ ./saturn-xiv/palm/docker/spring/start.sh
  > sudo supervisord -c /etc/supervisor/supervisord.conf
  # init redis cluster
  > sudo /etc/redis/clusters-init.sh
  ```

- PostgreSql

  ```bash
  psql -h 127.0.0.1 -p 5432 -U postgres
  ```

- MySql

  ```bash
  # reset root's password
  > sudo mariadb-secure-installation
  mariadb -h 127.0.0.1 -P 3306 -u root -p
  ```

- Redis

  ```bash
  # connect to redis cluster
  redis-cli -c -h 127.0.0.1 -p 6371
  # check cluster status
  redis-cli --cluster check 127.0.0.1:6371
  ```

- Minio [dashboard](http://localhost:9091) (`admin:12345678`)

- RabbitMQ [dashboard](http://localhost:15672) (`guest:guest`)

- Php [info.php](http://localhost:8080/info.php) [XDebug](https://wiki.archlinux.org/index.php/PHP#XDebug) [XDebug mode](https://xdebug.org/docs/install#mode)

  ```bash
  php -r "var_dump(extension_loaded('xdebug'));"
  ```

- OpenSearch

  ```bash
  # show info
  curl -X GET http://localhost:9200
  curl -X GET http://localhost:9200/_cat/plugins?v
  ```

- Vcpkg

  ```bash
  $HOME/local/vcpkg/vcpkg upgrade --no-dry-run
  ```
