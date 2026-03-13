import { describe, it, expect, vi } from "vitest";
import { sendEmail } from "../src/services/email";

vi.stubGlobal("import", {
  meta: {
    env: {
      VITE_API_URL: "http://localhost:4000/email/send",
      VITE_DEFAULT_RECIPIENT: "it@payloro.com",
    },
  },
});

describe("sendEmail", () => {
  const testPayload = {
    senderName: "Test Sender",
    email: import.meta.env.VITE_DEFAULT_RECIPIENT,
    subject: "Test Subject",
    message: "Test Message",
  };

  it("should send an email successfully", async () => {
    const mockSuccessResponse = { message: "Email sent successfully" };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSuccessResponse),
    });
    global.fetch = mockFetch;

    const response = await sendEmail(testPayload);

    expect(mockFetch).toHaveBeenCalledWith(import.meta.env.VITE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testPayload),
    });
    expect(response).toEqual(mockSuccessResponse);
  });

  it("should throw an error if the email fails to send", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: "Failed to send email" }),
    });
    global.fetch = mockFetch;

    await expect(sendEmail(testPayload)).rejects.toThrow(
      "Failed to send email"
    );
  });
});
