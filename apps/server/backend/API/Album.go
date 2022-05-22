package API

import (
	"net/http"
	"path/filepath"
	"picture-store-keeper-server/Model"

	"github.com/labstack/echo/v4"
)

type createAlbumPayload struct {
	Label string `json:"label"`
}

type createAlbumResponse struct {
	ID string `json:"id"`
}

func AddAlbumEndpoints(e *echo.Echo, albumManager *Model.AlbumManager, rootDir string) {
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

		// 返却するパスから rootDir を抜き取る
		clientDirs := []Model.DirEntry{}
		for _, origDir := range ret.AlbumPublic.DirEntries {
			relPath, err := filepath.Rel(rootDir, origDir.FullPath)
			if err != nil {
				relPath = ""
			} else {
				relPath = "/" + relPath
			}
			clientDirs = append(clientDirs, Model.DirEntry{
				FullPath: relPath,
				Label:    origDir.Label,
			})
		}
		ret.AlbumPublic.DirEntries = clientDirs

		clientTrashDir, err := filepath.Rel(rootDir, ret.AlbumPublic.WillBeDeletedDir)
		if err != nil {
			clientTrashDir = ""
		} else {
			clientTrashDir = "/" + clientTrashDir
		}
		ret.AlbumPublic.WillBeDeletedDir = clientTrashDir

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
			return ctx.String(http.StatusNotFound, "album not found with id: "+id)
		}

		// 受け取ったパスを絶対パスに変換
		modelDirs := []Model.DirEntry{}
		for _, clientDir := range payload.DirEntries {
			if clientDir.FullPath == "" {
				continue
			}
			fullPath := filepath.Join(rootDir, clientDir.FullPath)
			modelDirs = append(modelDirs, Model.DirEntry{
				FullPath: fullPath,
				Label:    clientDir.Label,
			})
		}
		payload.DirEntries = modelDirs
		if payload.WillBeDeletedDir != "" {
			payload.WillBeDeletedDir = filepath.Join(rootDir, payload.WillBeDeletedDir)
		}

		album.AlbumPublic = *payload
		albumManager.UpdateOrInsert(id, album)

		return ctx.NoContent(http.StatusOK)
	})

	// TODO: delete album
}
