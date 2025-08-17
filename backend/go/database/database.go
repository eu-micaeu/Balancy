package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

func NewDB() (*sql.DB, error) {

	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	if dbUser == "" || dbPassword == "" || dbHost == "" || dbPort == "" || dbName == "" {

		return nil, fmt.Errorf("uma ou mais variáveis de ambiente não estão definidas")

	}

	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", dbUser, dbPassword, dbHost, dbPort, dbName)

	db, err := sql.Open("postgres", dsn)

	if err != nil {
		return nil, fmt.Errorf("erro ao conectar ao banco de dados: %v", err)
	}

	// Retry pinging the database a few times to wait for Postgres to finish starting.
	var pingErr error
	maxAttempts := 12
	for i := 1; i <= maxAttempts; i++ {
		pingErr = db.Ping()
		if pingErr == nil {
			log.Println("Conectado ao banco de dados com sucesso!")
			return db, nil
		}
		log.Printf("Tentativa %d/%d: banco de dados não disponível: %v. Aguardando 2s...", i, maxAttempts, pingErr)
		time.Sleep(2 * time.Second)
	}

	return nil, fmt.Errorf("não foi possível alcançar o banco de dados após %d tentativas: %v", maxAttempts, pingErr)

}
