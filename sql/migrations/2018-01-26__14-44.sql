BEGIN TRANSACTION;

-- rename in "journal" columns uid => chatid, event => url
ALTER TABLE journal
  RENAME TO journal_old;

CREATE TABLE journal (
  chatid INT,
  url    TEXT,
  UNIQUE (chatid, url)
);

INSERT INTO journal (chatid, url)
  SELECT
    uid,
    event
  FROM journal_old;

DROP TABLE journal_old;


-- rename in log    chat => chatid
ALTER TABLE log
  RENAME TO log_old;

CREATE TABLE log (
  date   TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  uid    INT                                 NOT NULL,
  chatid INT                                 NOT NULL,
  type   INT                                 NOT NULL
);

INSERT INTO log (date, uid, chatid, type)
  SELECT
    date,
    uid,
    chat,
    type
  FROM log_old;

DROP TABLE log_old;

COMMIT;
