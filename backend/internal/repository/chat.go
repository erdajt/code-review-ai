package repository

import (
	"database/sql"

	"github.com/erdajt/code-review-ai/backend/config"
)

type ChatRepository interface {
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
