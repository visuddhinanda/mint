# 开发线培训文档

## 系统设置

### [操作系统准备](../deployment/)

- 添加如下到 `/etc/sysctl.d/60-my.conf`，然后 `sudo reboot` 或 `sudo sysctl -p`

  ```text
  vm.overcommit_memory = 1
  vm.max_map_count = 262144
  ```

### 镜像准备

```bash
# 解压镜像
cat palm-jammy.tar.xz.?? | tar jx
# 导入镜像
podman load -i palm-jammy-TIMESTAMP.tar
# 启动容器
cd ~/workspace
./PROJECT/scripts/docker/jammy.sh
```

### 容器准备

- 启动 [dashboard](http://localhost:10001)

  ```bash
  $ cd ~/workspace
  $ ./saturn-xiv/palm/docker/jammy/start.sh
  > supervisord -c /etc/supervisor/supervisord.conf # 启动服务
  > /etc/redis/clusters-init.sh # 初始化redis集群
  ```

  ![run.png](../assets/docker/run.png)

  ![services.png](../assets/docker/services.png)

### 常见连接和测试

- PostgreSql

  ```bash
  psql -h 127.0.0.1 -p 5432 -U postgres
  ```

- MySql

  ```bash
  # reset root's password
  mysql_secure_installation
  ```

- Redis

  ```bash
  # connect to redis node-1
  redis-cli -c -h 127.0.0.1 -p 16371
  ```

- Minio [dashboard](http://localhost:9001) (`admin:12345678`)

- RabbitMQ [dashboard](http://localhost:15672) (`guest:guest`)

  ```bash
  # enable rabbitmq management plugin
  rabbitmq-plugins enable rabbitmq_management
  ```

- Php [info.php](http://localhost:8080/info.php)

- OpenSearch

  ```bash
  # show info
  curl -X GET http://localhost:9200
  curl -X GET http://localhost:9200/_cat/plugins?v
  ```

## 后端

- [CPP20](cpp/)
- [JAVA](java/)
- [NODE](node/)
- [php](php/)

## [前端](frontend/)