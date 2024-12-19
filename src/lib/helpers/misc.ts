import type { Book } from "$lib/types";

export function nickName(fullName: string): string {
    const matches = fullName.match(/\b(\w)/g); // ['J','S','O','N']
    return matches?.join('') ?? "NA";
}

export async function fetchBooks() {
    const res = await fetch("https://raw.githubusercontent.com/livingopensource/training/refs/heads/main/linux/books.json")
    if (!res.ok) {
      return [] as Book[] 
    }
    return await res.json() as Book[]
}