import {type  Database } from "~/utils/database.types"

export type Teacher = Database["public"]["Tables"]["teachers"]["Row"] & {
  avatar_file_id: null | {
    extension: string
    id: number
  }
}