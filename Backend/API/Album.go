package API

import (
	"../Model"
	"github.com/labstack/echo"
	"net/http"
)

type createAlbumPayload struct {
	Label string `json:"label"`
}

type createAlbumResponse struct {
	ID string `json:"id"`
}

func AddAlbumEndpoints(e *echo.Echo, albumManager *Model.AlbumManager) {
	albumEndpoint := e.Group("/api/album")

	// get all album list
	albumEndpoint.GET("/", func(ctx echo.Context) error {
		return ctx.JSON(http.StatusOK, albumManager.GetAllAlbumIdentifiers())
	})

	// create album
	albumEndpoint.POST("/", func(ctx echo.Context) error {
		payload := new(createAlbumPayload)
		if err := ctx.Bind(payload); err != nil {
			return returnInvalidPayloadResponse(ctx)
		}

		id := albumManager.Create(payload.Label)

		return ctx.JSON(http.StatusOK, createAlbumResponse{id})
	})

	// get album data
	albumEndpoint.GET("/:id", func(ctx echo.Context) error {
		ret := albumManager.Get(ctx.Param("id"))
		if ret == nil {
			return returnAlbumNotFoundResponse(ctx)
		}
		return ctx.JSON(http.StatusOK, ret.AlbumPublic)
	})

	// update album data
	albumEndpoint.POST("/:id", func(ctx echo.Context) error {
		payload := new(Model.Album)
		if err := ctx.Bind(payload); err != nil {
			return ctx.String(http.StatusBadRequest, "invalid payload")
		}

		id := ctx.Param("id")
		album := albumManager.Get(id)
		if album == nil {
			return ctx.String(http.StatusNotFound, "album not found with id: " + id)
		}
		album.AlbumPublic = *payload
		albumManager.UpdateOrInsert(id, album)

		return ctx.NoContent(http.StatusOK)
	})

	// TODO: delete album
}
