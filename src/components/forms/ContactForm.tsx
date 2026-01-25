import { useState } from "react";
import emailjs from "@emailjs/browser";

interface ContactFormProps {
  onClose: () => void;
}

export default function ContactForm({ onClose }: ContactFormProps) {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!email || !subject || !message) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSending(true);
    setError(null);

    try {
      await emailjs.send(
        "service_0xf1tea",
        "template_5c2ngho",
        {
          reply_to: email,
          subject,
          message,
        },
        "3KZaiZkSHPmQN80_3",
      );

      setSent(true);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return <div>Message sent 🌱</div>;
  }

  return (
    <div className="contact-form">
      <input
        className="contact-form__input"
        placeholder="Your email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="contact-form__input"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <textarea
        className="contact-form__textarea"
        placeholder="Your message..."
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {error && <div className="contact-form__error">{error}</div>}

      <button
        className="contact-form__send"
        disabled={sending}
        onClick={handleSend}
      >
        {sending ? "Sending..." : "Send"}
      </button>
    </div>
  );
}
