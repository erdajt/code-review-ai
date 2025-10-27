package handlers

import (
	"github.com/erdajt/code-review-ai/backend/config"
	"github.com/erdajt/code-review-ai/backend/config/types"
	"github.com/erdajt/code-review-ai/backend/internal/repository"
)

type HistoryHandler struct {
	cfg      *config.Config
	chatRepo repository.ChatRepository
}

func NewHistoryHandler(cfg *config.Config, chatRepo repository.ChatRepository) *HistoryHandler {
	return &HistoryHandler{
		cfg:      cfg,
		chatRepo: chatRepo,
	}
}

func (h *HistoryHandler) GetUserConversations(userID string) ([]types.Conversation, error) {
	return h.chatRepo.GetUserConversations(userID)
}

func (h *HistoryHandler) GetConversationMessages(userID, conversationID string) ([]types.Message, error) {
	_, err := h.chatRepo.GetConversation(conversationID, userID)
	if err != nil {
		return nil, err
	}

	return h.chatRepo.GetConversationMessages(conversationID)
}


