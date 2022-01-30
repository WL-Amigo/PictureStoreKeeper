package main

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"picture-store-keeper-server/API"
	"picture-store-keeper-server/Model"
	"picture-store-keeper-server/Services"
	"syscall"
)

func main() {
	e := echo.New()

	// Get Settings
	settings := Model.LoadSettings()

	// Allow cross-origin access
	if settings.AllowCrossOriginAccess {
		e.Use(middleware.CORS())
	}

	// Enable logging
	if settings.EnableLogging {
		e.Use(middleware.Logger())
	}

	ex, err := os.Executable()
	if err != nil {
		panic(err)
	}

	// initialize services
	albumManager := Model.LoadAlbumManager(settings)
	thumbnailsService := Services.CreateThumbnailsService(filepath.Dir(ex))
	defer thumbnailsService.Close()

	// register all endpoints
	API.AddAlbumEndpoints(e, albumManager)
	API.AddDirectoryEndpoints(e, albumManager, thumbnailsService)
	API.AddMoveEndpoints(e, albumManager)

	// register static file serving endpoint
	e.Static("/", filepath.Join(filepath.Dir(ex), "frontend-dist"))

	go func() {
		if err := e.Start(":1323"); err != nil && err != http.ErrServerClosed {
			e.Logger.Fatal(err)
		}
	}()

	// wait for SIGTERM and shutdown gracefully
	quitCh := make(chan os.Signal, 1)
	signal.Notify(quitCh, syscall.SIGTERM, os.Interrupt)
	<-quitCh

	if err = e.Close(); err != nil {
		e.Logger.Error("Failed to close API server: " + err.Error())
	}
}
