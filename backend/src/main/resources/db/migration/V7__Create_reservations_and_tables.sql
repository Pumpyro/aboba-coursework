CREATE TABLE customer_tables (
    id SERIAL PRIMARY KEY,
    capacity INT NOT NULL,
    status VARCHAR(20) DEFAULT 'available'
);

CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    number_of_people INT NOT NULL,
    time_start TIMESTAMP NOT NULL,
    time_end TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    table_id BIGINT NOT NULL,
    CONSTRAINT fk_table FOREIGN KEY (table_id) REFERENCES customer_tables (id)
);
