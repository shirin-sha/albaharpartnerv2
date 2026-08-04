"use client";
import React, { useCallback, useEffect, useState } from "react";
import DropdownSelect from "./DropdownSelect";
import axios from "axios";
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
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subject, setSubject] = useState(
    isRtl ? "كيف يمكننا مساعدتك؟" : "How can we help you?"
  );
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  const helpOptions = isRtl
    ? ["كيف يمكننا مساعدتك؟", "استفسار عام", "طلب عرض سعر", "دعم فني"]
    : ["How can we help you?", "General inquiry", "Request a quote", "Technical support"];

  const loadCaptcha = useCallback(async () => {
    try {
      const res = await axios.get("/api/captcha");
      if (res.data?.success && res.data.image && res.data.token) {
        setCaptchaImage(res.data.image);
        setCaptchaToken(res.data.token);
        setCaptchaAnswer("");
        setCaptchaError("");
      }
    } catch {
      setCaptchaImage("");
      setCaptchaToken("");
      setCaptchaError(
        isRtl ? "تعذر تحميل رمز التحقق." : "Could not load captcha."
      );
    }
  }, [isRtl]);

  useEffect(() => {
    void loadCaptcha();
  }, [loadCaptcha]);

  const handleShowMessage = (ok: boolean, text: string) => {
    setSuccess(ok);
    setStatusMessage(text);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot
    if (String(formData.get("website") || "").trim()) {
      handleShowMessage(
        true,
        isRtl ? "تم إرسال النموذج بنجاح." : "Form submitted successfully."
      );
      form.reset();
      setCaptchaAnswer("");
      void loadCaptcha();
      return;
    }

    if (!captchaToken || !captchaAnswer.trim()) {
      setCaptchaError(
        isRtl ? "يرجى إدخال النص الظاهر في الصورة." : "Please enter the text from the image."
      );
      return;
    }

    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const comment = String(formData.get("comment") || "").trim();

    setIsSubmitting(true);
    setCaptchaError("");

    try {
      const response = await axios.post("/api/enquiries", {
        name,
        phone,
        email,
        country: "Kuwait",
        subject,
        comment,
        captchaToken,
        captchaAnswer: captchaAnswer.trim(),
      });

      if ([200, 201].includes(response.status) && response.data?.success) {
        form.reset();
        setSubject(helpOptions[0]);
        handleShowMessage(
          true,
          isRtl ? "تم إرسال النموذج بنجاح." : "Form submitted successfully."
        );
        void loadCaptcha();
      } else {
        handleShowMessage(
          false,
          response.data?.message ||
            (isRtl ? "حدث خطأ ما." : "Something went wrong")
        );
        void loadCaptcha();
      }
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? String(error.response.data.message)
          : isRtl
            ? "حدث خطأ ما."
            : "Something went wrong";
      handleShowMessage(false, message);
      setCaptchaError(
        isRtl ? "رمز التحقق غير صحيح. حاول مرة أخرى." : "Invalid captcha. Try again."
      );
      void loadCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={sendEmail} className={parentClass} noValidate={false}>
      <h5 className={`title-form ${isTitleCenter ? "text-center" : ""}`}>
        {title}
      </h5>
      <fieldset>
        <input
          required
          type="text"
          name="name"
          placeholder={isRtl ? "الاسم الكامل" : "Full name"}
          autoComplete="name"
        />
      </fieldset>
      <fieldset>
        <input
          required
          type="tel"
          name="phone"
          placeholder={isRtl ? "رقم الهاتف" : "Phone number"}
          autoComplete="tel"
        />
      </fieldset>
      <fieldset>
        <input
          required
          type="email"
          name="email"
          placeholder={isRtl ? "البريد الإلكتروني" : "Email address"}
          autoComplete="email"
        />
      </fieldset>

      {/* Honeypot — hidden from users */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-10000px",
          top: "auto",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <DropdownSelect
        options={helpOptions}
        selectedValue={subject}
        onChange={(value) => setSubject(value)}
      />
      <fieldset>
        <textarea
          required
          name="comment"
          placeholder={isRtl ? "رسالتك" : "Your message"}
          defaultValue={""}
        />
      </fieldset>

      <fieldset className="contact-captcha-field">
        <label htmlFor="captcha-answer" style={{ display: "block", marginBottom: 8 }}>
          {isRtl ? "أدخل النص الظاهر في الصورة" : "Enter the text shown in the image"}
        </label>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {captchaImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={captchaImage}
              alt={isRtl ? "صورة رمز التحقق" : "Captcha image"}
              width={180}
              height={56}
              style={{
                borderRadius: 6,
                border: "1px solid #c5ccd4",
                background: "#eef1f4",
                userSelect: "none",
              }}
            />
          ) : (
            <div
              style={{
                width: 180,
                height: 56,
                borderRadius: 6,
                background: "#eef1f4",
                border: "1px solid #c5ccd4",
              }}
            />
          )}
          <button
            type="button"
            className="tf-btn style-2"
            onClick={() => void loadCaptcha()}
            disabled={isSubmitting}
            aria-label={isRtl ? "تحديث رمز التحقق" : "Refresh captcha"}
          >
            <span>{isRtl ? "تحديث" : "Refresh"}</span>
          </button>
        </div>
        <input
          id="captcha-answer"
          required
          type="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          value={captchaAnswer}
          onChange={(e) => setCaptchaAnswer(e.target.value)}
          placeholder={isRtl ? "أدخل الأحرف" : "Type the characters"}
          style={{ marginTop: 10, width: "100%" }}
        />
        {captchaError && (
          <p style={{ color: "red", marginTop: 8, marginBottom: 0 }}>{captchaError}</p>
        )}
      </fieldset>

      <div
        className={`tfSubscribeMsg  footer-sub-element ${
          showMessage ? "active" : ""
        }`}
      >
        {success ? (
          <p style={{ color: "rgb(52, 168, 83)" }}>
            {statusMessage || "Form submitted successfully."}
          </p>
        ) : (
          <p style={{ color: "red" }}>
            {statusMessage || "Something went wrong"}
          </p>
        )}
      </div>
      <button type="submit" className={btnClass} disabled={isSubmitting || !captchaToken}>
        <span>
          {isSubmitting
            ? isRtl
              ? "جاري الإرسال..."
              : "Submitting..."
            : isRtl
              ? "إرسال"
              : "Submit"}
        </span>
      </button>
    </form>
  );
}
