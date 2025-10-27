package types

type RegisterRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type ChatRequest struct {
	ConversationID string `json:"conversation_id,omitempty"`
	Message        string `json:"message"`
}
