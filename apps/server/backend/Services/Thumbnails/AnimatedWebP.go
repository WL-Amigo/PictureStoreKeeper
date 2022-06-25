package Thumbnails

import (
	"bufio"
	"bytes"
	"os"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
)

var numOfFramesRegexp = regexp.MustCompile("^Number of frames: (\\d+)")

func IsAnimatedWebP(filename string) bool {
	if !strings.HasSuffix(filename, ".webp") {
		return false
	}

	output, err := exec.Command("webpinfo", "-quiet", "-summary", filename).Output()
	if err != nil {
		return false
	}

	byteReader := bytes.NewReader(output)
	bufReader := bufio.NewReader(byteReader)
	for {
		line, err := bufReader.ReadString('\n')
		if err != nil {
			return false
		}
		if strings.HasPrefix(line, "Number of frames:") {
			result := numOfFramesRegexp.FindStringSubmatch(line)
			if result == nil {
				continue
			}
			numOfFrames, err := strconv.Atoi(result[1])
			if err == nil && numOfFrames > 1 {
				return true
			}
		}
	}
}

func GenerateThumbnailFromAnimatedWebP(filepath string) ([]byte, error) {
	// extract first frame
	tempFilePath := strings.TrimSuffix(filepath, ".webp") + "-f1.webp"
	defer os.Remove(tempFilePath)

	_, err := exec.Command("webpmux", "-get", "frame", "0", filepath, "-o", tempFilePath).Output()
	if err != nil {
		return nil, err
	}

	return GenerateThumbnail(tempFilePath, &GenerateThumbnailOptions{
		WithAnimationWatermark: true,
	})
}
