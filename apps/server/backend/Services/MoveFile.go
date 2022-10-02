package Services

import (
	"errors"
	"log"
	"os"
	"path/filepath"
	"picture-store-keeper-server/Model"
)

type MoveFileService struct {
	albumManager *Model.AlbumManager
}

func CreateMoveFileService(albumManager *Model.AlbumManager) *MoveFileService {
	return &MoveFileService{
		albumManager: albumManager,
	}
}

func (mf *MoveFileService) MoveFile(albumId string, srcDirIdx int, destDirIdx int, fileName string) error {
	srcPrefix, destPrefix, err := mf.getMoveSourceAndDestination(albumId, srcDirIdx, destDirIdx)
	if err != nil {
		return err
	}

	return moveFileFromDirToDir(srcPrefix, destPrefix, fileName)
}

func (mf *MoveFileService) getMoveSourceAndDestination(albumId string, srcDirIdx int, destDirIdx int) (string, string, error) {
	album := mf.albumManager.Get(albumId)
	if album == nil {
		return "", "", errors.New("Album " + albumId + " not found")
	}

	if srcDirIdx < 0 || srcDirIdx >= len(album.AlbumPublic.DirEntries) {
		return "", "", errors.New("srcDirIdx out of range")
	}
	if destDirIdx < 0 || destDirIdx >= len(album.AlbumPublic.DirEntries) {
		return "", "", errors.New("destDirIdx out of range")
	}

	return album.AlbumPublic.DirEntries[srcDirIdx].FullPath, album.AlbumPublic.DirEntries[destDirIdx].FullPath, nil
}

func moveFileFromDirToDir(srcPrefix string, destPrefix string, fileName string) error {
	sourceFullPath := filepath.Join(srcPrefix, fileName)
	destFullPath := filepath.Join(destPrefix, fileName)
	if err := os.Rename(sourceFullPath, destFullPath); err != nil {
		log.Println(err.Error())
		return errors.New(fileName + "rename failed")
	}

	return nil
}

func (mf *MoveFileService) MoveFiles(albumId string, srcDirIdx int, destDirIdx int, fileNames []string) ([]string, []string) {
	srcPrefix, destPrefix, err := mf.getMoveSourceAndDestination(albumId, srcDirIdx, destDirIdx)
	if err != nil {
		return []string{}, fileNames
	}

	succeededFileNames := []string{}
	failedFileNames := []string{}

	for _, fileName := range fileNames {
		if err = moveFileFromDirToDir(srcPrefix, destPrefix, fileName); err != nil {
			failedFileNames = append(failedFileNames, fileName)
		} else {
			succeededFileNames = append(succeededFileNames, fileName)
		}
	}

	return succeededFileNames, failedFileNames
}

func (mf *MoveFileService) getMoveSourceAndTrash(albumId string, srcDirIdx int) (string, string, error) {
	album := mf.albumManager.Get(albumId)
	if album == nil {
		return "", "", errors.New("Album " + albumId + " not found")
	}

	if srcDirIdx < 0 || srcDirIdx >= len(album.AlbumPublic.DirEntries) {
		return "", "", errors.New("srcDirIdx out of range")
	}

	return album.AlbumPublic.DirEntries[srcDirIdx].FullPath, album.AlbumPublic.WillBeDeletedDir, nil
}

func (mf *MoveFileService) MoveFilesToTrash(albumId string, srcDirIdx int, fileNames []string) ([]string, []string) {
	srcPrefix, trashPrefix, err := mf.getMoveSourceAndTrash(albumId, srcDirIdx)
	if err != nil {
		return []string{}, fileNames
	}

	succeededFileNames := []string{}
	failedFileNames := []string{}

	for _, fileName := range fileNames {
		if err = moveFileFromDirToDir(srcPrefix, trashPrefix, fileName); err != nil {
			failedFileNames = append(failedFileNames, fileName)
		} else {
			succeededFileNames = append(succeededFileNames, fileName)
		}
	}

	return succeededFileNames, failedFileNames
}
