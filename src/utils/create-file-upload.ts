import makeStoredFilePath from "./make-stored-file-path";
import supabase from "./supabase";

/**
 * Creates an input element for uploading a single file.
*/
export async function createFileUpload (): Promise<{ file: Blob, extension: string } | void> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.display = "none";
    
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return resolve();
      const extension = file.name.split(".").pop()!;

      document.body.removeChild(input);
      resolve({ file, extension });
    };

    document.body.appendChild(input);
    input.click();
  });
}

export async function createFileUploadToSupabase (description: string): Promise<number | undefined> {
  const upload = await createFileUpload();
  if (!upload) return;

  const databaseUploadResponse = await supabase.from("files").insert({
    description,
    extension: upload.extension
  }).select().single();

  if (databaseUploadResponse.error) {
    console.error(databaseUploadResponse.error);
    return;
  }

  const fileID = databaseUploadResponse.data.id;
  const fileName = makeStoredFilePath({ extension: upload.extension, id: fileID });

  const uploadResponse = await supabase.storage.from("files").upload(fileName, upload.file);
  if (uploadResponse.error) {
    console.error(uploadResponse.error);
    return;
  }

  return fileID;
}
