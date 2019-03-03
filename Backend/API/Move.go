package API

import (
	"github.com/labstack/echo"
	"github.com/labstack/gommon/log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
)
import "../Model"

type moveFilePayload struct {
	SourceDirIndex int    `json:"source_dir_index"`
	DestDirIndex   int    `json:"destination_dir_index"`
	FileName       string `json:"file_name"`
}

type deleteFilePayload struct {
	SourceDirIndex int `json:"source_dir_index"`
	FileName       string `json:"file_name"`
}

func AddMoveEndpoints(e *echo.Echo, albumManager *Model.AlbumManager) {
	moveEndpoint := e.Group("/api/move/:albumId")

	// move file from destination to source
	moveEndpoint.POST("", func(ctx echo.Context) error {
		// error checks
		payload := new(moveFilePayload)
		if err := ctx.Bind(payload); err != nil {
			return returnInvalidPayloadResponse(ctx)
		}

		album := albumManager.Get(ctx.Param(albumIdParamName))
		if album == nil {
			return returnAlbumNotFoundResponse(ctx)
		}

		albumPublic := &album.AlbumPublic
		sourceDirIndex := payload.SourceDirIndex
		destDirIndex := payload.DestDirIndex
		if sourceDirIndex < 0 || sourceDirIndex >= len(albumPublic.DirEntries) {
			return returnInvalidDirIndexResponse(ctx, strconv.Itoa(sourceDirIndex))
		}
		if destDirIndex < 0 || destDirIndex >= len(albumPublic.DirEntries) {
			return returnInvalidDirIndexResponse(ctx, strconv.Itoa(destDirIndex))
		}

		// move file from source directory to dest
		sourceFullPath := filepath.Join(albumPublic.DirEntries[sourceDirIndex].FullPath, payload.FileName)
		destFullPath := filepath.Join(albumPublic.DirEntries[destDirIndex].FullPath, payload.FileName)
		if err := os.Rename(sourceFullPath, destFullPath); err != nil {
			log.Error(err)
			return ctx.String(http.StatusInternalServerError, "error occurred when moving file")
		}
		return ctx.NoContent(http.StatusOK)
	})

	moveEndpoint.POST("/delete", func(ctx echo.Context) error {
		payload := new(deleteFilePayload)
		if err := ctx.Bind(payload); err != nil {
			return returnInvalidPayloadResponse(ctx)
		}

		albumId := ctx.Param(albumIdParamName)
		album := albumManager.Get(albumId)
		if album == nil {
			return returnAlbumNotFoundResponse(ctx)
		}

		albumPublic := &album.AlbumPublic
		sourceDirIndex := payload.SourceDirIndex
		if sourceDirIndex < 0 || sourceDirIndex >= len(albumPublic.DirEntries) {
			return returnInvalidDirIndexResponse(ctx, strconv.Itoa(sourceDirIndex))
		}

		// move file from source directory to directory for deleted
		sourceFullPath := filepath.Join(albumPublic.DirEntries[sourceDirIndex].FullPath, payload.FileName)
		destFullPath := filepath.Join(albumPublic.WillBeDeletedDir, payload.FileName)
		if err := os.Rename(sourceFullPath, destFullPath); err != nil {
			log.Error(err)
			return ctx.String(http.StatusInternalServerError, "error occurred when moving file")
		}

		// record source directory label for deleted file
		albumInternal := &album.AlbumInternal
		albumInternal.MapFileNameToLabelWhenDeleted[payload.FileName] = albumPublic.DirEntries[sourceDirIndex].Label
		albumManager.UpdateOrInsert(albumId, album)

		return ctx.NoContent(http.StatusOK)
	})
}

func returnInvalidPayloadResponse(ctx echo.Context) error {
	return ctx.String(http.StatusBadRequest, "invalid payload")
}
