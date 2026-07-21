"use client";

import axios from "axios";
import { useState } from "react";

export default function NewsLetterForm({
  placeholder = "Enter your email address",
}) {
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };
  interface NewsLetterFormProps {
    placeholder?: string;
  }

  interface SendEmailEvent extends React.FormEvent<HTMLFormElement> {
    target: HTMLFormElement & {
      email: { value: string };
      reset: () => void;
    };
  }

  const sendEmail = async (e: SendEmailEvent): Promise<void> => {
    e.preventDefault(); // Prevent default form submission behavior
    const email = e.target.email.value;

    try {
      const response = await axios.post(
        "https://express-brevomail.vercel.app/api/contacts",
        {
          email,
        }
      );

      if ([200, 201].includes(response.status)) {
        e.target.reset(); // Reset the form
        setSuccess(true); // Set success state
        handleShowMessage();
      } else {
        setSuccess(false); // Handle unexpected responses
        handleShowMessage();
      }
    } catch (error) {
      setSuccess(false); // Set error state
      handleShowMessage();
      e.target.reset(); // Reset the form
    }
  };
  return (
    <form onSubmit={sendEmail}>
      {" "}
      <fieldset>
        <input name="email" type="text" placeholder={placeholder} />
        <button
          type="submit"
          className="tf-btn-newsletter"
          aria-label="Subscribe to newsletter"
        >
          <i className="icon-PaperPlaneTilt" aria-hidden />
        </button>
      </fieldset>
      <div
        className={`tfSubscribeMsg  footer-sub-element ${
          showMessage ? "active" : ""
        }`}
      >
        {success ? (
          <p style={{ color: "rgb(52, 168, 83)" }}>
            You have successfully subscribed.
          </p>
        ) : (
          <p style={{ color: "red" }}>Something went wrong</p>
        )}
      </div>
    </form>
  );
}
