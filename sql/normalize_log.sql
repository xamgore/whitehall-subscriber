-- normalized log
SELECT
  date,
  name,
  nick,
  CASE WHEN type = 0
    THEN '/stop'
  WHEN type = 1
    THEN '/start'
  WHEN type = 3
    THEN '/more'
  END AS cmd
FROM log
  JOIN users ON log.uid = users.uid
ORDER BY date
  DESC;
