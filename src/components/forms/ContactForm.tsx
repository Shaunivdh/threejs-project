import { useState } from "react";
import emailjs from "@emailjs/browser";

interface ContactFormProps {
  onClose: () => void;
}

export default function ContactForm({ onClose }: ContactFormProps) {
  const MAX_MESSAGE_LENGTH = 200;
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
        { reply_to: email, subject, message },
        "3KZaiZkSHPmQN80_3",
      );

      setSent(true);
      setTimeout(onClose, 1200);
    } catch (err) {
      console.error(err);
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return <div>Message sent, I’ll be in touch shortly 🌱</div>;
  }

  return (
    <div className="contact-form" aria-label="Contact form">
      <label className="contact-form__label">
        Your email
        <input
          className="contact-form__input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </label>

      <label className="contact-form__label">
        Subject
        <input
          className="contact-form__input"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </label>

      <label className="contact-form__label">
        Message
        <textarea
          className="contact-form__textarea"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={MAX_MESSAGE_LENGTH}
        />
      </label>

      {error && (
        <div className="contact-form__error" role="alert">
          {error}
        </div>
      )}

      <div className="contact-form__actions">
        <button
          type="button"
          className="contact-form__btn contact-form__btn--ghost"
          onClick={onClose}
          disabled={sending}
        >
          Cancel
        </button>

        <button
          type="button"
          className="contact-form__btn contact-form__btn--primary"
          onClick={handleSend}
          disabled={sending}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
