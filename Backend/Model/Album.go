package Model

type Album struct {
	Label      string     `json:"label"`
	DirEntries []DirEntry `json:"directories"`
}

func NewAlbum(label string) *Album {
	return &Album{
		Label:      label,
		DirEntries: []DirEntry{},
	}
}

func (a *Album) DeepCopy() *Album {
	ret := new(Album)

	ret.Label = a.Label
	ret.DirEntries = make([]DirEntry, len(a.DirEntries))
	copy(ret.DirEntries, a.DirEntries)

	return ret
}
