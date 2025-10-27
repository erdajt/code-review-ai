package service

import (
	"encoding/json"
	"net/http"

	"github.com/erdajt/code-review-ai/backend/config/types"
	"github.com/erdajt/code-review-ai/backend/internal/api/handlers"
	"github.com/erdajt/code-review-ai/backend/internal/middleware"
	"github.com/erdajt/code-review-ai/backend/internal/utils"
)

type ChatService interface {
	SendMessage(w http.ResponseWriter, r *http.Request)
}

type ChatServiceImpl struct {
	chatHandler *handlers.ChatHandler
}

func NewChatService(chatHandler *handlers.ChatHandler) ChatService {
	return &ChatServiceImpl{
		chatHandler: chatHandler,
	}
}

func (s *ChatServiceImpl) SendMessage(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	var req types.ChatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	resp, err := s.chatHandler.ProcessChat(userID, req.ConversationID, req.Message)
	if err != nil {
		if _, ok := err.(*handlers.ValidationError); ok {
			utils.RespondError(w, http.StatusBadRequest, err.Error())
			return
		}
		utils.RespondError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	utils.RespondJSON(w, http.StatusOK, resp)
}
