package repository

import (
	"database/sql"
	"errors"

	"github.com/erdajt/code-review-ai/backend/config"
	"github.com/erdajt/code-review-ai/backend/config/types"
	"github.com/google/uuid"
)

type AuthRepository interface {
	CreateUser(username, passwordHash string) (*types.User, error)
	GetUserByUsername(username string) (*types.User, error)
	GetUserByID(userID string) (*types.User, error)
}

type AuthRepositoryImpl struct {
	cfg *config.Config
	db  *sql.DB
}

func NewAuthRepository(db *sql.DB, cfg *config.Config) AuthRepository {
	return &AuthRepositoryImpl{
		cfg: cfg,
		db:  db,
	}
}

func (r *AuthRepositoryImpl) CreateUser(username, passwordHash string) (*types.User, error) {
	userID := uuid.New().String()

	query := `INSERT INTO users (user_id, username, password_hash) VALUES ($1, $2, $3)`
	_, err := r.db.Exec(query, userID, username, passwordHash)
	if err != nil {
		return nil, err
	}

	return &types.User{
		UserID:       userID,
		Username:     username,
		PasswordHash: passwordHash,
	}, nil
}

func (r *AuthRepositoryImpl) GetUserByUsername(username string) (*types.User, error) {
	query := `SELECT user_id, username, password_hash FROM users WHERE username = $1`

	user := &types.User{}
	err := r.db.QueryRow(query, username).Scan(&user.UserID, &user.Username, &user.PasswordHash)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	return user, nil
}

func (r *AuthRepositoryImpl) GetUserByID(userID string) (*types.User, error) {
	query := `SELECT user_id, username, password_hash FROM users WHERE user_id = $1`

	user := &types.User{}
	err := r.db.QueryRow(query, userID).Scan(&user.UserID, &user.Username, &user.PasswordHash)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	return user, nil
}


