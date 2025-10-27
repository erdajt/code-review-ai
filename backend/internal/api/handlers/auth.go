package handlers

import (
	"github.com/erdajt/code-review-ai/backend/config"
	"github.com/erdajt/code-review-ai/backend/config/types"
	"github.com/erdajt/code-review-ai/backend/internal/repository"
	"github.com/erdajt/code-review-ai/backend/internal/utils"
)

type AuthHandler struct {
	cfg      *config.Config
	authRepo repository.AuthRepository
}

func NewAuthHandler(cfg *config.Config, authRepo repository.AuthRepository) *AuthHandler {
	return &AuthHandler{
		cfg:      cfg,
		authRepo: authRepo,
	}
}

func (h *AuthHandler) Register(username, password string) (*types.AuthResponse, error) {
	if username == "" || password == "" {
		return nil, &ValidationError{Message: "username and password required"}
	}

	if len(username) < 3 || len(username) > 50 {
		return nil, &ValidationError{Message: "username must be between 3 and 50 characters"}
	}

	if len(password) < 6 {
		return nil, &ValidationError{Message: "password must be at least 6 characters"}
	}

	existingUser, _ := h.authRepo.GetUserByUsername(username)
	if existingUser != nil {
		return nil, &ValidationError{Message: "username already exists"}
	}

	passwordHash, err := utils.HashPassword(password)
	if err != nil {
		return nil, err
	}

	user, err := h.authRepo.CreateUser(username, passwordHash)
	if err != nil {
		return nil, err
	}

	token, err := utils.GenerateToken(user.UserID, h.cfg.Credentials.JWTSecret)
	if err != nil {
		return nil, err
	}

	return &types.AuthResponse{
		Token:  token,
		UserID: user.UserID,
	}, nil
}

func (h *AuthHandler) Login(username, password string) (*types.AuthResponse, error) {
	if username == "" || password == "" {
		return nil, &ValidationError{Message: "username and password required"}
	}

	user, err := h.authRepo.GetUserByUsername(username)
	if err != nil {
		return nil, &ValidationError{Message: "invalid username or password"}
	}

	if !utils.CheckPasswordHash(password, user.PasswordHash) {
		return nil, &ValidationError{Message: "invalid username or password"}
	}

	token, err := utils.GenerateToken(user.UserID, h.cfg.Credentials.JWTSecret)
	if err != nil {
		return nil, err
	}

	return &types.AuthResponse{
		Token:  token,
		UserID: user.UserID,
	}, nil
}

type ValidationError struct {
	Message string
}

func (e *ValidationError) Error() string {
	return e.Message
}


