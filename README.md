# 数据库概论大作业

> 混就是了

## 作业说明

实现平台：Web(Vue.js) + Node.js(Fastify) + PostgreSql

- E-R 模型图、关系模型图参见 [docs/graphs](docs/graphs/)；
- 创建必要的数据：未在此仓库中提供，生成代码参见 [packages/mock](packages/mock/);
- 实现查询、触发器、用户权限管理：参见 [docs/sql.md](docs/sql.md)；
- MapReduce 应用：参见 [docs/mapreduce](docs/mapreduce/)；
- 用户程序：按以下说明部署后即可演示。前端代码在 `packages/frontend`，后端代码在 `packages/backend`。
- 小组分工情况：早期部分模型图设计由郭易同学完成，所有的代码和作业均由谷雨独立完成。[CHANGELOG.md](CHANGELOG.md) 中记录了开发的过程。

## 部署说明

### `.env`

```properties
POSTGRES_HOST=db
POSTGRES_USER=...
POSTGRES_PASSWORD=...
POSTGRES_DB=...
PORT=80
```

### 生成测试数据

```sh
node scripts/init.mjs
```

### Docker

```
sudo docker compose up --build -d
```

## 使用文档

有手就能用
