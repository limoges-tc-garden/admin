export default function makeStoredFilePath (storedFile: { extension: string, id: number }) {
  return `${storedFile.id.toString()}.${storedFile.extension}`;
}