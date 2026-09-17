import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

export const downloadElementAsPdf = async (element: HTMLElement, filename: string): Promise<void> => {
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true
  })

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20

  const imgWidth = pageWidth - margin * 2
  const ratio = imgWidth / canvas.width 
  const usablePageHeightPx = (pageHeight - margin * 2) / ratio 

  const breakElements = Array.from(element.querySelectorAll('[data-avoid-break]')) as HTMLElement[]
  const elementRect = element.getBoundingClientRect()
  const scaleFactor = canvas.width / element.offsetWidth 

  const unsafeRanges = breakElements
    .map(el => {
      const rect = el.getBoundingClientRect()
      const top = (rect.top - elementRect.top) * scaleFactor
      const bottom = (rect.bottom - elementRect.top) * scaleFactor
      return { top, bottom }
    })
    .sort((a, b) => a.top - b.top)

  let currentPos = 0
  let firstPage = true

  while (currentPos < canvas.height) {
    let sliceEnd = Math.min(currentPos + usablePageHeightPx, canvas.height)

    const breaking = unsafeRanges.find(r => sliceEnd > r.top && sliceEnd < r.bottom)
    if (breaking && breaking.top > currentPos) {
      sliceEnd = breaking.top
    }

    const sliceHeightPx = Math.max(1, sliceEnd - currentPos)

    const sliceCanvas = document.createElement('canvas')
    sliceCanvas.width = canvas.width
    sliceCanvas.height = sliceHeightPx
    const ctx = sliceCanvas.getContext('2d')!
    ctx.drawImage(canvas, 0, currentPos, canvas.width, sliceHeightPx, 0, 0, canvas.width, sliceHeightPx)

    const sliceImgData = sliceCanvas.toDataURL('image/png')
    const sliceHeightPt = sliceHeightPx * ratio

    if (!firstPage) pdf.addPage()
    pdf.addImage(sliceImgData, 'PNG', margin, margin, imgWidth, sliceHeightPt)

    currentPos = sliceEnd
    firstPage = false
  }

  pdf.save(filename)
}