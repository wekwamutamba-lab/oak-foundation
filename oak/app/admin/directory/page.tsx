"use client";

import { FormEvent, useEffect, useState } from "react";

type Partner = {
  id: string;
  name: string;
  description: string | null;
  website_url: string | null;
  logo_path: string | null;
  is_sub_partner: boolean;
  parent_partner_id: string | null;
  display_order: number;
  is_published: boolean;
};

type PartnerForm = {
  id?: string;
  name: string;
  description: string;
  websiteUrl: string;
  logoPath: string;
  isSubPartner: boolean;
  parentPartnerId: string;
  displayOrder: number;
  isPublished: boolean;
};

const emptyForm: PartnerForm = {
  name: "",
  description: "",
  websiteUrl: "",
  logoPath: "",
  isSubPartner: false,
  parentPartnerId: "",
  displayOrder: 0,
  isPublished: false,
};

export default function AdminDirectoryPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [form, setForm] = useState<PartnerForm>(emptyForm);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadPartners() {
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/directory", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not load partners.");
        return;
      }

      setPartners(data.partners || []);
    } catch {
      setError("Could not connect to the partner service.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadPartners();
  }, []);

  function updateForm<K extends keyof PartnerForm>(
    key: K,
    value: PartnerForm[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function editPartner(partner: Partner) {
    setError(null);
    setMessage(null);
    setLogoFile(null);

    setForm({
      id: partner.id,
      name: partner.name,
      description: partner.description || "",
      websiteUrl: partner.website_url || "",
      logoPath: partner.logo_path || "",
      isSubPartner: partner.is_sub_partner,
      parentPartnerId: partner.parent_partner_id || "",
      displayOrder: partner.display_order,
      isPublished: partner.is_published,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(emptyForm);
    setLogoFile(null);
    setMessage(null);
    setError(null);
  }

  async function uploadLogoIfNeeded() {
    if (!logoFile) {
      return form.logoPath || null;
    }

    setIsUploadingLogo(true);

    try {
      const uploadData = new FormData();
      uploadData.append("file", logoFile);

      const response = await fetch("/api/admin/partner-logos", {
        method: "POST",
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not upload logo.");
      }

      return data.logoPath as string;
    } finally {
      setIsUploadingLogo(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setMessage(null);
    setIsSaving(true);

    try {
      const logoPath = await uploadLogoIfNeeded();

      const payload = {
        ...(form.id ? { id: form.id } : {}),
        name: form.name,
        description: form.description || null,
        websiteUrl: form.websiteUrl || null,
        logoPath,
        isSubPartner: form.isSubPartner,
        parentPartnerId: form.parentPartnerId || null,
        displayOrder: Number(form.displayOrder),
        isPublished: form.isPublished,
      };

      const response = await fetch("/api/admin/directory", {
        method: form.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not save partner.");
      }

      setMessage(
        form.id
          ? "Partner updated successfully."
          : "Partner created successfully."
      );

      setForm(emptyForm);
      setLogoFile(null);
      await loadPartners();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save partner."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function deletePartner(partner: Partner) {
    const confirmed = window.confirm(
      `Delete "${partner.name}"? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/admin/directory?id=${encodeURIComponent(partner.id)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Could not delete partner.");
      }

      setMessage("Partner deleted successfully.");

      if (form.id === partner.id) {
        resetForm();
      }

      await loadPartners();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete partner."
      );
    }
  }

  const textInputClass =
    "mt-1.5 w-full text-xs rounded-[10px] border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-[#1E293B] outline-none transition focus:border-[#1D3557] focus:ring-1 focus:ring-[#1D3557]";

  return (
    <div className="py-2 space-y-6">
      {/* Header Section */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
          Coordination Workspace
        </p>

        <h1 className="text-2xl font-black text-[#1E293B] mt-1">
          Partner Directory Editor
        </h1>

        <p className="text-xs text-[#64748B] mt-1">
          Create, update, publish, and remove public partner-directory entries.
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[#1E293B]">
            {form.id ? "Edit Partner" : "Add Partner"}
          </h2>

          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-semibold text-[#1D3557] hover:underline"
            >
              Cancel editing
            </button>
          )}
        </div>

        {message && (
          <div className="mt-4 rounded-[10px] border border-[#10B981]/20 bg-[#10B981]/10 px-4 py-3 text-xs font-medium text-[#10B981]">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="text-xs font-bold text-[#1E293B]">
              Organization name *
            </label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(event) => updateForm("name", event.target.value)}
              maxLength={200}
              className={textInputClass}
            />
          </div>

          <div>
            <label
              htmlFor="websiteUrl"
              className="text-xs font-bold text-[#1E293B]"
            >
              Website URL
            </label>
            <input
              id="websiteUrl"
              type="url"
              placeholder="https://example.org"
              value={form.websiteUrl}
              onChange={(event) => updateForm("websiteUrl", event.target.value)}
              className={textInputClass}
            />
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="description"
            className="text-xs font-bold text-[#1E293B]"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            maxLength={2000}
            value={form.description}
            onChange={(event) => updateForm("description", event.target.value)}
            className={textInputClass}
          />
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="logo"
              className="text-xs font-bold text-[#1E293B]"
            >
              Partner logo
            </label>
            <input
              id="logo"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={(event) => {
                setLogoFile(event.target.files?.[0] || null);
              }}
              className="mt-1.5 block w-full text-xs text-[#64748B] file:mr-3 file:rounded-lg file:border-0 file:bg-[#F1F5F9] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#1E293B] hover:file:bg-[#E2E8F0]"
            />

            <p className="mt-1.5 text-[11px] text-[#64748B]">
              PNG, JPG, WEBP, or SVG. Maximum 2 MB.
            </p>

            {form.logoPath && !logoFile && (
              <a
                href={form.logoPath}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs font-semibold text-[#1D3557] hover:underline"
              >
                View current logo
              </a>
            )}
          </div>

          <div>
            <label
              htmlFor="displayOrder"
              className="text-xs font-bold text-[#1E293B]"
            >
              Display order
            </label>
            <input
              id="displayOrder"
              type="number"
              min={0}
              max={9999}
              value={form.displayOrder}
              onChange={(event) =>
                updateForm("displayOrder", Number(event.target.value))
              }
              className={textInputClass}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-xs font-semibold text-[#1E293B]">
            <input
              type="checkbox"
              checked={form.isSubPartner}
              onChange={(event) =>
                updateForm("isSubPartner", event.target.checked)
              }
              className="h-4 w-4 rounded border-[#E2E8F0] accent-[#1D3557]"
            />
            This is a sub-partner
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-[#1E293B]">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(event) =>
                updateForm("isPublished", event.target.checked)
              }
              className="h-4 w-4 rounded border-[#E2E8F0] accent-[#1D3557]"
            />
            Publish on public directory
          </label>
        </div>

        <button
          type="submit"
          disabled={isSaving || isUploadingLogo}
          className="mt-6 rounded-[10px] bg-[#1D3557] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#152742] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploadingLogo
            ? "Uploading logo..."
            : isSaving
            ? "Saving..."
            : form.id
            ? "Save changes"
            : "Create partner"}
        </button>
      </form>

      {/* Directory Records List */}
      <div className="pt-2">
        <h2 className="text-lg font-bold text-[#1E293B]">Existing Partners</h2>

        {isLoading ? (
          <p className="mt-4 text-xs text-[#64748B]">Loading partners…</p>
        ) : partners.length === 0 ? (
          <p className="mt-4 text-xs text-[#64748B]">No partner records found.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {partners.map((partner) => (
              <article
                key={partner.id}
                className="bg-white p-5 rounded-[20px] border border-[#E2E8F0] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#1E293B]">
                        {partner.name}
                      </h3>

                      <p className="mt-1 text-xs text-[#64748B]">
                        Order: {partner.display_order}
                        {partner.is_sub_partner ? " · Sub-partner" : ""}
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        partner.is_published
                          ? "bg-[#10B981]/10 text-[#10B981]"
                          : "bg-[#F1F5F9] text-[#64748B]"
                      }`}
                    >
                      {partner.is_published ? "Published" : "Draft"}
                    </span>
                  </div>

                  {partner.description && (
                    <p className="mt-3 text-xs text-[#64748B] leading-relaxed line-clamp-3">
                      {partner.description}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex gap-4 border-t border-[#E2E8F0] pt-3">
                  <button
                    type="button"
                    onClick={() => editPartner(partner)}
                    className="text-xs font-bold text-[#1D3557] hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => void deletePartner(partner)}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}