package Services

import (
	"bytes"
	"github.com/disintegration/imaging"
	_ "golang.org/x/image/webp"
	_ "image"
	"image/color"
	"os"
	"path/filepath"
)

const thumbnailPixels = 128

type ThumbnailsService struct {
	cacheDirName string
}

func CreateThumbnailsService(dbPath string) *ThumbnailsService {
	cacheDirName := filepath.Join(dbPath, "thumbs")

	if err := os.MkdirAll(cacheDirName, 0777); err != nil {
		panic("Failed to create thumbnail cache dir")
	}

	return &ThumbnailsService{
		cacheDirName: filepath.Join(dbPath, "thumbs"),
	}
}

func (s *ThumbnailsService) Close() {
	// no-op
}

func (s *ThumbnailsService) GetThumbnailFilePath(albumId string, filePathName string) (string, error) {
	thumbFileName := filepath.Join(s.cacheDirName, albumId + "-" + filepath.Base(filePathName) + ".jpg")

	// when cache hit
	if _, err := os.Stat(thumbFileName); err == nil {
		return thumbFileName, nil
	}

	// generate thumbnail and save as cache
	thumbBytes, err := generateThumbnail(filePathName)
	if err != nil {
		return "", err
	}
	if err = os.WriteFile(thumbFileName, thumbBytes, 0666); err != nil {
		return "", err
	}

	return thumbFileName, nil
}

func generateThumbnail(filepath string) ([]byte, error) {
	originalImg, err := imaging.Open(filepath)
	if err != nil {
		return nil, err
	}

	thumbImg := imaging.Fill(originalImg, thumbnailPixels, thumbnailPixels, imaging.Center, imaging.Lanczos)
	whiteBgImg := imaging.New(thumbnailPixels, thumbnailPixels, color.White)
	thumbImg = imaging.OverlayCenter(whiteBgImg, thumbImg, 1)

	thumbBuffer := new(bytes.Buffer)
	if err = imaging.Encode(thumbBuffer, thumbImg, imaging.JPEG, imaging.JPEGQuality(75)); err != nil {
		return nil, err
	}

	return thumbBuffer.Bytes(), nil
}
