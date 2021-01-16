package main

import (
	"./API"
	"./Model"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"os"
	"path/filepath"
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

	// initialize AlbumManager
	albumManager := Model.LoadAlbumManager(settings)

	// register all endpoints
	API.AddAlbumEndpoints(e, albumManager)
	API.AddDirectoryEndpoints(e, albumManager)
	API.AddMoveEndpoints(e, albumManager)

	// register static file serving endpoint
	ex, err := os.Executable()
	if err != nil {
		panic(err)
	}
	e.Static("/", filepath.Join(filepath.Dir(ex), "frontend-dist"))

	e.Logger.Fatal(e.Start(":1323"))
}
