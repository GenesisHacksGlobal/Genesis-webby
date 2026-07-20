import React from "react";
import LegalPage from "../shared/LegalPage";

const SECTIONS = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content: (
      <>
        <p>
          By accessing or using the Genesis website at{" "}
          <strong>genesis.dezhub.in</strong> (the "Site"), participating in any
          Genesis community programme, or interacting with any Genesis service,
          you confirm that you have read, understood, and agree to be bound by
          these Terms of Service ("Terms").
        </p>
        <p>
          If you do not agree with any part of these Terms, you must not access
          the Site or use our services. These Terms apply to all visitors, users,
          and anyone else who accesses or uses the Site.
        </p>
        <div className="legal-callout">
          <strong>Important:</strong> These Terms constitute a legally binding
          agreement between you and Genesis (operated by Dezhub, India). Please
          read them carefully before proceeding.
        </div>
      </>
    ),
  },
  {
    id: "description",
    title: "Description of Service",
    content: (
      <>
        <p>
          Genesis is a developer community platform that provides information
          about hackathons, workshops, meetups, and other technical events. We
          connect builders, makers, and technologists across India and beyond.
        </p>
        <p>Our services include, but are not limited to:</p>
        <ul className="legal-list">
          <li>Publishing event listings, schedules, and community updates</li>
          <li>Facilitating contact and communication with our team</li>
          <li>Showcasing community galleries, values, and mission content</li>
          <li>Providing career and opportunity information within our ecosystem</li>
        </ul>
        <p>
          <strong>Third-party platforms:</strong> Registration for events is
          often processed through third-party platforms such as Luma or Lu.ma.
          Activity on those platforms is governed by their respective terms of
          service and privacy policies, which are separate from and independent
          of these Terms.
        </p>
        <p>
          Event details, dates, and venues are subject to change. We endeavour to
          keep information accurate but cannot guarantee real-time correctness.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use",
    content: (
      <>
        <p>
          You agree to use the Site only for lawful purposes and in a manner that
          does not infringe the rights of others or restrict their use and
          enjoyment of the Site.
        </p>
        <p>Prohibited conduct includes:</p>
        <ul className="legal-list">
          <li>
            Automated scraping or crawling that degrades the availability or
            performance of the Site
          </li>
          <li>
            Introducing viruses, malware, ransomware, or other malicious code
          </li>
          <li>
            Attempting to gain unauthorised access to any part of the Site or
            its related systems
          </li>
          <li>
            Impersonating Genesis, its team members, or any other person or
            entity
          </li>
          <li>
            Harassing, threatening, or intimidating any community member online
            or offline
          </li>
          <li>
            Transmitting unsolicited commercial communications (spam) using any
            contact information obtained from the Site
          </li>
          <li>
            Using the Site in any way that could damage, disable, or overburden
            our infrastructure
          </li>
        </ul>
        <p>
          We reserve the right to restrict access to the Site at our sole
          discretion if we reasonably believe a violation of these Terms has
          occurred.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: (
      <>
        <p>
          All content on the Site — including but not limited to text, graphics,
          logos, photographs, videos, data compilations, and software — is the
          property of Genesis, Dezhub, or its content licensors and is protected
          by applicable intellectual property laws.
        </p>
        <p>
          <strong>What you may do:</strong> You may browse and view Site content
          for personal, non-commercial purposes. You may share links to pages on
          the Site, and you may quote brief excerpts for commentary or reporting
          provided you clearly attribute Genesis as the source.
        </p>
        <p>
          <strong>What you may not do:</strong> You may not reproduce, distribute,
          modify, create derivative works, publicly display, sell, or commercially
          exploit any content from the Site without our express prior written
          permission.
        </p>
        <div className="legal-callout">
          The "Genesis" name, logo, and related marks are trademarks of Dezhub.
          Unauthorised use of these marks is strictly prohibited.
        </div>
        <p>
          To request permission for any use not covered above, contact us at{" "}
          <a href="mailto:hello@dezhub.in">hello@dezhub.in</a>.
        </p>
      </>
    ),
  },
  {
    id: "user-content",
    title: "User-Submitted Content",
    content: (
      <>
        <p>
          If you submit any content to us (for example through the contact form,
          event applications, or community feedback), you grant Genesis a
          worldwide, non-exclusive, royalty-free licence to use, reproduce, and
          display that content solely for the purpose of operating and improving
          our services.
        </p>
        <p>You represent and warrant that:</p>
        <ul className="legal-list">
          <li>You own or have the rights to the content you submit</li>
          <li>
            Your content does not violate any third-party intellectual property,
            privacy, or publicity rights
          </li>
          <li>
            Your content is truthful and does not contain false or misleading
            information
          </li>
        </ul>
        <p>
          We reserve the right to remove or decline any submitted content at our
          discretion without notice.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers & Limitation of Liability",
    content: (
      <>
        <p>
          <strong>As-is provision.</strong> The Site and all its content are
          provided on an "as is" and "as available" basis, without any warranties
          of any kind, express or implied, including but not limited to warranties
          of merchantability, fitness for a particular purpose, accuracy, or
          non-infringement.
        </p>
        <p>
          <strong>No guarantee of availability.</strong> We do not warrant that
          the Site will be uninterrupted, error-free, secure, or free of viruses
          or other harmful components.
        </p>
        <p>
          <strong>Limitation of liability.</strong> To the fullest extent
          permitted by applicable law, Genesis and Dezhub shall not be liable for
          any indirect, incidental, special, consequential, or punitive damages
          arising out of or in connection with your use of (or inability to use)
          the Site, even if advised of the possibility of such damages.
        </p>
        <div className="legal-callout">
          Some jurisdictions do not allow the exclusion of certain warranties or
          the limitation of liability for certain types of damages. In such
          jurisdictions, our liability shall be limited to the maximum extent
          permitted by law.
        </div>
      </>
    ),
  },
  {
    id: "third-party-links",
    title: "Third-Party Links",
    content: (
      <>
        <p>
          The Site may contain links to third-party websites, platforms, or
          resources (including social media, event registration platforms, and
          sponsor websites). These links are provided for your convenience only.
        </p>
        <p>
          We have no control over and assume no responsibility for the content,
          privacy policies, terms, or practices of any third-party websites. We
          do not endorse or make any representations about such third-party sites.
          Your access to and use of linked websites is entirely at your own risk.
        </p>
        <p>
          We encourage you to review the terms and privacy policies of any
          third-party websites you visit.
        </p>
      </>
    ),
  },
  {
    id: "modifications",
    title: "Modifications to Terms",
    content: (
      <>
        <p>
          We reserve the right to update or modify these Terms at any time at our
          sole discretion. When we make changes, we will update the "Last updated"
          date at the top of this page.
        </p>
        <p>
          Your continued use of the Site following the posting of revised Terms
          constitutes your acceptance of the changes. We encourage you to review
          these Terms periodically to stay informed of any updates.
        </p>
        <p>
          If a change is material, we will endeavour to provide reasonable notice
          (for example, via a notice on the Site) before the new Terms take
          effect.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "Governing Law & Disputes",
    content: (
      <>
        <p>
          These Terms are governed by and construed in accordance with the laws of
          India, without regard to its conflict of law provisions. You agree that
          any legal action or dispute arising out of or related to these Terms or
          the Site shall be subject to the exclusive jurisdiction of the courts
          located in India.
        </p>
        <p>
          Before initiating any formal legal proceedings, we encourage you to
          first attempt to resolve any dispute informally by contacting us at{" "}
          <a href="mailto:hello@dezhub.in">hello@dezhub.in</a>. We will make good
          faith efforts to address your concerns.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact & Enquiries",
    content: (
      <>
        <p>
          If you have any questions, concerns, or requests relating to these Terms
          of Service, please reach out to us:
        </p>
        <ul className="legal-list">
          <li>
            Email:{" "}
            <a href="mailto:hello@dezhub.in">hello@dezhub.in</a>
          </li>
          <li>Website: genesis.dezhub.in</li>
          <li>Community: Genesis, operated by Dezhub, India</li>
        </ul>
        <p>
          We aim to respond to all enquiries within 5 business days.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      type="terms"
      sections={SECTIONS}
      lastUpdated="20 July 2026"
    />
  );
}
