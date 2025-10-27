package handlers

import (
	"github.com/erdajt/code-review-ai/backend/config"
	"github.com/erdajt/code-review-ai/backend/internal/repository"
)

type ChatHandler struct {
	cfg      *config.Config
	chatRepo repository.ChatRepository
}

func NewChatHandler(cfg *config.Config, chatRepo repository.ChatRepository) *ChatHandler {
	return &ChatHandler{
		cfg:      cfg,
		chatRepo: chatRepo,
	}
}
