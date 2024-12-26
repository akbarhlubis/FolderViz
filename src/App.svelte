<script lang="ts">
  import BubbleChart from "./lib/components/BubbleChart.svelte";
  import type { FileData, FolderData } from "./lib/types";

  let folderName = "Folder Visualizer";
  let folderData: FolderData | null = null;

  async function analyzeFolder() {
    try {
      // Meminta pengguna memilih folder
      const directoryHandle = await window.showDirectoryPicker(); // Experiment Feature
      folderName = directoryHandle.name;

      // Iterasi isi folder
      folderData = {
        name: directoryHandle.name,
        children: await getFolderContents(directoryHandle),
        type: "folder",
      };
    } catch (error) {
      console.error("Error reading folder:", error);
      folderData = null;
    }
  }

  async function getFolderContents(directoryHandle: FileSystemDirectoryHandle): Promise<(FileData | FolderData)[]> {
    const contents: (FileData | FolderData)[] = [];

    for await (const [name, handle] of directoryHandle.entries()) {
      if (handle.kind === "file") {
        const fileHandle = handle as FileSystemFileHandle;
        const file = await fileHandle.getFile();
        contents.push({
          name: file.name,
          value: file.size,
          type: "file",
        });
      } else if (handle.kind === "directory") {
        const directoryHandle = handle as FileSystemDirectoryHandle;
        contents.push({
          name: directoryHandle.name,
          children: await getFolderContents(directoryHandle),
          type: "folder",
        });
      }
    }

    return contents;
  }

  function clearData(){
    folderName = "Folder Visualizer";
    folderData = null;
  }
</script>

<main>
  {#if !folderData}
    <button on:click={analyzeFolder}>Select Folder</button>
  {:else}
    <button on:click={clearData}>Clear Data</button>
  {/if}

  <h1>{folderName}</h1>
  {#if folderData}
    <BubbleChart {folderData} />
  {/if}
</main>

<style>
  main {
    text-align: center;
    font-family: Arial, sans-serif;
  }
</style>
