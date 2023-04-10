CREATE TABLE user (username VARCHAR(64), pass_hash VARCHAR(256), user_type VARCHAR(16), user_role VARCHAR(16));

INSERT INTO user VALUES ('John', '$2y$12$ytVdJQ7n3MDqCTtCIkZjwORyqYNM51WIpDUdL8mS0XlklTdIkObh6', 'test', 'test1');