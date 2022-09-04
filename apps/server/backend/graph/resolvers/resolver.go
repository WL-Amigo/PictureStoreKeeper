package resolvers

import "picture-store-keeper-server/Services"

//go:generate go run github.com/99designs/gqlgen generate

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	directoryService *Services.DirectoryService
	moveFileService  *Services.MoveFileService
}

func CreateResolver(
	directoryService *Services.DirectoryService,
	moveFileService *Services.MoveFileService,
) *Resolver {
	return &Resolver{
		directoryService,
		moveFileService,
	}
}
