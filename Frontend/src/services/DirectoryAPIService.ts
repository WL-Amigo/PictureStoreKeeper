

export class DirectoryAPIService {
    public constructor(
        private readonly m_host: string
    ) {}

    public async getAllFilesInSource(id: string) {
        let resp = await fetch((new URL(`/api/directory/${id}/source/`, this.m_host)).toString());
        if(!resp.ok) {
            throw "getAllFilesInSource: failed";
        }

        return (<Array<string>>(await resp.json())['files']);
    }

    public toSourceFileURL(id: string, fileName: string) {
        return (new URL(`/api/directory/${id}/source/${fileName}`, this.m_host)).toString()
    }
}