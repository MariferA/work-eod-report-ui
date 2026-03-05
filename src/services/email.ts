export const sendEmail = async (
  email: string,
  subject: string,
  message: string
) => {
  const res = await fetch("http://localhost:4000/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, subject, message }),
  })

  if (!res.ok) {
    throw new Error("Failed to send email")
  }

  return res.json()
}
