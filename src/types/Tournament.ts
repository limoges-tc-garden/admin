import type { OutputData } from '@editorjs/editorjs';

export type Tournament = {
  id: number,
  title: string,
  content: OutputData | null,
  draft: boolean,
  created_at: string,
  updated_at: string,
  banner_file_id: { id: number, extension: string, description: string } | null
};
