package Model

type Album struct {
	Label              string     `json:"label"`
	SourceDirEntry     DirEntry   `json:"source"`
	ArrangedDirEntries []DirEntry `json:"arranged"`
}

func NewAlbum(label string) *Album {
	return &Album{
		Label: label,
		SourceDirEntry: DirEntry{
			Label:    "",
			FullPath: "",
		},
		ArrangedDirEntries: []DirEntry{},
	}
}

func (a *Album) DeepCopy() *Album {
	ret := new(Album)

	ret.Label = a.Label
	ret.SourceDirEntry = a.SourceDirEntry
	ret.ArrangedDirEntries = make([]DirEntry, len(a.ArrangedDirEntries))
	copy(ret.ArrangedDirEntries, a.ArrangedDirEntries)

	return ret
}
