"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type FormErrors = Record<string, string[] | undefined>;

export default function RegistrationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    const payload = {
      firstName: String(formData.get("firstName") || ""),
      lastName: String(formData.get("lastName") || ""),
      organizationName: String(formData.get("organizationName") || ""),
      subPartnerName: String(formData.get("subPartnerName") || "") || null,
      roleTitle: String(formData.get("roleTitle") || "") || null,
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || "") || null,
      dietaryRequirements:
        String(formData.get("dietaryRequirements") || "") || null,
      accessibilityRequirements:
        String(formData.get("accessibilityRequirements") || "") || null,
      travelRequirements:
        String(formData.get("travelRequirements") || "") || null,
      consentGiven: formData.get("consentGiven") === "on",
    };

    try {
      const response = await fetch("/api/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormError(data.error || "Registration failed.");
        setFieldErrors(data.fields || {});
        return;
      }

      router.push(`/access-card/${encodeURIComponent(data.attendee.qrToken)}`);
    } catch {
      setFormError(
        "Unable to connect to the registration service. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full h-[52.5px] bg-[#EEF1F5] border-none rounded-[14px] px-4 text-[15px] text-[#0E1726] placeholder:text-[#6B7590] outline-none focus:ring-2 focus:ring-[#162E55] transition";
  const labelClass =
    "block text-[12px] font-semibold uppercase text-[#6B7590] tracking-[0.3px] mb-[6px]";

  return (
    <div className="w-full max-w-[608px] mx-auto py-10 space-y-4">
      {/* Design Header Banner */}
      <div className="relative w-full max-w-[608px] h-[167px] bg-[#162E55] p-[24px] rounded-[24px] shadow-[0px_1px_3px_rgba(28,46,90,0.05),0px_4px_16px_rgba(28,46,90,0.07)] overflow-hidden flex flex-col justify-between">
        {/* Radial Decorative Background Circle */}
        <div 
          className="absolute pointer-events-none rounded-full" 
          style={{
            width: '192px',
            height: '192px',
            left: '458.5px',
            top: '-49px',
            background: 'radial-gradient(70.71% 70.71% at 50% 50%, rgba(168, 187, 206, 0.2) 0%, rgba(168, 187, 206, 0) 70%)'
          }} 
        />

        {/* Text Content Container */}
        <div className="flex flex-col items-start w-[560px] h-[119px]">
          {/* Heading 1 Container */}
          <div className="flex flex-col items-start pt-[16px] w-[560px] h-[91px]">
            <h1 className="w-[242px] h-[75px] font-['Chillax',sans-serif] font-bold text-[30px] leading-[38px] text-white">
              Partner <br /> Convening 2026
            </h1>
          </div>

          {/* Subtitle Paragraph Container */}
          <div className="flex flex-col items-start pt-[8px] w-[560px] h-[28px]">
            <p className="w-[169px] h-[20px] font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-[rgba(255,255,255,0.5)]">
              Harare · 9–11 March 2026
            </p>
          </div>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-3 gap-[16px]">
        <div className="bg-white p-[16px] rounded-[24px] border border-[rgba(28,46,90,0.1)] shadow-[0px_1px_3px_rgba(28,46,90,0.05),0px_4px_16px_rgba(28,46,90,0.07)] flex flex-col justify-between h-[98px]">
          <svg className="w-4 h-4 text-[#A8BBCE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <div>
            <p className="text-[20px] font-bold text-[#0E1726] font-['Chillax',sans-serif] leading-tight">110+</p>
            <p className="text-[12px] text-[#6B7590]">Attendees</p>
          </div>
        </div>

        <div className="bg-white p-[16px] rounded-[24px] border border-[rgba(28,46,90,0.1)] shadow-[0px_1px_3px_rgba(28,46,90,0.05),0px_4px_16px_rgba(28,46,90,0.07)] flex flex-col justify-between h-[98px]">
          <svg className="w-4 h-4 text-[#A8BBCE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div>
            <p className="text-[20px] font-bold text-[#0E1726] font-['Chillax',sans-serif] leading-tight">24</p>
            <p className="text-[12px] text-[#6B7590]">Sessions</p>
          </div>
        </div>

        <div className="bg-white p-[16px] rounded-[24px] border border-[rgba(28,46,90,0.1)] shadow-[0px_1px_3px_rgba(28,46,90,0.05),0px_4px_16px_rgba(28,46,90,0.07)] flex flex-col justify-between h-[98px]">
          <svg className="w-4 h-4 text-[#A8BBCE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 01-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
          </svg>
          <div>
            <p className="text-[20px] font-bold text-[#0E1726] font-['Chillax',sans-serif] leading-tight">38</p>
            <p className="text-[12px] text-[#6B7590]">Partners</p>
          </div>
        </div>
      </div>

      {/* Main Form Container Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-[20px] rounded-[24px] shadow-[0px_1px_3px_rgba(28,46,90,0.05),0px_4px_16px_rgba(28,46,90,0.07)] border border-[rgba(28,46,90,0.1)] space-y-[16px]"
      >
        <h2 className="text-[18px] font-semibold text-[#0E1726] font-['Chillax',sans-serif]">
          Registration Form
        </h2>

        {formError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-700">
            {formError}
          </div>
        )}

        {/* First & Last Name Full Width Stacking per Design */}
        <div>
          <label htmlFor="firstName" className={labelClass}>
            FIRST NAME <span className="text-[#FB2C36]">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            defaultValue="Maria"
            required
            maxLength={100}
            className={inputClass}
          />
          {fieldErrors.firstName?.[0] && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.firstName[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className={labelClass}>
            LAST NAME <span className="text-[#FB2C36]">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            defaultValue="Schmidt"
            required
            maxLength={100}
            className={inputClass}
          />
          {fieldErrors.lastName?.[0] && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.lastName[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="organizationName" className={labelClass}>
            ORGANISATION <span className="text-[#FB2C36]">*</span>
          </label>
          <input
            id="organizationName"
            name="organizationName"
            placeholder="Your organisation name"
            required
            maxLength={200}
            className={inputClass}
          />
          {fieldErrors.organizationName?.[0] && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.organizationName[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="subPartnerName" className={labelClass}>
            SUB-PARTNER / PROGRAMME AREA
          </label>
          <input
            id="subPartnerName"
            name="subPartnerName"
            placeholder="Optional"
            maxLength={200}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="roleTitle" className={labelClass}>
            ROLE / CAPACITY <span className="text-[#FB2C36]">*</span>
          </label>
          <select
            id="roleTitle"
            name="roleTitle"
            defaultValue=""
            className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2014%2014%22%3E%3Cpath%20fill%3D%22none%22%20stroke%3D%22%236B7590%22%20stroke-width%3D%221.17%22%20d%3D%22M3.5%205.25L7%208.75L10.5%205.25%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_16px_center] bg-no-repeat pr-10`}
          >
            <option value="" disabled hidden>
              Select your role
            </option>
            <option value="Partner">Partner</option>
            <option value="OAK Staff">OAK Staff</option>
            <option value="Coordination Team">Coordination Team</option>
            <option value="Presenter">Presenter</option>
            <option value="Observer">Observer</option>
          </select>
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            EMAIL ADDRESS <span className="text-[#FB2C36]">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@organisation.org"
            required
            maxLength={254}
            className={inputClass}
          />
          {fieldErrors.email?.[0] && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.email[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            PHONE NUMBER
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+41 xx xxx xx xx"
            maxLength={50}
            className={inputClass}
          />
        </div>

        {/* Requirements Group */}
        <div className="bg-[#EEF1F5] p-[16px] rounded-[16px] border border-[rgba(28,46,90,0.1)] space-y-[12px]">
          <h3 className="text-[10px] font-semibold uppercase tracking-[1px] text-[#6B7590]">
            REQUIREMENTS
          </h3>

          <div>
            <label htmlFor="dietaryRequirements" className={labelClass}>
              DIETARY REQUIREMENTS
            </label>
            <input
              id="dietaryRequirements"
              name="dietaryRequirements"
              placeholder="e.g. Vegetarian, Halal, Gluten-free"
              maxLength={1000}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="accessibilityRequirements" className={labelClass}>
              ACCESSIBILITY REQUIREMENTS
            </label>
            <input
              id="accessibilityRequirements"
              name="accessibilityRequirements"
              placeholder="e.g. Wheelchair access, hearing loop"
              maxLength={1000}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="travelRequirements" className={labelClass}>
              TRAVEL & ACCOMMODATION
            </label>
            <input
              id="travelRequirements"
              name="travelRequirements"
              placeholder="e.g. Flight from London, hotel needed"
              maxLength={1000}
              className={inputClass}
            />
          </div>
        </div>

        {/* Consent Box */}
        <div className="border border-[rgba(28,46,90,0.18)] rounded-[16px] p-[16px] flex items-start gap-[12px]">
          <input
            id="consentGiven"
            name="consentGiven"
            type="checkbox"
            required
            className="mt-[2px] h-[20px] w-[20px] shrink-0 rounded-[6px] border-2 border-[rgba(28,46,90,0.18)] text-[#162E55] focus:ring-[#162E55]"
          />
          <label htmlFor="consentGiven" className="text-[14px] text-[#0E1726] leading-[23px]">
            I agree to OAK Foundation&apos;s privacy policy and consent to my registration data being used for event coordination.
          </label>
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[56px] rounded-[16px] bg-[#162E55] text-[16px] font-semibold text-white transition hover:bg-opacity-95 disabled:cursor-not-allowed disabled:opacity-60 shadow-[0px_4px_20px_rgba(28,46,90,0.3)] font-['Chillax',sans-serif] flex items-center justify-center"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </div>
      </form>

      <p className="text-center text-[12px] text-[#6B7590] py-[16px]">
        Your data is secured and handled by OAK Foundation in accordance with GDPR.
      </p>
    </div>
  );
}