package config

import (
	"fmt"
	"strings"
	"sync"
	"time"

	_ "github.com/lib/pq"

	"github.com/fsnotify/fsnotify"
	"github.com/spf13/viper"
)

type Config struct {
	Environment string `mapstructure:"ENV"`
	DB          DatabaseConfig
	Server      ServerConfig
	Credentials Credentials
	Logging     LoggingConfig
}

type DatabaseConfig struct {
	Host            string        `mapstructure:"HOST"`
	Port            int           `mapstructure:"PORT"`
	User            string        `mapstructure:"USER"`
	Password        string        `mapstructure:"PASSWORD"`
	Name            string        `mapstructure:"NAME"`
	SSLMode         string        `mapstructure:"SSL_MODE"`
	MaxOpenConns    int           `mapstructure:"MAX_OPEN_CONNS"`
	MaxIdleConns    int           `mapstructure:"MAX_IDLE_CONNS"`
	ConnMaxLifetime time.Duration `mapstructure:"CONN_MAX_LIFETIME"`
}

type ServerConfig struct {
	Port         string        `mapstructure:"PORT"`
	ReadTimeout  time.Duration `mapstructure:"READ_TIMEOUT"`
	WriteTimeout time.Duration `mapstructure:"WRITE_TIMEOUT"`
	IdleTimeout  time.Duration `mapstructure:"IDLE_TIMEOUT"`
}

type LoggingConfig struct {
	Level  string `mapstructure:"LEVEL"`
	Format string `mapstructure:"FORMAT"`
}

type Credentials struct {
	OpenAIKey string `mapstructure:"OPENAI_KEY"`
	JWTSecret string `mapstructure:"JWT_SECRET"`
}

var (
	once     sync.Once
	instance *Config
)

func Load() (*Config, error) {
	var err error
	once.Do(func() {
		viper.SetConfigName("config")
		viper.SetConfigType("yaml")
		viper.AddConfigPath(".")
		viper.AddConfigPath("../")

		viper.AutomaticEnv()
		viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

		setDefaults()

		if err = viper.ReadInConfig(); err != nil {
			if _, ok := err.(viper.ConfigFileNotFoundError); ok {
				err = nil
			}
		}

		viper.WatchConfig()
		viper.OnConfigChange(func(e fsnotify.Event) {
			fmt.Println("Config file changed:", e.Name)
		})

		cfg := &Config{}
		if err = viper.Unmarshal(cfg); err != nil {
			return
		}

		if err = validateConfig(cfg); err != nil {
			return
		}

		if cfg.Environment == "prod" {
			cfg.DB.SSLMode = "require"
		} else {
			cfg.DB.SSLMode = "disable"
		}

		instance = cfg
	})

	return instance, err
}

func (db *DatabaseConfig) ConnectionString() string {
	return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		db.Host,
		db.Port,
		db.User,
		db.Password,
		db.Name,
		db.SSLMode,
	)
}

func setDefaults() {
	viper.SetDefault("ENVIRONMENT", "development")
	viper.SetDefault("SERVER.PORT", "8080")
	viper.SetDefault("SERVER.READ_TIMEOUT", "15s")
	viper.SetDefault("SERVER.WRITE_TIMEOUT", "15s")
	viper.SetDefault("SERVER.IDLE_TIMEOUT", "60s")
	viper.SetDefault("DB.MAX_OPEN_CONNS", 25)
	viper.SetDefault("DB.MAX_IDLE_CONNS", 25)
	viper.SetDefault("DB.CONN_MAX_LIFETIME", "5m")
	viper.SetDefault("LOGGING.LEVEL", "info")
	viper.SetDefault("LOGGING.FORMAT", "json")
}

func validateConfig(cfg *Config) error {
	required := []struct {
		value   interface{}
		envName string
	}{
		{cfg.Environment, "ENV"},
		{cfg.DB.Host, "DB_HOST"},
		{cfg.DB.Port, "DB_PORT"},
		{cfg.DB.User, "DB_USER"},
		{cfg.DB.Password, "DB_PASSWORD"},
		{cfg.DB.Name, "DB_NAME"},
		{cfg.Server.Port, "SERVER_PORT"},
	}

	for _, field := range required {
		switch v := field.value.(type) {
		case string:
			if v == "" {
				return fmt.Errorf("environment variable %s is required", field.envName)
			}
		case int:
			if v == 0 {
				return fmt.Errorf("environment variable %s is required", field.envName)
			}
		}
	}
	return nil
}
