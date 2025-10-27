package routes

import (
	"github.com/erdajt/code-review-ai/backend/config"
	apimiddleware "github.com/erdajt/code-review-ai/backend/internal/middleware"
	"github.com/erdajt/code-review-ai/backend/internal/service"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

var v1prefix = "/api/v1"

func NewRouter(
	cfg *config.Config,
	authService service.AuthService,
	chatService service.ChatService,
	historyService service.HistoryService,
) *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	r.Route(v1prefix, func(r chi.Router) {
		r.Post("/auth/register", authService.Register)
		r.Post("/auth/login", authService.Login)

		r.Group(func(r chi.Router) {
			r.Use(apimiddleware.AuthMiddleware(cfg))
			r.Post("/chat", chatService.SendMessage)
			r.Get("/conversations", historyService.GetConversations)
			r.Post("/messages", historyService.GetMessages)
		})
	})

	return r
}
