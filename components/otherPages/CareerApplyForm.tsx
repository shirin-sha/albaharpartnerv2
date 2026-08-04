"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import type { Job } from "@/types/careers";

type Props = {
  jobs: Job[];
  language?: "ltr" | "rtl";
};

type FormState = {
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  linkedInUrl: string;
  resumeUrl: string;
  coverLetter: string;
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default function CareerApplyForm({ jobs, language = "ltr" }: Props) {
  const isArabic = language === "rtl";
  const searchParams = useSearchParams();
  const jobFromUrl = (searchParams?.get("job") || "").trim();
  const labels = {
    heading: isArabic ? "قدم الآن" : "Apply Now",
    subheading: isArabic ? "أرسل بياناتك وسنتواصل معك قريبًا." : "Submit your details and we’ll get back to you.",
    selectRole: isArabic ? "اختر الوظيفة" : "Select Job Role",
    fullName: isArabic ? "الاسم الكامل*" : "Full name*",
    email: isArabic ? "البريد الإلكتروني*" : "Email*",
    phone: isArabic ? "رقم الهاتف*" : "Phone number*",
    country: isArabic ? "الدولة" : "Country",
    linkedin: isArabic ? "رابط لينكدإن" : "LinkedIn URL",
    resume: isArabic ? "السيرة الذاتية*" : "Resume*",
    coverLetter: isArabic ? "رسالة التقديم / ملاحظات" : "Cover letter / message",
    submitting: isArabic ? "جاري الإرسال..." : "Submitting...",
    submit: isArabic ? "يُقدِّم" : "Submit ",
    validationRole: isArabic ? "يرجى اختيار الوظيفة." : "Please select a job role.",
    validationName: isArabic ? "الاسم الكامل مطلوب." : "Full name is required.",
    validationEmail: isArabic ? "البريد الإلكتروني مطلوب." : "Email is required.",
    validationEmailFormat: isArabic ? "يرجى إدخال بريد إلكتروني صحيح." : "Please enter a valid email.",
    validationPhone: isArabic ? "رقم الهاتف مطلوب." : "Phone number is required.",
    validationResume: isArabic ? "رفع السيرة الذاتية مطلوب." : "Resume upload is required.",
    uploadFailed: isArabic ? "فشل رفع السيرة الذاتية. يرجى المحاولة مرة أخرى." : "Resume upload failed. Please try again.",
    submitSuccess: isArabic ? "تم إرسال طلب التوظيف بنجاح." : "Application submitted successfully.",
    submitError: isArabic ? "حدث خطأ ما. يرجى المحاولة مرة أخرى." : "Something went wrong. Please try again.",
    submitErrorFallback: isArabic ? "فشل إرسال الطلب." : "Failed to submit application.",
    captchaLabel: isArabic ? "أدخل النص الظاهر في الصورة" : "Enter the text shown in the image",
    captchaPlaceholder: isArabic ? "أدخل الأحرف" : "Type the characters",
    captchaRequired: isArabic ? "يرجى إدخال النص الظاهر في الصورة." : "Please enter the text from the image.",
    captchaInvalid: isArabic ? "رمز التحقق غير صحيح. حاول مرة أخرى." : "Invalid captcha. Try again.",
    captchaLoadFailed: isArabic ? "تعذر تحميل رمز التحقق." : "Could not load captcha.",
    captchaRefresh: isArabic ? "تحديث" : "Refresh",
    captchaAlt: isArabic ? "صورة رمز التحقق" : "Captcha image",
  };

  const jobTitles = useMemo(() => (jobs || []).map((j) => j.title), [jobs]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  const [form, setForm] = useState<FormState>({
    jobTitle: "",
    fullName: "",
    email: "",
    phone: "",
    country: "",
    linkedInUrl: "",
    resumeUrl: "",
    coverLetter: "",
  });

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
        isArabic ? "تعذر تحميل رمز التحقق." : "Could not load captcha."
      );
    }
  }, [isArabic]);

  // Preselect job from URL querystring if present
  useEffect(() => {
    if (!jobFromUrl) return;
    if (!jobTitles.includes(jobFromUrl)) return;
    setForm((prev) => ({ ...prev, jobTitle: jobFromUrl }));
  }, [jobFromUrl, jobTitles]);

  useEffect(() => {
    void loadCaptcha();
  }, [loadCaptcha]);

  const setField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): string | null => {
    if (!form.jobTitle) return labels.validationRole;
    if (!form.fullName.trim()) return labels.validationName;
    if (!form.email.trim()) return labels.validationEmail;
    if (!isValidEmail(form.email)) return labels.validationEmailFormat;
    if (!form.phone.trim()) return labels.validationPhone;
    if (!resumeFile) return labels.validationResume;
    if (!captchaToken || !captchaAnswer.trim()) return labels.captchaRequired;
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setMessage("");
    setCaptchaError("");

    const formEl = e.currentTarget as HTMLFormElement;
    const honeypot = new FormData(formEl).get("website");
    if (String(honeypot || "").trim()) {
      setSuccess(true);
      setMessage(labels.submitSuccess);
      setCaptchaAnswer("");
      void loadCaptcha();
      return;
    }

    const error = validate();
    if (error) {
      setSuccess(false);
      setMessage(error);
      if (error === labels.captchaRequired) setCaptchaError(error);
      return;
    }

    try {
      setIsSubmitting(true);

      const uploadData = new FormData();
      uploadData.append("file", resumeFile as Blob);
      uploadData.append("folder", "resumes");

      const uploadResponse = await axios.post("/api/careers/upload-resume", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploadedResumePath = uploadResponse?.data?.path;

      if (!uploadedResumePath) {
        setSuccess(false);
        setMessage(labels.uploadFailed);
        return;
      }

      const res = await axios.post("/api/careers/apply", {
        jobTitle: form.jobTitle,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        country: form.country,
        linkedInUrl: form.linkedInUrl,
        resumeUrl: uploadedResumePath,
        coverLetter: form.coverLetter,
        captchaToken,
        captchaAnswer: captchaAnswer.trim(),
      });

      if ([200, 201].includes(res.status) && res.data?.success !== false) {
        setSuccess(true);
        setMessage(labels.submitSuccess);
        setForm({
          jobTitle: form.jobTitle, // keep selection
          fullName: "",
          email: "",
          phone: "",
          country: "",
          linkedInUrl: "",
          resumeUrl: uploadedResumePath,
          coverLetter: "",
        });
        setResumeFile(null);
        setCaptchaAnswer("");
        void loadCaptcha();
      } else {
        setSuccess(false);
        setMessage(labels.submitError);
        void loadCaptcha();
      }
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message || labels.submitErrorFallback;
      setSuccess(false);
      setMessage(apiMessage);
      if (String(apiMessage).toLowerCase().includes("captcha")) {
        setCaptchaError(labels.captchaInvalid);
      }
      void loadCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="apply-now" className="career-apply-wrapper" dir={isArabic ? "rtl" : "ltr"}>
      <div className="bg-white career-apply-card">
        <div className="heading-section text-center mb-20">
          <h4 className="mb-8">{labels.heading}</h4>
          <div className="sub-title body-2">
            {labels.subheading}
          </div>
        </div>

        <form className="form-contact-us" onSubmit={onSubmit}>
          <div className="cols">
            <fieldset className="item">
              <select
                name="jobTitle"
                required
                value={form.jobTitle}
                onChange={(e) => setField("jobTitle", e.target.value)}
                className="career-apply-select"
              >
                <option value="">{labels.selectRole}</option>
                {jobTitles.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </fieldset>
            <fieldset className="item">
              <input
                type="text"
                name="fullName"
                required
                placeholder={labels.fullName}
                value={form.fullName}
                onChange={(e) => setField("fullName", e.target.value)}
              />
            </fieldset>
          </div>

          <div className="cols">
            <fieldset className="item">
              <input
                type="email"
                name="email"
                required
                placeholder={labels.email}
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
              />
            </fieldset>
            <fieldset className="item">
              <input
                type="tel"
                name="phone"
                required
                placeholder={labels.phone}
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
              />
            </fieldset>
          </div>

          <div className="cols">
            <fieldset className="item">
              <input
                type="text"
                name="country"
                placeholder={labels.country}
                value={form.country}
                onChange={(e) => setField("country", e.target.value)}
              />
            </fieldset>
            <fieldset className="item">
              <input
                type="url"
                name="linkedInUrl"
                placeholder={labels.linkedin}
                value={form.linkedInUrl}
                onChange={(e) => setField("linkedInUrl", e.target.value)}
              />
            </fieldset>
          </div>

          <fieldset className="career-apply-fieldset-sm">
            <label
              htmlFor="resumeFile"
              className="body-2 career-apply-resume-label"
            >
              {labels.resume}
            </label>
            <input
              id="resumeFile"
              type="file"
              name="resumeFile"
              required
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => {
                const selected = e.target.files?.[0] || null;
                setResumeFile(selected);
              }}
            />
          </fieldset>

          <fieldset className="career-apply-fieldset-md">
            <textarea
              name="coverLetter"
              placeholder={labels.coverLetter}
              value={form.coverLetter}
              onChange={(e) => setField("coverLetter", e.target.value)}
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
            <label htmlFor="career-website">Website</label>
            <input
              type="text"
              id="career-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <fieldset className="contact-captcha-field career-apply-fieldset-sm">
            <label htmlFor="career-captcha-answer" style={{ display: "block", marginBottom: 8 }}>
              {labels.captchaLabel}
            </label>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {captchaImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={captchaImage}
                  alt={labels.captchaAlt}
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
                aria-label={labels.captchaRefresh}
              >
                <span>{labels.captchaRefresh}</span>
              </button>
            </div>
            <input
              id="career-captcha-answer"
              required
              type="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              placeholder={labels.captchaPlaceholder}
              className="career-apply-captcha-input"
            />
            {captchaError && (
              <p style={{ color: "red", marginTop: 8, marginBottom: 0 }}>{captchaError}</p>
            )}
          </fieldset>

          {success !== null && (
            <div className="tfSubscribeMsg footer-sub-element active career-apply-feedback">
              {success ? (
                <p className="career-apply-feedback-success">{message}</p>
              ) : (
                <p className="career-apply-feedback-error">{message}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !captchaToken}
            className="tf-btn style-1 bg-color-primary text-center career-apply-submit"
          >
            <span>{isSubmitting ? labels.submitting : labels.submit}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

