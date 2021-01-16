package Model

type Album struct {
	Label            string     `json:"label"`
	DirEntries       []DirEntry `json:"directories"`
	WillBeDeletedDir string     `json:"will_be_deleted_dir"`
}

type AlbumInternal struct {
	MapFileNameToLabelWhenDeleted map[string]string `json:"file_name_to_label_when_deleted"`
}

type AlbumContainer struct {
	AlbumPublic   Album         `json:"album"`
	AlbumInternal AlbumInternal `json:"internal"`
}

func NewAlbum(label string) *AlbumContainer {
	return &AlbumContainer{
		AlbumPublic: Album{
			Label:            label,
			DirEntries:       []DirEntry{},
			WillBeDeletedDir: "",
		},
		AlbumInternal: AlbumInternal{
			MapFileNameToLabelWhenDeleted: map[string]string{},
		},
	}
}

func (a *AlbumContainer) DeepCopy() *AlbumContainer {
	ret := new(AlbumContainer)

	// public
	ret.AlbumPublic.Label = a.AlbumPublic.Label
	ret.AlbumPublic.DirEntries = make([]DirEntry, len(a.AlbumPublic.DirEntries))
	copy(ret.AlbumPublic.DirEntries, a.AlbumPublic.DirEntries)
	ret.AlbumPublic.WillBeDeletedDir = a.AlbumPublic.WillBeDeletedDir

	// internal
	ret.AlbumInternal.MapFileNameToLabelWhenDeleted = make(map[string]string)
	for k, v := range a.AlbumInternal.MapFileNameToLabelWhenDeleted {
		ret.AlbumInternal.MapFileNameToLabelWhenDeleted[k] = v
	}

	return ret
}
