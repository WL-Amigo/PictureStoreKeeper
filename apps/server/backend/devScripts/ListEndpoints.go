package main

import (
	"encoding/json"
	"fmt"
	"github.com/labstack/echo/v4"
	"picture-store-keeper-server/API"
	"picture-store-keeper-server/Model"
)

func main() {
	e := echo.New()

	am := new(Model.AlbumManager)

	API.AddAlbumEndpoints(e, am)
	API.AddDirectoryEndpoints(e, am)
	API.AddMoveEndpoints(e, am)

	buf, _ := json.MarshalIndent(e.Routes(), "", "  ")
	fmt.Print(string(buf))
}
