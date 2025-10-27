package types

type User struct {
	UserID       string `json:"user_id"`
	Username     string `json:"username"`
	PasswordHash string `json:"-"`
}


