package api

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/erdajt/code-review-ai/backend/config"
	routes "github.com/erdajt/code-review-ai/backend/internal/api"
	"github.com/erdajt/code-review-ai/backend/internal/api/handlers"
	"github.com/erdajt/code-review-ai/backend/internal/repository"
	"github.com/erdajt/code-review-ai/backend/internal/service"
	_ "github.com/lib/pq"
)

func initDB(cfg *config.DatabaseConfig) (*sql.DB, error) {
	connStr := cfg.ConnectionString()

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// conn pool settings
	db.SetMaxOpenConns(cfg.MaxOpenConns)
	db.SetMaxIdleConns(cfg.MaxIdleConns)
	db.SetConnMaxLifetime(cfg.ConnMaxLifetime)

	// verify conn
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := db.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("database ping failed: %w", err)
	}

	return db, nil
}

func New() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load config:", err)
	}

	db, err := initDB(&cfg.DB)
	if err != nil {
		log.Fatal("Database initialization failed:", err)
	}
	defer func() {
		if err := db.Close(); err != nil {
			log.Printf("Error closing database connection: %v", err)
		}
	}()

	authRepo := repository.NewAuthRepository(db, cfg)
	authHandler := handlers.NewAuthHandler(cfg, authRepo)
	authService := service.NewAuthService(authHandler)

	chatRepo := repository.NewChatRepository(db, cfg)
	chatHandler := handlers.NewChatHandler(cfg, chatRepo)
	chatService := service.NewChatService(chatHandler)

	historyHandler := handlers.NewHistoryHandler(cfg, chatRepo)
	historyService := service.NewHistoryService(historyHandler)

	router := routes.NewRouter(cfg, authService, chatService, historyService)

	server := &http.Server{
		Addr:         ":" + cfg.Server.Port,
		Handler:      router,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
		IdleTimeout:  cfg.Server.IdleTimeout,
	}

	log.Printf("Starting server on %s", server.Addr)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal("Server failed:", err)
	}
}
