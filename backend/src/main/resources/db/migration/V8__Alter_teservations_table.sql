ALTER TABLE reservations
ADD COLUMN customer_phone VARCHAR(15);

UPDATE reservations
SET customer_phone = 'unknown';

ALTER TABLE reservations
ALTER COLUMN customer_phone SET NOT NULL;

ALTER TABLE reservations
ADD COLUMN user_id BIGINT;

ALTER TABLE reservations
ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
