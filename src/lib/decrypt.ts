function rot13(s: string): string {
  return s.replace(/[a-zA-Z]/g, c => {
    const base = c <= 'Z' ? 65 : 97
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base)
  })
}

export function decodeText(text: string, method: number): string {
  return method === 2 ? rot13(text) : atob(text)
}
