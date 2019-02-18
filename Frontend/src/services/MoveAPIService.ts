

interface MoveFilePayload {
    arranged_dir_index: number,
    file_name: string
}

export class MoveAPIService {
    public constructor(
        private readonly m_host: string
    ){}

    public async movePictureToArrangedAsync(albumID: string, fileName: string, arrangedDirIndex: number){
        let payload: MoveFilePayload = {
            arranged_dir_index: arrangedDirIndex,
            file_name: fileName
        };
        let resp = await fetch((new URL(`/api/move/${albumID}/source`, this.m_host)).toString(), {
            method: 'POST',
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(payload),
        });
        
        return resp.ok;
    }
}