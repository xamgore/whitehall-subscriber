-- normalized log
SELECT
  date,
  name,
  nick,
  CASE
  WHEN log.type = 0
    THEN '/stop'
  WHEN log.type = 1
    THEN '/start'
  WHEN log.type = 3
    THEN '/more'
  ELSE log.type
  END AS cmd,
  chatid,
  chats.type
FROM log
  JOIN chats ON log.chatid = chatid
  JOIN users ON log.uid = users.uid
ORDER BY date
DESC;
