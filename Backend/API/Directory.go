package API

import (
	"github.com/labstack/echo"
	"github.com/labstack/gommon/log"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)
import "../Model"

type filelistResponce struct {
	FileList []string `json:"files"`
}

func AddDirectoryEndpoints(e *echo.Echo, albumManager *Model.AlbumManager) {
	directoryEndpoint := e.Group("/api/directory/:albumId")

	// `source`	endpoint
	sourceEndpoint := directoryEndpoint.Group("/source")

	// -- get all picture file-names in source directory
	sourceEndpoint.GET("/", func(ctx echo.Context) error {
		albumId := ctx.Param(albumIdParamName)
		album := albumManager.Get(albumId)
		if album == nil {
			return returnAlbumNotFoundResponce(ctx)
		}

		files, err := ioutil.ReadDir(album.SourceDirEntry.FullPath)
		if err != nil {
			log.Error(err)
			return ctx.String(http.StatusInternalServerError, "error occurred when reading directory")
		}

		return ctx.JSON(http.StatusOK, createFileListResponce(files))
	})

	// -- get picture in source directory
	sourceEndpoint.GET("/:fileName", func(ctx echo.Context) error {
		albumId := ctx.Param(albumIdParamName)
		album := albumManager.Get(albumId)
		if album == nil {
			return returnAlbumNotFoundResponce(ctx)
		}

		// TODO: sanitize `fileName` if necessary
		return ctx.File(filepath.Join(album.SourceDirEntry.FullPath, ctx.Param(fileNameParamName)))
	})

	// `arranged` endpoints
	arrangedEndpoint := directoryEndpoint.Group("/arranged/:destDirIdx")

	// -- get all picture file-names in selected destination directory
	arrangedEndpoint.GET("/", func(ctx echo.Context) error {
		albumId := ctx.Param(albumIdParamName)
		album := albumManager.Get(albumId)
		if album == nil {
			return returnAlbumNotFoundResponce(ctx)
		}

		destDirIndex, err := strconv.Atoi(ctx.Param(destDirIndexParamName))
		if err != nil || destDirIndex < 0 || destDirIndex >= len(album.ArrangedDirEntries) {
			return returnInvalidDestDirIndexReponce(ctx, ctx.Param(destDirIndexParamName))
		}

		files, err := ioutil.ReadDir(album.ArrangedDirEntries[destDirIndex].FullPath)
		if err != nil {
			log.Error(err)
			return ctx.String(http.StatusInternalServerError, "error occurred when reading directory")
		}

		return ctx.JSON(http.StatusOK, createFileListResponce(files))
	})

	// -- get picture in selected destination directory
	arrangedEndpoint.GET("/:fileName", func(ctx echo.Context) error {
		albumId := ctx.Param(albumIdParamName)
		album := albumManager.Get(albumId)
		if album == nil {
			return returnAlbumNotFoundResponce(ctx)
		}

		destDirIndex, err := strconv.Atoi(ctx.Param(destDirIndexParamName))
		if err != nil || destDirIndex < 0 || destDirIndex >= len(album.ArrangedDirEntries) {
			return returnInvalidDestDirIndexReponce(ctx, ctx.Param(destDirIndexParamName))
		}

		// TODO: sanitize `fileName` if necessary
		return ctx.File(filepath.Join(album.ArrangedDirEntries[destDirIndex].FullPath, ctx.Param(fileNameParamName)))
	})
}

func returnAlbumNotFoundResponce(ctx echo.Context) error {
	albumId := ctx.Param(albumIdParamName)
	return ctx.String(http.StatusNotFound, strings.Join([]string{
		"Album not found (album ID: ",
		albumId,
		")",
	}, ""))
}

func returnInvalidDestDirIndexReponce(ctx echo.Context, indexStr string) error {
	return ctx.String(http.StatusNotFound, strings.Join([]string{
		"Destination directory index is invalid or out of range (index: ",
		indexStr,
		")",
	}, ""))
}

func createFileListResponce(fileInfos []os.FileInfo) filelistResponce {
	ret := filelistResponce{[]string{}}
	for _, v := range fileInfos {
		if v.IsDir() {
			continue
		}
		ret.FileList = append(ret.FileList, v.Name())
	}
	return ret
}
