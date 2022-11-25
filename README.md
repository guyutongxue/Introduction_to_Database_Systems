# 数据库概论大作业

混就是了

## 部署说明

### `.env`

```properties
POSTGRES_HOST=db
POSTGRES_USER=...
POSTGRES_PASSWORD=...
POSTGRES_DB=...
PORT=80
```

## 生成测试数据

```sh
node scripts/init.mjs
```

### Docker

```
sudo docker compose up --build -d
```
