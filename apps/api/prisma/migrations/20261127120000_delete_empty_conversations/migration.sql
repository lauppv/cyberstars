-- Clicking Message on a profile used to create the conversation before anything
-- was sent, so conversations nobody wrote in sat in both inboxes. A conversation
-- now starts with its first message; delete the empty ones. A deleted message
-- keeps its row, so a conversation whose messages were all deleted stays.
DELETE FROM "conversations" c
WHERE NOT EXISTS (SELECT 1 FROM "direct_messages" m WHERE m."conversation_id" = c."id");
