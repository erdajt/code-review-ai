package service

import (
	"github.com/erdajt/code-review-ai/backend/internal/api/handlers"
)

type ChatService interface {
}

type ChatServiceImpl struct {
	chatHandler *handlers.ChatHandler
}

func NewChatService(chatHandler *handlers.ChatHandler) ChatService {
	return &ChatServiceImpl{
		chatHandler: chatHandler,
	}
}
