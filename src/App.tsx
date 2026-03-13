import { useState, useEffect } from "react"
import type { ChangeEvent } from "react"
import { sendEmail } from "./services/email"
import "./App.css"

type Notification = { message: string; type: "success" | "error" } | null

export default function App() {
  const [senderName, setSenderName] = useState(
    import.meta.env.VITE_DEFAULT_SENDER_NAME || "Marifer Alcon"
  )
  const [email, setEmail] = useState(
    import.meta.env.VITE_DEFAULT_RECIPIENT || "it@payloro.com"
  )
  const [cc, setCc] = useState("hr@payloro.com, rosalindo@payloro.com")
  const [bcc, setBcc] = useState("cleo@payloro.com")

  const formatEODDate = () => {
    const date = new Date()
    const datePart = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const dayPart = date.toLocaleDateString("en-US", {
      weekday: "short",
    })
    return `${datePart}) ${dayPart}`
  }
  const [subject, setSubject] = useState(
    `EOD Report - Marifer Alcon (${formatEODDate()}`
  )
  const today = new Date()
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  })

  const [message, setMessage] = useState(
    `Hello, I’ve attached the Excel file for my EOD report ${formattedDate}. Thank you.`
  )
  const [file, setFile] = useState<{
    filename: string
    content: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<Notification>(null)

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const reader = new FileReader()
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1]
      setFile({ filename: selectedFile.name, content: base64String })
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleSend = async () => {
    if (!email || !subject || !message) {
      setNotification({
        message: "⚠️ Fill in all required fields",
        type: "error",
      })
      return
    }

    setLoading(true)
    try {
      await sendEmail({
        senderName,
        email,
        cc,
        bcc,
        subject,
        message,
        attachment: file,
      })

      setNotification({ message: "✅ Sent Successfully!", type: "success" })
      setMessage("")
      setFile(null)
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred"
      setNotification({
        message: `❌ ${errorMessage}`,
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="eod-container">
      {notification && (
        <div className={`popup ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="eod-card">
        <header className="eod-header">
          <h2 className="eod-title">EOD Reporting Portal</h2>
          <p className="eod-subtitle">
            Log for {new Date().toLocaleDateString()}
          </p>
        </header>

        <div className="form-grid">
          <div className="field-full">
            <label>Sender Name</label>
            <input
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
            />
          </div>

          <div className="field-full">
            <label>To</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="team@payloro.com"
            />
            <span className="hint">Separate with commas (,)</span>
          </div>

          <div className="field-half">
            <label>CC</label>
            <input value={cc} onChange={(e) => setCc(e.target.value)} />
          </div>

          <div className="field-half">
            <label>BCC</label>
            <input value={bcc} onChange={(e) => setBcc(e.target.value)} />
          </div>

          <div className="field-full">
            <label>Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="field-full">
            <label>Work Summary</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ height: "140px" }}
            />
          </div>

          <div className="field-full">
            <label>Attachment</label>
            <div className="file-box">
              <input type="file" onChange={handleFileChange} />
              {file && <div className="file-name">📎 {file.filename}</div>}
            </div>
          </div>
        </div>

        <button onClick={handleSend} disabled={loading} className="submit-btn">
          {loading ? "🚀 Processing..." : "Send EOD Report"}
        </button>

        <footer>© 2026 Marifer Alcon. All Rights Reserved.</footer>
      </div>
    </div>
  )
}
