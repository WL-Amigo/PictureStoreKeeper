package Thumbnails

import (
	"bytes"
	_ "embed"
	"image"
	"image/color"
	"picture-store-keeper-server/Assets"

	"github.com/disintegration/imaging"
)

const thumbnailPixels = 128

type GenerateThumbnailOptions struct {
	WithAnimationWatermark bool
}

func GenerateThumbnail(filepath string, options *GenerateThumbnailOptions) ([]byte, error) {
	originalImg, err := imaging.Open(filepath)
	if err != nil {
		return nil, err
	}

	thumbImg := imaging.Fill(originalImg, thumbnailPixels, thumbnailPixels, imaging.Center, imaging.Lanczos)
	whiteBgImg := imaging.New(thumbnailPixels, thumbnailPixels, color.White)
	thumbImg = imaging.OverlayCenter(whiteBgImg, thumbImg, 1)

	if options != nil && options.WithAnimationWatermark {
		watermarkImg, _, err := image.Decode(bytes.NewReader(Assets.PlayCircleIconPngBinary))
		if err != nil {
			return nil, err
		}
		thumbImg = imaging.OverlayCenter(thumbImg, watermarkImg, 0.5)
	}

	thumbBuffer := new(bytes.Buffer)
	if err = imaging.Encode(thumbBuffer, thumbImg, imaging.JPEG, imaging.JPEGQuality(75)); err != nil {
		return nil, err
	}

	return thumbBuffer.Bytes(), nil
}
