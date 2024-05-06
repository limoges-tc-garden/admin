export default function timestampToReadable (timestamp: string): string {
  return new Date(timestamp).toLocaleString("fr-FR");
}