import { NextResponse } from "next/server";
import { z } from "zod";

// Updated to use the async server client instead of the browser client
import { createClient } from "@/lib/supabase/server";

const registrationSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  organizationName: z
    .string()
    .trim()
    .min(1, "Organization is required")
    .max(200),
  subPartnerName: z.string().trim().max(200).optional().nullable(),
  roleTitle: z.string().trim().max(150).optional().nullable(),
  email: z.string().trim().email("Enter a valid email address").max(254),
  phone: z.string().trim().max(50).optional().nullable(),
  dietaryRequirements: z.string().trim().max(1000).optional().nullable(),
  accessibilityRequirements: z.string().trim().max(1000).optional().nullable(),
  travelRequirements: z.string().trim().max(1000).optional().nullable(),
  // Fixed TS2769: Changed invalid `errorMap` property to `.refine()` or `message`
  consentGiven: z.boolean().refine((val) => val === true, {
    message: "Consent is required to register.",
  }),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const result = registrationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Please correct the registration form.",
          fields: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = result.data;
    
    // Await the server client instance
    const supabase = await createClient();

    const { data: response, error } = await supabase.rpc(
      "register_attendee",
      {
        p_event_slug: "oak-partner-gathering-2026",
        p_first_name: data.firstName,
        p_last_name: data.lastName,
        p_organization_name: data.organizationName,
        p_sub_partner_name: data.subPartnerName || null,
        p_role_title: data.roleTitle || null,
        p_email: data.email,
        p_phone: data.phone || null,
        p_dietary_requirements: data.dietaryRequirements || null,
        p_accessibility_requirements: data.accessibilityRequirements || null,
        p_travel_requirements: data.travelRequirements || null,
        p_consent_given: data.consentGiven,
      }
    );

    if (error) {
      console.error("Registration RPC error:", error);

      return NextResponse.json(
        { error: "Registration could not be completed. Please try again." },
        { status: 500 }
      );
    }

    // Handles both array returns (SETOF/TABLE) and single object returns
    const attendee = Array.isArray(response) ? response[0] : response;

    if (!attendee) {
      console.error("No attendee data returned from RPC.");

      return NextResponse.json(
        { error: "Registration could not be completed. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        attendee: {
          id: attendee.attendee_id,
          fullName: attendee.full_name,
          organizationName: attendee.organization_name,
          qrToken: attendee.qr_token,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration route error:", error);

    return NextResponse.json(
      { error: "Invalid registration request." },
      { status: 400 }
    );
  }
}