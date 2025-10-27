package types

import "time"

type Conversation struct {
	ConversationID string    `json:"conversation_id"`
	UserID         string    `json:"user_id"`
	Title          string    `json:"title"`
	StartedAt      time.Time `json:"started_at"`
}
