export function nickName(fullName: string): string {
    const matches = fullName.match(/\b(\w)/g); // ['J','S','O','N']
    return matches?.join('') ?? "NA";
}