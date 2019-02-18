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
	ArrangedDirIndex int    `json:"arranged_dir_index"`
	FileName         string `json:"file_name"`
}

func AddMoveEndpoints(e *echo.Echo, albumManager *Model.AlbumManager) {
	moveEndpoint := e.Group("/api/move/:albumId")

	// move source to arranged directory
	moveEndpoint.POST("/source", func(ctx echo.Context) error {
		// error checks
		payload := new(moveFilePayload)
		if err := ctx.Bind(payload); err != nil {
			return returnInvalidPayloadResponse(ctx)
		}

		album := albumManager.Get(ctx.Param(albumIdParamName))
		if album == nil {
			return returnAlbumNotFoundResponce(ctx)
		}

		destDirIndex := payload.ArrangedDirIndex
		if destDirIndex < 0 || destDirIndex >= len(album.ArrangedDirEntries) {
			return returnInvalidDestDirIndexReponce(ctx, strconv.Itoa(destDirIndex))
		}

		// move file source to arranged directory
		sourceFullPath := filepath.Join(album.SourceDirEntry.FullPath, payload.FileName)
		destFullPath := filepath.Join(album.ArrangedDirEntries[destDirIndex].FullPath, payload.FileName)
		if err := os.Rename(sourceFullPath, destFullPath); err != nil {
			log.Error(err)
			return ctx.String(http.StatusInternalServerError, "error occurred when moving file")
		}
		return ctx.NoContent(http.StatusOK)
	})

	// move arranged directory to source
	moveEndpoint.POST("/arranged", func(ctx echo.Context) error {
		// error checks
		payload := new(moveFilePayload)
		if err := ctx.Bind(payload); err != nil {
			return returnInvalidPayloadResponse(ctx)
		}

		album := albumManager.Get(ctx.Param(albumIdParamName))
		if album == nil {
			return returnAlbumNotFoundResponce(ctx)
		}

		destDirIndex := payload.ArrangedDirIndex
		if destDirIndex < 0 || destDirIndex >= len(album.ArrangedDirEntries) {
			return returnInvalidDestDirIndexReponce(ctx, strconv.Itoa(destDirIndex))
		}

		// move file arranged directory to source
		sourceFullPath := filepath.Join(album.ArrangedDirEntries[destDirIndex].FullPath, payload.FileName)
		destFullPath := filepath.Join(album.SourceDirEntry.FullPath, payload.FileName)
		if err := os.Rename(sourceFullPath, destFullPath); err != nil {
			log.Error(err)
			return ctx.String(http.StatusInternalServerError, "error occurred when moving file")
		}
		return ctx.NoContent(http.StatusOK)
	})
}

func returnInvalidPayloadResponse(ctx echo.Context) error {
	return ctx.String(http.StatusBadRequest, "invalid payload")
}
