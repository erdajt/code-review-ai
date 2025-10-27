package repository

import (
	"database/sql"
	"errors"

	"github.com/erdajt/code-review-ai/backend/config"
	"github.com/erdajt/code-review-ai/backend/config/types"
	"github.com/google/uuid"
)

type ChatRepository interface {
	CreateConversation(userID, title string) (*types.Conversation, error)
	GetConversation(conversationID, userID string) (*types.Conversation, error)
	GetUserConversations(userID string) ([]types.Conversation, error)
	SaveMessage(conversationID, sender, content string) (*types.Message, error)
	GetConversationMessages(conversationID string) ([]types.Message, error)
}

type ChatRepositoryImpl struct {
	cfg *config.Config
	db  *sql.DB
}

func NewChatRepository(db *sql.DB, cfg *config.Config) ChatRepository {
	return &ChatRepositoryImpl{
		cfg: cfg,
		db:  db,
	}
}

func (r *ChatRepositoryImpl) CreateConversation(userID, title string) (*types.Conversation, error) {
	conversationID := uuid.New().String()

	query := `INSERT INTO conversations (conversation_id, user_id, title) VALUES ($1, $2, $3) RETURNING started_at`

	conversation := &types.Conversation{
		ConversationID: conversationID,
		UserID:         userID,
		Title:          title,
	}

	err := r.db.QueryRow(query, conversationID, userID, title).Scan(&conversation.StartedAt)
	if err != nil {
		return nil, err
	}

	return conversation, nil
}

func (r *ChatRepositoryImpl) GetConversation(conversationID, userID string) (*types.Conversation, error) {
	query := `SELECT conversation_id, user_id, title, started_at FROM conversations WHERE conversation_id = $1`

	conversation := &types.Conversation{}
	err := r.db.QueryRow(query, conversationID).Scan(
		&conversation.ConversationID,
		&conversation.UserID,
		&conversation.Title,
		&conversation.StartedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("conversation not found")
		}
		return nil, err
	}

	if conversation.UserID != userID {
		return nil, errors.New("unauthorized access to conversation")
	}

	return conversation, nil
}

func (r *ChatRepositoryImpl) SaveMessage(conversationID, sender, content string) (*types.Message, error) {
	messageID := uuid.New().String()

	query := `INSERT INTO messages (message_id, conversation_id, sender, content) VALUES ($1, $2, $3, $4) RETURNING sent_at`

	message := &types.Message{
		MessageID:      messageID,
		ConversationID: conversationID,
		Sender:         sender,
		Content:        content,
	}

	err := r.db.QueryRow(query, messageID, conversationID, sender, content).Scan(&message.SentAt)
	if err != nil {
		return nil, err
	}

	return message, nil
}

func (r *ChatRepositoryImpl) GetConversationMessages(conversationID string) ([]types.Message, error) {
	query := `SELECT message_id, conversation_id, sender, content, sent_at FROM messages WHERE conversation_id = $1 ORDER BY sent_at ASC`

	rows, err := r.db.Query(query, conversationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	messages := []types.Message{}
	for rows.Next() {
		var msg types.Message
		err := rows.Scan(&msg.MessageID, &msg.ConversationID, &msg.Sender, &msg.Content, &msg.SentAt)
		if err != nil {
			return nil, err
		}
		messages = append(messages, msg)
	}

	return messages, nil
}

func (r *ChatRepositoryImpl) GetUserConversations(userID string) ([]types.Conversation, error) {
	query := `SELECT conversation_id, user_id, title, started_at FROM conversations WHERE user_id = $1 ORDER BY started_at DESC`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	conversations := []types.Conversation{}
	for rows.Next() {
		var conv types.Conversation
		err := rows.Scan(&conv.ConversationID, &conv.UserID, &conv.Title, &conv.StartedAt)
		if err != nil {
			return nil, err
		}
		conversations = append(conversations, conv)
	}

	return conversations, nil
}
