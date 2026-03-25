import { useRef } from "react"

export default function PDFExport({ goal, subtaskResults, verdict, disabled }) {
  const handleDownload = async () => {
    // Dynamic import to avoid bloating initial bundle
    const { default: jsPDF } = await import("jspdf")
    const { default: html2canvas } = await import("html2canvas")

    // Grab the result panel
    const el = document.getElementById("report-content")
    if (!el) return

    const canvas = await html2canvas(el, {
      backgroundColor: "#030712",
      scale: 1.5,
      useCORS: true,
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgHeight = (canvas.height * pageWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight)
      heightLeft -= pageHeight
    }

    const filename = `GoalMind-${Date.now()}.pdf`
    pdf.save(filename)
  }

  return (
    <button
      onClick={handleDownload}
      disabled={disabled}
      className="bg-white text-slate-900 hover:bg-slate-100 
                 disabled:opacity-40 disabled:cursor-not-allowed
                 px-5 py-2.5 rounded-xl font-semibold text-sm 
                 transition-colors flex items-center gap-2"
    >
      📄 Download Report
    </button>
  )
}