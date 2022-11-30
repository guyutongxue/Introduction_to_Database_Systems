# SQL 部分的作业

## 查询

### 1

```sql
SELECT cust_id, cust_name, COUNT(order_id) AS cnt
    FROM orders NATURAL JOIN customer
    WHERE order_begin_time > TIMESTAMPTZ '2021-01-01'
    GROUP BY cust_name, cust_id
    ORDER BY cnt DESC, cust_name ASC
    LIMIT 10
```

### 2

```sql
SELECT *
    FROM shop NATURAL JOIN (
    SELECT shop_id, COUNT(order_id) as times, SUM(order_value) as total
        FROM orders
        GROUP BY shop_id
        HAVING COUNT(order_id) >= ALL(SELECT COUNT(order_id)
            FROM orders
            GROUP BY shop_id
        )
    ) AS o
    ORDER BY total DESC
```

### 3

```sql
SELECT shop_id, COUNT(order_id)
    FROM orders
    WHERE order_begin_time >= (NOW() - '30 days'::INTERVAL)
    GROUP BY shop_id
    HAVING COUNT(order_id) < (
        1.0 *
        (SELECT COUNT(*) FROM orders WHERE order_begin_time >= (NOW() - '30 days'::INTERVAL)) / 
        (SELECT COUNT(DISTINCT shop_id) FROM orders WHERE order_begin_time >= (NOW() - '30 days'::INTERVAL))
    )
```

### 4

```sql
SELECT shop_name, cust_name, cust_address
    FROM shop NATURAL JOIN orders NATURAL JOIN customer
    WHERE cour_id IN (
        SELECT cour_id
            FROM courier
            WHERE cour_temperature > 37.1
    ) AND order_begin_time >= (NOW() - '14 days'::INTERVAL)
```

### 5

```sql
WITH dt AS (
    SELECT dish_id, SUM(dish_value * contain_num) as total
        FROM dish NATURAL JOIN contain NATURAL JOIN (
            SELECT order_id
            FROM orders
            WHERE order_begin_time >= (NOW() - '7 days'::INTERVAL)
        ) AS o
        GROUP BY dish_id
    )
SELECT dish_name
    FROM dish NATURAL JOIN dt
    WHERE total <= (SELECT MIN(total) FROM dt)
```

### 6

```sql
SELECT cust_name, cour_name
    FROM customer NATURAL JOIN (
        SELECT cust_id, cour_id, COUNT(cust_id)
            FROM orders
            WHERE order_begin_time >= (NOW() - '30 days'::INTERVAL)
                AND order_begin_time < (NOW() - '2 hours'::INTERVAL)
                AND order_state != 5
                AND order_state != 6
            GROUP BY cust_id, cour_id
            HAVING COUNT(cust_id) > 1
    ) AS o NATURAL JOIN courier
```

## 查询优化

实测表明这六种查询没有显著差异（均在 2 ~ 3 毫秒内完成），统计学上第 5 种查询可能耗时较长。优化：

```sql
CREATE INDEX order_time ON orders (order_begin_time)
```

## 触发器设计

```sql
CREATE TABLE risk_area (
    area TEXT PRIMARY KEY
);
CREATE FUNCTION risk_warn() RETURNS trigger AS $risk_warn$
    BEGIN
        UPDATE courier
            SET cour_covid = NULL
            WHERE cour_id IN (
                SELECT cour_id
                    FROM courier NATURAL JOIN orders NATURAL JOIN shop
                    WHERE cour_begin_time < (NOW() - '7 days'::INTERVAL)
                        AND (
                            order_destination = NEW.area
                            OR
                            shop_location = NEW.area
                        )
            );
        RETURN NEW;
    END;
$risk_warn$ LANGUAGE plpgsql;
CREATE TRIGGER risk_warn BEFORE INSERT ON risk_area
    FOR EACH ROW EXECUTE FUNCTION risk_warn();
```

## 用户权限管理

> 已同助教沟通，在服务器端实现用户权限管理。
