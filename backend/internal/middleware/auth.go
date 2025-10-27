package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/erdajt/code-review-ai/backend/config"
	"github.com/erdajt/code-review-ai/backend/internal/utils"
)

type contextKey string

const UserIDKey contextKey = "user_id"

func AuthMiddleware(cfg *config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				utils.RespondError(w, http.StatusUnauthorized, "authorization header required")
				return
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				utils.RespondError(w, http.StatusUnauthorized, "invalid authorization header format")
				return
			}

			userID, err := utils.ValidateToken(parts[1], cfg.Credentials.JWTSecret)
			if err != nil {
				utils.RespondError(w, http.StatusUnauthorized, "invalid or expired token")
				return
			}

			ctx := context.WithValue(r.Context(), UserIDKey, userID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func GetUserID(ctx context.Context) string {
	userID, _ := ctx.Value(UserIDKey).(string)
	return userID
}


