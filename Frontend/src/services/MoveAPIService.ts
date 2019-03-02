

interface MoveFilePayload {
    source_dir_index: number,
    destination_dir_index: number,
    file_name: string
}

export class MoveAPIService {
    public constructor(
        private readonly m_host: string
    ){}

    public async movePictureAsync(albumID: string, fileName: string, sourceDirIndex: number, destDirIndex: number){
        let payload: MoveFilePayload = {
            source_dir_index: sourceDirIndex,
            destination_dir_index: destDirIndex,
            file_name: fileName
        };
        let resp = await fetch((new URL(`/api/move/${albumID}`, this.m_host)).toString(), {
            method: 'POST',
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(payload),
        });
        
        return resp.ok;
    }
}