package types

import "time"

type Message struct {
	MessageID      string    `json:"message_id"`
	ConversationID string    `json:"conversation_id"`
	Sender         string    `json:"sender"`
	Content        string    `json:"content"`
	SentAt         time.Time `json:"sent_at"`
}
