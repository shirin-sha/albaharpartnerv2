"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import axios from "axios";
import { useState } from "react";

export default function LoginModal() {
  const modalElement = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const showModal = async () => {
      const bootstrap = await import("bootstrap"); // dynamically import bootstrap
      const modalDom = document.getElementById("modallogin");
      if (!modalDom) return;
      const myModal = new bootstrap.Modal(modalDom, {
        keyboard: false,
      });

      // Show the modal after a delay using a promise
      await new Promise((resolve) => setTimeout(resolve, 2000));
      myModal.show();

      modalElement.current?.addEventListener("hidden.bs.modal", () => {
        myModal.hide();
      });
    };

    showModal();
  }, []);
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };
  interface SendEmailEvent extends React.FormEvent<HTMLFormElement> {
    target: HTMLFormElement & {
      email: { value: string };
      reset: () => void;
    };
  }

  interface ApiResponse {
    status: number;
    [key: string]: any;
  }

  const sendEmail = async (e: SendEmailEvent): Promise<void> => {
    e.preventDefault(); // Prevent default form submission behavior
    const email: string = e.target.email.value;

    try {
      const response: ApiResponse = await axios.post(
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
    <div
      className="modal fade modalCenter auto-popup"
      ref={modalElement}
      id="modallogin"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content modal-xl">
          <div className="wg-new-letter">
            <div className="image">
              <Image
                src="/image/section/img-new-letter.jpg"
              alt="Newsletter signup"
              className="lazyload"
              width={440}
                height={440}
              />
            </div>
            <div className="new-letter-content text-center">
              <div className="heading">
                <div className="label text-btn-uppercase color-primary mb-8">
                  Subscribe To Our Newletter!
                </div>
                <h5 className="color-on-suface-container">
                  Sign Up For Updates On Our Latest
                  <br />
                  News And Events.
                </h5>
              </div>
              <form onSubmit={sendEmail}>
                <fieldset>
                  <input
                    name="email"
                    type="text"
                    placeholder="Enter your email address"
                  />
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
                <button
                  type="submit"
                  className="tf-btn style-2 bg-color-primary"
                >
                  <span>Subscribe</span>
                </button>{" "}
              </form>
              <ul className="tf-social radius-50 g-8 color-on-suface-container">
                <li className="item">
                  <a href="https://www.messenger.com" target="_blank" rel="noopener noreferrer" aria-label="Al Bahar & Partners on Messenger">
                    <span className="visually-hidden">Al Bahar & Partners on Messenger</span>
                    <div className="icon" aria-hidden={true}>
                      <i className="icon-messenger" />
                    </div>
                  </a>
                </li>
                <li className="item">
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="Al Bahar & Partners on X">
                    <span className="visually-hidden">Al Bahar & Partners on X</span>
                    <div className="icon" aria-hidden={true}>
                      <i className="icon-x" />
                    </div>
                  </a>
                </li>
                <li className="item">
                  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Al Bahar & Partners on Instagram">
                    <span className="visually-hidden">Al Bahar & Partners on Instagram</span>
                    <div className="icon" aria-hidden={true}>
                      <i className="icon-ig1" />
                    </div>
                  </a>
                </li>
                <li className="item">
                  <a href="https://www.skype.com" target="_blank" rel="noopener noreferrer" aria-label="Al Bahar & Partners on Skype">
                    <span className="visually-hidden">Al Bahar & Partners on Skype</span>
                    <div className="icon" aria-hidden={true}>
                      <i className="icon-skype" />
                    </div>
                  </a>
                </li>
                <li className="item">
                  <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" aria-label="Al Bahar & Partners on Telegram">
                    <span className="visually-hidden">Al Bahar & Partners on Telegram</span>
                    <div className="icon" aria-hidden={true}>
                      <i className="icon-telegram" />
                    </div>
                  </a>
                </li>
              </ul>
            </div>
            <button
              type="button"
              data-bs-dismiss="modal"
              className="icon-new-letter btn-hide-popup"
              aria-label="Close newsletter popup"
            >
              <i className="icon-close1"> </i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
