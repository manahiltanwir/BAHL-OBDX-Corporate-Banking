export const textOverflow = (string: string, maxLength: number) => {
  return `${string?.slice(0, maxLength)}${string?.length > maxLength ? '...' : ''}`
}
