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

func AddMoveEndpoints(e *echo.Echo, albumManager *Model.AlbumManager) {
	moveEndpoint := e.Group("/api/move/:albumId")

	// move file from destination to source
	moveEndpoint.POST("/", func(ctx echo.Context) error {
		// error checks
		payload := new(moveFilePayload)
		if err := ctx.Bind(payload); err != nil {
			return returnInvalidPayloadResponse(ctx)
		}

		album := albumManager.Get(ctx.Param(albumIdParamName))
		if album == nil {
			return returnAlbumNotFoundResponse(ctx)
		}

		sourceDirIndex := payload.SourceDirIndex
		destDirIndex := payload.DestDirIndex
		if sourceDirIndex < 0 || destDirIndex >= len(album.DirEntries) {
			return returnInvalidDirIndexResponse(ctx, strconv.Itoa(sourceDirIndex))
		}
		if destDirIndex < 0 || destDirIndex >= len(album.DirEntries) {
			return returnInvalidDirIndexResponse(ctx, strconv.Itoa(destDirIndex))
		}

		// move file arranged directory to source
		sourceFullPath := filepath.Join(album.DirEntries[sourceDirIndex].FullPath, payload.FileName)
		destFullPath := filepath.Join(album.DirEntries[destDirIndex].FullPath, payload.FileName)
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
