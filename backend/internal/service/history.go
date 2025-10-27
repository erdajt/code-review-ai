package service

import (
	"encoding/json"
	"net/http"

	"github.com/erdajt/code-review-ai/backend/internal/api/handlers"
	"github.com/erdajt/code-review-ai/backend/internal/middleware"
	"github.com/erdajt/code-review-ai/backend/internal/utils"
)

type HistoryService interface {
	GetConversations(w http.ResponseWriter, r *http.Request)
	GetMessages(w http.ResponseWriter, r *http.Request)
}

type HistoryServiceImpl struct {
	historyHandler *handlers.HistoryHandler
}

func NewHistoryService(historyHandler *handlers.HistoryHandler) HistoryService {
	return &HistoryServiceImpl{
		historyHandler: historyHandler,
	}
}

func (s *HistoryServiceImpl) GetConversations(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	conversations, err := s.historyHandler.GetUserConversations(userID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "failed to fetch conversations")
		return
	}

	utils.RespondJSON(w, http.StatusOK, conversations)
}

func (s *HistoryServiceImpl) GetMessages(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	var req struct {
		ConversationID string `json:"conversation_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if req.ConversationID == "" {
		utils.RespondError(w, http.StatusBadRequest, "conversation_id required")
		return
	}

	messages, err := s.historyHandler.GetConversationMessages(userID, req.ConversationID)
	if err != nil {
		utils.RespondError(w, http.StatusNotFound, "conversation not found")
		return
	}

	utils.RespondJSON(w, http.StatusOK, messages)
}


