package service

import (
	"encoding/json"
	"net/http"

	"github.com/erdajt/code-review-ai/backend/config/types"
	"github.com/erdajt/code-review-ai/backend/internal/api/handlers"
	"github.com/erdajt/code-review-ai/backend/internal/utils"
)

type AuthService interface {
	Register(w http.ResponseWriter, r *http.Request)
	Login(w http.ResponseWriter, r *http.Request)
}

type AuthServiceImpl struct {
	authHandler *handlers.AuthHandler
}

func NewAuthService(authHandler *handlers.AuthHandler) AuthService {
	return &AuthServiceImpl{
		authHandler: authHandler,
	}
}

func (s *AuthServiceImpl) Register(w http.ResponseWriter, r *http.Request) {
	var req types.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	resp, err := s.authHandler.Register(req.Username, req.Password)
	if err != nil {
		if _, ok := err.(*handlers.ValidationError); ok {
			utils.RespondError(w, http.StatusBadRequest, err.Error())
			return
		}
		utils.RespondError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	utils.RespondJSON(w, http.StatusCreated, resp)
}

func (s *AuthServiceImpl) Login(w http.ResponseWriter, r *http.Request) {
	var req types.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	resp, err := s.authHandler.Login(req.Username, req.Password)
	if err != nil {
		if _, ok := err.(*handlers.ValidationError); ok {
			utils.RespondError(w, http.StatusUnauthorized, err.Error())
			return
		}
		utils.RespondError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	utils.RespondJSON(w, http.StatusOK, resp)
}


