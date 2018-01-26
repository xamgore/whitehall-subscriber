BEGIN TRANSACTION;

-- remove from "users" the column "is_active"
ALTER TABLE users
  RENAME TO users_old;

CREATE TABLE users (
  uid  INT PRIMARY KEY,
  name TEXT,
  nick TEXT
);

CREATE TABLE chats (
  id          INT PRIMARY KEY,
  is_active   INT DEFAULT 1 NOT NULL,
  type        TEXT          NOT NULL,
  title       TEXT,
  description TEXT,
  invite_link TEXT
);

INSERT INTO users (uid, name, nick)
  SELECT
    uid,
    name,
    nick
  FROM users_old;

INSERT INTO chats (id, is_active, type)
  SELECT
    uid,
    is_active,
    'private'
  FROM users_old;

DROP TABLE users_old;

-- extend "log" with a column "chat"
ALTER TABLE log
  RENAME TO log_old;

CREATE TABLE log (
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  uid  INT                                 NOT NULL,
  chat INT                                 NOT NULL,
  type INT                                 NOT NULL
);

INSERT INTO log (date, uid, chat, type)
  SELECT
    date,
    uid,
    uid,
    type
  FROM log_old;

DROP TABLE log_old;

COMMIT;
ROLLBACK;