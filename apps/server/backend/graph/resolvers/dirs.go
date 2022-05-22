package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"picture-store-keeper-server/graph/generated"
)

func (r *queryResolver) Dirs(ctx context.Context, root string, includeHidden *bool) ([]string, error) {
	localIncludeHidden := includeHidden != nil && *includeHidden
	return r.directoryService.GetDirs(root, localIncludeHidden)
}

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type queryResolver struct{ *Resolver }
