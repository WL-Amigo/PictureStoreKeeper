package Services

import (
	"errors"
	"os"
	"path/filepath"
	"strings"
)

type DirectoryService struct {
	rootDir string
}

func CreateDirectoryService(rootDir string) *DirectoryService {
	return &DirectoryService{
		rootDir: rootDir,
	}
}

func (s *DirectoryService) GetDirs(path string, includeHidden bool) ([]string, error) {
	lsTargetDir := filepath.Join(s.rootDir, path)

	if !strings.HasPrefix(lsTargetDir, s.rootDir) {
		return nil, errors.New("ディレクトリをさかのぼることはできません")
	}

	dirEntries, err := os.ReadDir(lsTargetDir)
	if err != nil {
		return nil, err
	}

	dirNames := []string{}
	for _, entry := range dirEntries {
		if !entry.Type().IsDir() {
			continue
		}
		if !includeHidden && strings.HasPrefix(entry.Name(), ".") {
			continue
		}
		dirNames = append(dirNames, entry.Name())
	}

	return dirNames, nil
}
