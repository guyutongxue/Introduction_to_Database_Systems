CREATE TABLE customer (
    cust_id SERIAL PRIMARY KEY,
    cust_name TEXT NOT NULL,
    id CHARACTER(18), -- 身份证号
    cust_birth DATE,
    cust_gender SMALLINT,
    cust_phone TEXT UNIQUE NOT NULL,
    cust_email TEXT,
    cust_account TEXT,
    cust_password TEXT NOT NULL
);

CREATE TABLE shop (
    shop_id SERIAL PRIMARY KEY,
    shop_name TEXT NOT NULL,
    shop_password TEXT NOT NULL,
    shop_location TEXT,
    shop_phone TEXT UNIQUE NOT NULL,
    delivery_range TEXT,
    business_status SMALLINT NOT NULL DEFAULT 1
);

CREATE TABLE courier (
    cour_id SERIAL PRIMARY KEY,
    cour_name TEXT NOT NULL,
    cour_password TEXT NOT NULL,
    cour_phone TEXT UNIQUE NOT NULL,
    cour_living TEXT, -- 家庭地址
    cour_onboarding_time DATE NOT NULL,
    cour_temperature REAL,
    cour_COVID DATE
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    cust_id INTEGER NOT NULL REFERENCES customer,
    shop_id INTEGER NOT NULL REFERENCES shop,
    cour_id INTEGER NOT NULL REFERENCES courier,
    order_begin_time TIMESTAMPTZ NOT NULL,
    order_state SMALLINT NOT NULL
);

CREATE TABLE dish (
    dish_id SERIAL PRIMARY KEY,
    shop_id INTEGER NOT NULL REFERENCES shop,
    dish_name TEXT NOT NULL,
    dish_value INTEGER NOT NULL,
    dish_score INTEGER,
    dish_sales INTEGER NOT NULL DEFAULT 0
);

-- 订单内所包含的菜品
CREATE TABLE contain (
    dish_id INTEGER REFERENCES dish,
    order_id INTEGER REFERENCES orders,
    contain_num INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (dish_id, order_id)
);

CREATE TABLE shopping_car (
    dish_id INTEGER REFERENCES dish,
    cust_id INTEGER REFERENCES customer,
    car_num INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (dish_id, cust_id)
);
