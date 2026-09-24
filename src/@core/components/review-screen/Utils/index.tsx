export const looksNumeric = (value: string) =>
  /\d/.test(value) && value.replace(/[^0-9]/g, '').length / value.length > 0.3