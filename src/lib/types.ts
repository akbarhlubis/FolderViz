export interface FileData {
    name: string;
    value: number;
    type: "file";
}

export interface FolderData {
    name:string;
    children: (FileData | FolderData)[];
    type: "folder";
}