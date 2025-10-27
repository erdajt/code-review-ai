package types

type AuthResponse struct {
	Token  string `json:"token"`
	UserID string `json:"user_id"`
}

type ChatResponse struct {
	ConversationID string `json:"conversation_id"`
	MessageID      string `json:"message_id"`
	Reply          string `json:"reply"`
	Title          string `json:"title"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}
