package utils_filter

import (
	"path"
	"strings"
)

var knownImageFileExtMap = map[string]bool{
	"png":  true,
	"jpg":  true,
	"jpeg": true,
	"webp": true,
	"gif":  true,
}

func IsKnownImageFiles(filePath string) bool {
	_, ok := knownImageFileExtMap[strings.ToLower(strings.TrimPrefix(path.Ext(filePath), "."))]

	return ok
}
