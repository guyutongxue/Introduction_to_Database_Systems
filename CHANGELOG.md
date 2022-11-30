# 开发记录

## 11.21

- 立项
- 确定选型（Fastify、PostgreSQL、Docker）

## 11.23、11.24

- 修 bug
- 郭：初版 E-R 图

## 11.25

- 郭：提供 E-R 图
- 建立 Schema
- 少量模拟数据生成

## 11.26

- 郭：提供模拟数据来源
- 全部模拟数据生成
- `/user/login`
- `/user/info`

## 11.27

- 郭：API 设计（顾客）初版
- `/shops`
- `/shop/:id/dishes`
- `/customer/car` GET & ~~POST~~
- `/user/info` ~~POST~~ PUT
- +前端，调整为 monorepo

## 11.28
- `/order` POST
- `/orders`
- `/order/:id/dishes`
- `/shop/:id`
- `/user/register`
- 模拟数据加入 monorepo 包
- `/shop/dish` POST
- `/shop/dish/:id` PUT & DELETE
- 前端：框架

## 11.29
- 更新销量
- 补上忘记了的配送地址（缺少前端设置）
- 前端：商家菜单管理、购物车管理、下订单
- `/customer/car/:id/{insert, delete}` POST
- `/orders/free`

## 11.30
- `/user/password` POST
- `/user/phone` POST
- `/order/:id/next` POST
- 前端：订单信息、订单更新
- `/courier/health` POST；健康审查
