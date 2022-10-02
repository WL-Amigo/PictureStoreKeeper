package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"picture-store-keeper-server/graph/generated"
	"picture-store-keeper-server/graph/model"
)

func (r *mutationResolver) MoveImages(ctx context.Context, input model.MoveImagesInput) (*model.MoveImagesResult, error) {
	succeededFileNames, failedFileNames := r.moveFileService.MoveFiles(input.AlbumID, input.SrcDirIndex, input.DestDirIndex, input.FileNames)

	return &model.MoveImagesResult{
		Succeeded: succeededFileNames,
		Failed:    failedFileNames,
	}, nil
}

func (r *mutationResolver) TrashImages(ctx context.Context, input model.TrashImagesInput) (*model.MoveImagesResult, error) {
	succeededFileNames, failedFileNames := r.moveFileService.MoveFilesToTrash(input.AlbumID, input.SrcDirIndex, input.FileNames)

	return &model.MoveImagesResult{
		Succeeded: succeededFileNames,
		Failed:    failedFileNames,
	}, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

type mutationResolver struct{ *Resolver }
