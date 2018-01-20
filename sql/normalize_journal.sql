-- normalized log
SELECT
  nick, name, event, date, is_active
FROM journal
  JOIN users ON journal.uid = users.uid
ORDER BY date
  DESC;
