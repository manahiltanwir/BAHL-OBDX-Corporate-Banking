export const getToday = () => {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  return `${d.getFullYear()}-${month}-${day}`
}

export const toSelectDate = (date: string) => `${date.replace(/-/g, '')}000000`