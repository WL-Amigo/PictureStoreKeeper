package API

import (
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"picture-store-keeper-server/Model"
	"picture-store-keeper-server/Services"
	"strconv"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
)

type fileListResponse struct {
	FileList []string `json:"files"`
}

func AddDirectoryEndpoints(e *echo.Echo, albumManager *Model.AlbumManager, thumbnailsService *Services.ThumbnailsService) {
	directoryEndpoint := e.Group("/api/directory/:albumId/:destDirIdx")

	// -- get all picture file-names in selected directory
	directoryEndpoint.GET("", func(ctx echo.Context) error {
		albumId := ctx.Param(albumIdParamName)
		album := albumManager.Get(albumId)
		if album == nil {
			return returnAlbumNotFoundResponse(ctx)
		}

		albumPublic := &album.AlbumPublic
		destDirIndex, err := strconv.Atoi(ctx.Param(destDirIndexParamName))
		if err != nil || destDirIndex < 0 || destDirIndex >= len(albumPublic.DirEntries) {
			return returnInvalidDirIndexResponse(ctx, ctx.Param(destDirIndexParamName))
		}

		files, err := ioutil.ReadDir(albumPublic.DirEntries[destDirIndex].FullPath)
		if err != nil {
			log.Error(err)
			return ctx.String(http.StatusInternalServerError, "error occurred when reading directory")
		}

		return ctx.JSON(http.StatusOK, createFileListResponse(files))
	})

	// -- get picture in selected destination directory
	directoryEndpoint.GET("/:fileName", func(ctx echo.Context) error {
		albumId := ctx.Param(albumIdParamName)
		album := albumManager.Get(albumId)
		if album == nil {
			return returnAlbumNotFoundResponse(ctx)
		}

		albumPublic := &album.AlbumPublic
		destDirIndex, err := strconv.Atoi(ctx.Param(destDirIndexParamName))
		if err != nil || destDirIndex < 0 || destDirIndex >= len(albumPublic.DirEntries) {
			return returnInvalidDirIndexResponse(ctx, ctx.Param(destDirIndexParamName))
		}

		// TODO: sanitize `fileName` if necessary
		fileNameUnescaped, err := url.QueryUnescape(ctx.Param(fileNameParamName))
		if err != nil {
			log.Error(err)
			return ctx.String(http.StatusInternalServerError, "Failed to unescape filename")
		}
		return ctx.File(filepath.Join(albumPublic.DirEntries[destDirIndex].FullPath, fileNameUnescaped))
	})

	// -- get thumbnail for specified picture file
	directoryEndpoint.GET("/:fileName/thumbnail", func(ctx echo.Context) error {
		albumId := ctx.Param(albumIdParamName)
		album := albumManager.Get(albumId)
		if album == nil {
			return returnAlbumNotFoundResponse(ctx)
		}

		albumPublic := &album.AlbumPublic
		destDirIndex, err := strconv.Atoi(ctx.Param(destDirIndexParamName))
		if err != nil || destDirIndex < 0 || destDirIndex >= len(albumPublic.DirEntries) {
			return returnInvalidDirIndexResponse(ctx, ctx.Param(destDirIndexParamName))
		}

		fileNameUnescaped, err := url.QueryUnescape(ctx.Param(fileNameParamName))
		if err != nil {
			log.Error(err)
			return ctx.String(http.StatusInternalServerError, "Failed to unescape filename")
		}
		thumbnailFileName, err := thumbnailsService.GetThumbnailFilePath(albumId, filepath.Join(albumPublic.DirEntries[destDirIndex].FullPath, fileNameUnescaped))
		if err != nil {
			log.Error(err)
			return ctx.String(http.StatusInternalServerError, "Failed to get thumbnail")
		}

		return ctx.File(thumbnailFileName)
	})
}

func returnAlbumNotFoundResponse(ctx echo.Context) error {
	albumId := ctx.Param(albumIdParamName)
	return ctx.String(http.StatusNotFound, strings.Join([]string{
		"Album not found (album ID: ",
		albumId,
		")",
	}, ""))
}

func returnInvalidDirIndexResponse(ctx echo.Context, indexStr string) error {
	return ctx.String(http.StatusNotFound, strings.Join([]string{
		"Directory index is invalid or out of range (index: ",
		indexStr,
		")",
	}, ""))
}

func createFileListResponse(fileInfos []os.FileInfo) fileListResponse {
	ret := fileListResponse{[]string{}}
	for _, v := range fileInfos {
		if v.IsDir() {
			continue
		}
		ret.FileList = append(ret.FileList, v.Name())
	}
	return ret
}
