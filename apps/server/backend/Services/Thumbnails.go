package Services

import (
	"bytes"
	_ "image"
	"image/color"
	"os"
	"path/filepath"
	"runtime"

	"github.com/disintegration/imaging"
	_ "golang.org/x/image/webp"
)

const thumbnailPixels = 128
const maxJobCount = 4

type ThumbnailsService struct {
	cacheDirName              string
	thumbnailMakerJobsChannel chan<- thumbnailJob
	heavyOpsCount             int
}

func CreateThumbnailsService(dbPath string) *ThumbnailsService {
	cacheDirName := filepath.Join(dbPath, "thumbs")

	if err := os.MkdirAll(cacheDirName, 0777); err != nil {
		panic("Failed to create thumbnail cache dir")
	}

	// create workers
	thumbnailMakerJobsChannel := make(chan thumbnailJob, maxJobCount)
	for w := 0; w < maxJobCount; w++ {
		go createThumbnailMakingWorker(thumbnailMakerJobsChannel)
	}

	return &ThumbnailsService{
		cacheDirName:              filepath.Join(dbPath, "thumbs"),
		thumbnailMakerJobsChannel: thumbnailMakerJobsChannel,
	}
}

func (s *ThumbnailsService) Close() {
	close(s.thumbnailMakerJobsChannel)
}

func (s *ThumbnailsService) GetThumbnailFilePath(albumId string, filePathName string) (string, error) {
	thumbFileName := filepath.Join(s.cacheDirName, albumId+"-"+filepath.Base(filePathName)+".jpg")

	// when cache hit
	if _, err := os.Stat(thumbFileName); err == nil {
		return thumbFileName, nil
	}

	// send job and wait for finish
	job := thumbnailJob{
		InputFilePath:  filePathName,
		OutputFilePath: thumbFileName,
		FinishReceiver: make(chan errorContainer),
	}
	s.thumbnailMakerJobsChannel <- job
	errContainer := <-job.FinishReceiver
	if errContainer.Error != nil {
		return "", errContainer.Error
	}

	s.executeGCIfNeeded()

	return thumbFileName, nil
}

const gcExecuteHeavyOpsCountThreshold = 8

func (s *ThumbnailsService) executeGCIfNeeded() {
	s.heavyOpsCount += 1
	if s.heavyOpsCount > gcExecuteHeavyOpsCountThreshold {
		s.heavyOpsCount -= gcExecuteHeavyOpsCountThreshold
		runtime.GC()
	}
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

type thumbnailJob struct {
	InputFilePath  string
	OutputFilePath string
	FinishReceiver chan errorContainer
}
type errorContainer struct {
	Error error
}

func createThumbnailMakingWorker(jobChannel <-chan thumbnailJob) {
	for job := range jobChannel {
		// generate thumbnail and save as cache
		thumbBytes, err := generateThumbnail(job.InputFilePath)
		if err != nil {
			job.FinishReceiver <- errorContainer{
				Error: err,
			}
			continue
		}
		if err = os.WriteFile(job.OutputFilePath, thumbBytes, 0666); err != nil {
			job.FinishReceiver <- errorContainer{
				Error: err,
			}
			continue
		}
		job.FinishReceiver <- errorContainer{
			Error: nil,
		}
	}
}
