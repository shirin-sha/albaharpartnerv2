"use client";
import React from "react";
import DropdownSelect from "./DropdownSelect";
import axios from "axios";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function ContactForm({
  parentClass = "form-contact-home style-border",
  btnClass = "tf-btn style-2 bg-color-primary w-full text-center",
  isTitleCenter = true,
  title = "Get A Free Quote",
}) {
  const pathname = usePathname();
  const isRtl = pathname?.startsWith("/ar") || false;
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };
  interface ContactFormProps {
    parentClass?: string;
    btnClass?: string;
    isTitleCenter?: boolean;
    title?: string;
  }

  interface SendEmailEvent extends React.FormEvent<HTMLFormElement> {
    target: HTMLFormElement & {
      email: { value: string };
      reset: () => void;
    };
  }

  const sendEmail = async (e: SendEmailEvent): Promise<void> => {
    e.preventDefault(); // Prevent default form submission behavior
    const email: string = e.target.email.value;

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
    <form onSubmit={sendEmail} className={parentClass}>
      <h5 className={`title-form ${isTitleCenter ? "text-center" : ""}`}>
        {title}
      </h5>
      <fieldset>
        <input required type="text" placeholder={isRtl ? "الاسم الكامل" : "Full name"} />
      </fieldset>
      <fieldset>
        <input required type="number" placeholder={isRtl ? "رقم الهاتف" : "Phone number"} />
      </fieldset>
      <fieldset>
        <input
          required
          type="email"
          name="email"
          placeholder={isRtl ? "البريد الإلكتروني" : "Email address"}
        />
      </fieldset>

      <DropdownSelect
        options={
          isRtl
            ? ["كيف يمكننا مساعدتك؟", "الخيار 1", "الخيار 2", "الخيار 3"]
            : ["How can we help you?", "Option 1", "Option 2", "Option 3"]
        }
      />
      <fieldset>
        <textarea
          required
          placeholder={isRtl ? "رسالتك" : "Your mesages"}
          defaultValue={""}
        />
      </fieldset>
      <div
        className={`tfSubscribeMsg  footer-sub-element ${
          showMessage ? "active" : ""
        }`}
      >
        {success ? (
          <p style={{ color: "rgb(52, 168, 83)" }}>
            Form submitted successfully.
          </p>
        ) : (
          <p style={{ color: "red" }}>Something went wrong</p>
        )}
      </div>
      <button type="submit" className={btnClass}>
        <span> Submit Require </span>
      </button>
    </form>
  );
}
