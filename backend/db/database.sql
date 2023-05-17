DROP DATABASE IF EXISTS tiger;

CREATE DATABASE tiger;
\c tiger;
-- SET search_path TO public;
CREATE TABLE users (
    id SMALLSERIAL PRIMARY KEY NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "password" VARCHAR (250) NOT NULL,
    role_id SMALLINT NOT NULL -----1-admin 2-moderator, 3-supervisor
);

CREATE TABLE firms (
    id SMALLSERIAL PRIMARY KEY NOT NULL,
    code INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    logical_ref INTEGER NOT NULL,

    -- UNIQUE (code),
    UNIQUE(logical_ref)
);

CREATE TABLE user_firms (
    id SMALLSERIAL PRIMARY KEY NOT NULL,
    user_id SMALLINT NOT NULL,
    firm_id SMALLINT NOT NULL,

    CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT firm_id_fk FOREIGN KEY (firm_id) REFERENCES firms(id) ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE warehouses (
    id SMALLSERIAL PRIMARY KEY NOT NULL,
    code INTEGER NOT NULL,
    firm_id INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    logical_ref INTEGER NOT NULL,

    UNIQUE (logical_ref),
    CONSTRAINT firm_id_fk FOREIGN KEY (firm_id) REFERENCES firms(id) ON UPDATE CASCADE ON DELETE CASCADE 
);


CREATE TABLE measurements (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    measurement VARCHAR (150) NOT NULL,
    measure_code VARCHAR (10) NOT NULL,
    firm_id SMALLINT NOT NULL,
    unitsetref SMALLINT NOT NULL,
    linenr SMALLINT NOT NULL,
    
    CONSTRAINT firm_id_fk FOREIGN KEY (firm_id) REFERENCES firms(id) ON UPDATE CASCADE ON DELETE CASCADE 
);

CREATE TABLE currency(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    logical_ref INTEGER NOT NULL,
    "type" SMALLINT NOT NULL,
    firm_id INTEGER NOT NULL DEFAULT 1,
    code VARCHAR(15) NOT NULL,
    "name" VARCHAR NOT NULL
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY NOT NULL,
    "name" VARCHAR(500) NOT NULL,
    logical_ref INTEGER NOT NULL,
    lowlevelcode INTEGER NOT NULL,
    firm_id INTEGER NOT NULL,

    UNIQUE(logical_ref, firm_id),
    
    CONSTRAINT firm_id_fk FOREIGN KEY (firm_id) REFERENCES firms(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE items (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    logical_ref BIGINT NOT NULL,
    code VARCHAR (150) NOT NULL,
    "name" VARCHAR (250) NOT NULL,
    firm_id INTEGER NOT NULL,
    measurement_id INTEGER NOT NULL,
    price NUMERIC(7, 2) NOT NULL,
    currency SMALLINT NOT NULL,
    category_id INTEGER ,
    UNIQUE(firm_id, logical_ref),

    CONSTRAINT category_id_fk FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT measurement_id_fk FOREIGN KEY (measurement_id) REFERENCES measurements(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT firm_id_fk FOREIGN KEY (firm_id) REFERENCES firms(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE wh_items(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    product_id INTEGER ,
    wh_id INTEGER NOT NULL,
    stock INTEGER NOT NULL,

    UNIQUE (product_id, wh_id)
);

CREATE TABLE firm_periods (
    id SMALLSERIAL PRIMARY KEY NOT NULL,
    "start_date" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    end_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    firm_id SMALLINT NOT NULL,
    logical_ref SMALLINT NOT NULL,
    code INTEGER NOT NULL,

    CONSTRAINT firm_id_fk FOREIGN KEY (firm_id) REFERENCES firms(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE item_warehouse (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    item_id BIGINT NOT NULL,
    warehouse_id INTEGER NOT NULL,
    count INTEGER NOT NULL
);

CREATE TABLE clients (
    id SMALLSERIAL PRIMARY KEY NOT NULL,
    logical_ref INTEGER NOT NULL,
    phone_number VARCHAR(12) ,
    "address" VARCHAR(250),
    card_type SMALLINT NOT NULL,
    code VARCHAR (150) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    firm_id SMALLINT NOT NULL,
    position POINT 
);

CREATE TABLE sales_mans (
    id SMALLSERIAL PRIMARY KEY NOT NULL,
    logical_ref INTEGER NOT NULL,
    code VARCHAR(15) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "password" BIGINT DEFAULT floor(random()*10000) NOT NULL,
    spec_code VARCHAR(125)
);

CREATE TABLE sls_man_whs (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    sls_man_id SMALLINT NOT NULL,
    wh_id SMALLINT NOT NULL,

    UNIQUE(sls_man_id),

    CONSTRAINT sls_man_id_fk FOREIGN KEY (sls_man_id) REFERENCES sales_mans(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT wh_id_fk FOREIGN KEY (wh_id) REFERENCES warehouses(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE sls_man_firms (
    id SMALLSERIAL PRIMARY KEY NOT NULL,
    firm_id SMALLINT NOT NULL,
    sls_man_id SMALLINT NOT NULL,

    UNIQUE(sls_man_id)
);

CREATE TABLE sls_man_clients (
    id SERIAL PRIMARY KEY NOT NULL,
    sls_man_id SMALLINT NOT NULL,
    client_id SMALLINT NOT NULL,

    CONSTRAINT sls_man_id_fk FOREIGN KEY (sls_man_id) REFERENCES sales_mans(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT client_id_fk FOREIGN KEY (client_id) REFERENCES clients(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE user_sls_mans (
    id SMALLSERIAL PRIMARY KEY NOT NULL,
    user_id SMALLINT NOT NULL,
    sls_man_id SMALLINT NOT NULL,

    CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT sls_man_id_fk FOREIGN KEY (sls_man_id) REFERENCES sales_mans(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    client_id SMALLINT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    supervisor_observerd TIMESTAMP WITHOUT TIME ZONE,
    firm_id SMALLINT NOT NULL,
    supervisor_id SMALLINT ,
    sls_man_id SMALLINT NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 0, 
    delivered BOOLEAN DEFAULT FALSE,
    discount INTEGER,
    total INTEGER NOT NULL,
    -- 0 unactive, 1 mod. by supervisor, 3 rejected by moderator, 4 rejected by client after moderate,5 accepted_order  

    CONSTRAINT firm_id_fk FOREIGN KEY (firm_id) REFERENCES firms(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT sls_man_id_fk FOREIGN KEY (sls_man_id) REFERENCES sales_mans(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT client_id_fk FOREIGN KEY (client_id) REFERENCES clients(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TAbLE order_items (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    item_id INTEGER NOT NULL,
    order_id INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    count SMALLINT NOT NULL,
    supervisor_count SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT item_id_fk FOREIGN KEY (item_id) REFERENCES items(id) ON UPDATE CASCADE ON DELETE CASCADE
);


