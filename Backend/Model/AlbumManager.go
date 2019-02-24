package Model

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"sort"
	"strconv"
)

const albumDataPathEnvKey = "PSK_ALBUM_DATA_PATH"

type AlbumManager struct {
	Albums  map[string]*Album `json:"albumMap"`
	Counter uint64            `json:"_identifierCount"`
}

type IDAlbumPair struct {
	ID    string `json:"id"`
	Album *Album `json:"album"`
}

func LoadAlbumManager() *AlbumManager {
	// アルバムデータは、環境変数 `PSK_ALBUM_DATA_PATH` があればそこから、無ければ実行ディレクトリの "albums.json" を読み込む
	albumDataPath := getAlbumDataPath()

	// アルバムのデータがあればそこから生成、無ければ空の AlbumManager を生成
	ret := new(AlbumManager)
	if _, err := os.Stat(albumDataPath); err == nil {
		data, _ := ioutil.ReadFile(albumDataPath)
		_ = json.Unmarshal(data, ret)
	} else {
		ret.Counter = 0
		ret.Albums = make(map[string]*Album, 0)
	}
	return ret
}

func (m *AlbumManager) persistent() {
	// アルバムデータは、環境変数 `PSK_ALBUM_DATA_PATH` があればそこから、無ければ実行ディレクトリの "albums.json" を読み込む
	albumDataPath := getAlbumDataPath()

	// アルバムデータを上書き保存する
	data, _ := json.Marshal(m)
	_ = ioutil.WriteFile(albumDataPath, data, 0664)
}

func (m *AlbumManager) Create(label string) string {
	albumPtr := NewAlbum(label)

	id := m.drawAlbumID()
	m.Albums[id] = albumPtr

	m.persistent()

	return id
}

func (m *AlbumManager) Get(id string) *Album {
	ret, ok := m.Albums[id]
	if !ok {
		// TODO: ログを吐く
		return nil
	}
	return ret
}

func (m *AlbumManager) GetAllAlbums() []IDAlbumPair {
	ret := make([]IDAlbumPair, 0)
	for key, value := range m.Albums {
		ret = append(ret, IDAlbumPair{key, value})
	}
	sort.Slice(ret, func(i, j int) bool { return ret[i].ID < ret[j].ID })
	return ret
}

func (m *AlbumManager) UpdateOrInsert(id string, album *Album) {
	m.Albums[id] = album.DeepCopy()
	m.persistent()
}

func getAlbumDataPath() string {
	ret := os.Getenv(albumDataPathEnvKey)
	if len(ret) == 0 {
		return "./album.json"
	}
	return ret
}

func (m *AlbumManager) drawAlbumID() string {
	ret := strconv.FormatUint(m.Counter, 10)
	m.Counter++
	return ret
}