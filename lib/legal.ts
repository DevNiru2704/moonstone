export type LegalSection = { id: string; title: string; body: string[] };
export type LegalDoc = { title: string; intro: string; introWidth: number; effective: string; sections: LegalSection[] };

const EMAIL = "moonstonemultimedia@gmail.com";
const PHONE = "+91 98743 25470";

/** The contact section has the same shape in both documents; the email and phone render as links. */
export const CONTACT = { email: EMAIL, phone: PHONE };

// Copy from Figma "Privacy Policy" (244:16274) and "Terms of Service" (244:16404). Ids are the section anchors (#cookies).
export const PRIVACY: LegalDoc = {
  title: "Privacy Policy",
  introWidth: 983, // Figma text box width in design px
  intro:
    "At Moonstone Multimedia, we respect your privacy and are committed to protecting your personal information. This policy outlines how we collect, use, and manage your information when you visit our website, engage with our services, or participate in our events and activities.",
  effective: "Effective Date: December 06, 2026",
  sections: [
    {
      id: "information-we-collect",
      title: "Information We Collect",
      body: [
        "We may collect personal details such as your name, email address, phone number, professional information, artist profiles, booking details, payment information, and data submitted through forms or enquiries. We may also collect photographs, videos, audio recordings, and technical information related to your website usage.",
      ],
    },
    {
      id: "how-we-use-your-information",
      title: "How We Use Your Information",
      body: [
        "We use your information to manage enquiries, artist relations, bookings, event registrations, collaborations, and production activities. We may also use it for promotional communications, service improvements, website security, and legal requirements.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies",
      body: [
        "Our website may use cookies to improve browsing experience, analyse traffic, and understand visitor behaviour. You can disable cookies through your browser settings, though some website features may be affected.",
      ],
    },
    {
      id: "sharing-of-information",
      title: "Sharing of Information",
      body: [
        "Moonstone Multimedia does not sell or rent your personal information. We may share relevant details with trusted artists, collaborators, event partners, ticketing platforms, payment providers, and service providers when required to deliver our services or meet legal obligations.",
      ],
    },
    {
      id: "media-usage",
      title: "Media Usage",
      body: [
        "Photographs, videos, and audio recordings captured during our events and productions may be used for promotional purposes across our website, social media, and other communication channels. For concerns regarding media usage, you may contact us directly.",
      ],
    },
    {
      id: "data-security",
      title: "Data Security",
      body: [
        "We take reasonable measures to protect your personal information from unauthorised access, misuse, disclosure, or loss. However, no online transmission or storage method can guarantee complete security.",
      ],
    },
    {
      id: "third-party-links-and-services",
      title: "Third Party Links and Services",
      body: [
        "Our website may contain links to external platforms and services. Moonstone Multimedia is not responsible for their privacy policies or practices. We recommend reviewing their policies before sharing personal information.",
      ],
    },
    {
      id: "your-rights",
      title: "Your Rights",
      body: [
        "You may request access to, correction, or deletion of your personal information, where legally permitted. You may also withdraw consent for promotional communications at any time by contacting us.",
      ],
    },
    {
      id: "childrens-privacy",
      title: "Children's Privacy",
      body: [
        "Our services are not intended for individuals under 18. We do not knowingly collect children's personal information without appropriate consent where required by law.",
      ],
    },
    {
      id: "changes-to-this-policy",
      title: "Changes to This Policy",
      body: [
        "We may update this Privacy Policy to reflect changes in our services or legal requirements. Any revisions will be published on this page with an updated effective date.",
      ],
    },
    {
      id: "contact-us",
      title: "Contact Us",
      body: ["For questions or concerns regarding this Privacy Policy or your personal information, please contact us at:"],
    },
  ],
};

export const TERMS: LegalDoc = {
  title: "Terms of Service",
  introWidth: 922,
  intro:
    "Welcome to Moonstone Multimedia. By accessing or using our website and services, you agree to comply with and be bound by the following Terms of Service. Please read these terms carefully before using our website.",
  effective: "Effective Date: December 06, 2026",
  sections: [
    {
      id: "acceptance-of-terms",
      title: "Acceptance of Terms",
      body: [
        "By accessing the Moonstone Multimedia website or using our services, you agree to these Terms of Service and our Privacy Policy.",
      ],
    },
    {
      id: "use-of-the-website",
      title: "Use of the Website",
      body: [
        "You agree to use our website for lawful purposes only. Any unauthorised access, fraudulent activity, misuse of content, or disruption of website functionality is prohibited.",
      ],
    },
    {
      id: "services-and-bookings",
      title: "Services and Bookings",
      body: [
        "Moonstone Multimedia offers services related to music production, artist management, marketing, creative collaborations, and event organisation. All bookings, registrations, and service engagements are subject to availability, confirmation, and agreed terms.",
      ],
    },
    {
      id: "payments-and-refunds",
      title: "Payments and Refunds",
      body: [
        "Payments for events, bookings, or services must be made through the approved payment methods. Cancellation and refund policies may vary depending on the service or event and will be communicated during the booking or confirmation process.",
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      body: [
        "All website content, including logos, graphics, photographs, videos, music, and written material, belongs to Moonstone Multimedia or its respective owners. Reproduction or commercial use without prior permission is prohibited.",
      ],
    },
    {
      id: "third-party-services",
      title: "Third-Party Services",
      body: [
        "Our services may involve external artists, venues, vendors, ticketing platforms, and other collaborators. Moonstone Multimedia is not responsible for independent third-party policies, actions, or service disruptions.",
      ],
    },
    {
      id: "limitation-of-liability",
      title: "Limitation of Liability",
      body: [
        "Moonstone Multimedia shall not be liable for losses, damages, cancellations, or disruptions arising from website usage, unforeseen circumstances, or third-party services. We aim to maintain accurate website information but do not guarantee uninterrupted or error-free access.",
      ],
    },
    {
      id: "user-responsibilities",
      title: "User Responsibilities",
      body: [
        "You agree to provide accurate information when using our services, making bookings, or submitting enquiries. You must not upload harmful, misleading, or unlawful content or misuse our platforms and services.",
      ],
    },
    {
      id: "privacy",
      title: "Privacy",
      body: [
        "Your use of our website and services is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information.",
      ],
    },
    {
      id: "changes-to-the-terms",
      title: "Changes to the Terms",
      body: [
        "Moonstone Multimedia reserves the right to update these Terms of Service at any time. Continued use of our website and services indicates acceptance of the revised terms.",
      ],
    },
    {
      id: "governing-law",
      title: "Governing Law",
      body: [
        "These Terms of Service shall be governed by the laws of India. Any disputes arising from the use of our website or services shall be subject to the jurisdiction of the appropriate courts in India.",
      ],
    },
    {
      id: "contact-us",
      title: "Contact Us",
      body: ["For questions or concerns regarding these Terms of Service, please contact us at:"],
    },
  ],
};
