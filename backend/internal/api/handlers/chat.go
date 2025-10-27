package handlers

import (
	"context"
	"errors"

	"github.com/erdajt/code-review-ai/backend/config"
	"github.com/erdajt/code-review-ai/backend/config/types"
	"github.com/erdajt/code-review-ai/backend/internal/repository"
	openai "github.com/sashabaranov/go-openai"
)

type ChatHandler struct {
	cfg         *config.Config
	chatRepo    repository.ChatRepository
	openaiClient *openai.Client
}

func NewChatHandler(cfg *config.Config, chatRepo repository.ChatRepository) *ChatHandler {
	client := openai.NewClient(cfg.Credentials.OpenAIKey)
	return &ChatHandler{
		cfg:         cfg,
		chatRepo:    chatRepo,
		openaiClient: client,
	}
}

func (h *ChatHandler) ProcessChat(userID, conversationID, message string) (*types.ChatResponse, error) {
	if message == "" {
		return nil, &ValidationError{Message: "message cannot be empty"}
	}

	var conversation *types.Conversation
	var err error

	if conversationID == "" {
		conversation, err = h.chatRepo.CreateConversation(userID)
		if err != nil {
			return nil, err
		}
		conversationID = conversation.ConversationID
	} else {
		conversation, err = h.chatRepo.GetConversation(conversationID, userID)
		if err != nil {
			return nil, err
		}
	}

	userMessage, err := h.chatRepo.SaveMessage(conversationID, "user", message)
	if err != nil {
		return nil, err
	}

	messages, err := h.chatRepo.GetConversationMessages(conversationID)
	if err != nil {
		return nil, err
	}

	aiReply, err := h.callOpenAI(messages)
	if err != nil {
		return nil, err
	}

	_, err = h.chatRepo.SaveMessage(conversationID, "ai", aiReply)
	if err != nil {
		return nil, err
	}

	return &types.ChatResponse{
		ConversationID: conversationID,
		MessageID:      userMessage.MessageID,
		Reply:          aiReply,
	}, nil
}

func (h *ChatHandler) callOpenAI(messages []types.Message) (string, error) {
	systemPrompt := `You are an expert code reviewer assistant. Your purpose is to help developers review, analyze, and improve their code. 

You should:
- Provide constructive feedback on code quality, structure, and best practices
- Identify potential bugs, security vulnerabilities, and performance issues
- Suggest improvements and refactoring opportunities
- Explain complex code concepts clearly
- Follow industry standards and conventions

You should NOT:
- Assist with anything unrelated to code review or software development
- Generate malicious or harmful code
- Help with academic dishonesty

Be professional, concise, and helpful in all responses.`

	openaiMessages := []openai.ChatCompletionMessage{
		{
			Role:    openai.ChatMessageRoleSystem,
			Content: systemPrompt,
		},
	}

	for _, msg := range messages {
		role := openai.ChatMessageRoleUser
		if msg.Sender == "ai" {
			role = openai.ChatMessageRoleAssistant
		}
		openaiMessages = append(openaiMessages, openai.ChatCompletionMessage{
			Role:    role,
			Content: msg.Content,
		})
	}

	resp, err := h.openaiClient.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model:    openai.GPT4o,
			Messages: openaiMessages,
		},
	)

	if err != nil {
		return "", errors.New("failed to get AI response")
	}

	if len(resp.Choices) == 0 {
		return "", errors.New("no response from AI")
	}

	return resp.Choices[0].Message.Content, nil
}
