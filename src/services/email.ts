interface EmailPayload {
  senderName: string
  email: string
  cc?: string
  bcc?: string
  subject: string
  message: string
  attachment?: {
    filename: string
    content: string
  } | null
}

export const sendEmail = async (payload: EmailPayload) => {
  const apiUrl = `${import.meta.env.VITE_API_URL}/email/send`;
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: "Failed to send email" }))
    throw new Error(errorData.message || "Failed to send email")
  }

  return res.json()
}
