-- normalized log
SELECT
  nick,
  name,
  type as chat_type,
  is_active as is_active,
  url
  --, journal.date -- TODO
FROM journal
  JOIN chats ON journal.chatid = chats.id
  LEFT JOIN users ON users.uid = chats.id;
