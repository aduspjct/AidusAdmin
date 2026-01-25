import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Aidus",
  description:
    "Terms of Service for Aidus. Effective January 11, 2026. Please read these terms carefully before using our services.",
};

export default function TermsOfServicePage() {
  return (
    <main
      className="min-h-screen bg-white text-[#1a1a1a]"
      style={{
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <article className="mx-auto w-full max-w-[1000px] px-4 py-12 sm:px-6 sm:py-16 md:px-8">
        <div className="break-words [overflow-wrap:anywhere]">
          {/* Main Title - very dark, near-black, centered */}
          <h1 className="mb-2 text-center text-2xl font-bold text-[#1a1a1a] sm:text-3xl">
            Terms of Service
          </h1>
          <p className="mb-1 text-center text-base text-[#1a1a1a]">
            Effective Date: January 11, 2026
          </p>
          <p className="mb-8 text-center text-base leading-relaxed text-[#1a1a1a]">
            <strong>IMPORTANT:</strong> By using this app, you agree to these
            Terms of Service. Please read them carefully before proceeding.
          </p>

          <hr className="my-8 border-t border-neutral-200" />

          {/* Summary of Key Terms - section heading in medium-dark blue */}
          <h2 className="mb-3 text-xl font-bold text-[#336699]">
            Summary of Key Terms
          </h2>
          <p className="mb-4 leading-relaxed">
            Before you dive into the full terms, here&apos;s what you&apos;re
            agreeing to:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 leading-relaxed">
            <li>
              <strong>We&apos;re a marketplace</strong> connecting customers
              with service professionals - we don&apos;t provide services
              ourselves
            </li>
            <li>
              You must be <strong>18+</strong> to use this app
            </li>
            <li>
              Service professionals are <strong>independent contractors</strong>
              , not our employees
            </li>
            <li>
              <strong>$1.99 fee per service booking</strong> - charged when you
              initiate a service request
            </li>
            <li>
              Disputes go to <strong>arbitration</strong> (not court) and you
              can&apos;t join class actions
            </li>
            <li>
              We <strong>limit our liability</strong> for issues with services
              provided through the platform
            </li>
            <li>
              <strong>You&apos;re responsible</strong> for vetting and hiring
              professionals
            </li>
          </ul>


          <hr className="my-8 border-t border-neutral-200" />

          {/* 1. About This Agreement */}
          <h2 className="mb-4 text-xl font-bold text-[#336699]">
            1. About This Agreement
          </h2>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Who We Are
          </h3>
          <p className="mb-4 leading-relaxed">
            This app is operated by [YOUR COMPANY NAME] (&quot;Company,&quot;
            &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            What This Covers
          </h3>
          <p className="mb-4 leading-relaxed">
            These Terms govern your use of our mobile application and related
            services (the &quot;App&quot;). By creating an account or using the
            App, you agree to these Terms and our Privacy Policy.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Age and Eligibility Requirements
          </h3>
          <p className="mb-4 leading-relaxed">
            You must be at least 18 years old and legally able to enter into
            contracts to use this App. By using the App, you confirm that you
            meet these requirements.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Changes to Terms
          </h3>
          <p className="mb-8 leading-relaxed">
            We may update these Terms from time to time. We&apos;ll notify you
            of material changes via the App or email. Continued use after
            changes means you accept the new Terms. Changes become effective
            upon posting or notification.
          </p>

          <hr className="my-8 border-t border-neutral-200" />

          {/* 2. What Our App Does */}
          <h2 className="mb-4 text-xl font-bold text-[#336699]">
            2. What Our App Does (And Doesn&apos;t Do)
          </h2>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            We&apos;re a Marketplace Platform
          </h3>
          <p className="mb-2 leading-relaxed">
            [APP NAME] is a marketplace that connects:
          </p>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>Customers - people seeking home services</li>
            <li>
              Professionals (or &quot;Pros&quot;) - independent service providers
            </li>
          </ul>
          <p className="mb-4 leading-relaxed">
            We are NOT a party to any agreement between you and a Pro. All
            agreements are strictly between Customers and Professionals.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            We Don&apos;t Provide Services
          </h3>
          <p className="mb-2 leading-relaxed">
            Service professionals are independent contractors, not our employees
            or agents. We do not:
          </p>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>Provide home services ourselves</li>
            <li>Employ, supervise, certify, or endorse Pros</li>
            <li>
              Guarantee the quality, safety, timing, pricing, or outcomes of any
              services
            </li>
            <li>Take responsibility for how services are performed</li>
            <li>Perform background checks unless explicitly stated</li>
          </ul>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Your Responsibility
          </h3>
          <ul className="mb-8 list-disc space-y-1 pl-6 leading-relaxed">
            <li>
              If you&apos;re a customer: You must research and vet Pros before
              hiring them, verify licenses and insurance, and make your own
              informed hiring decisions
            </li>
            <li>
              If you&apos;re a Pro: You must perform services professionally,
              maintain proper licensing and insurance, and comply with all
              applicable laws
            </li>
          </ul>

          <hr className="my-8 border-t border-neutral-200" />

          {/* 3. Your Account */}
          <h2 className="mb-4 text-xl font-bold text-[#336699]">
            3. Your Account
          </h2>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Creating an Account
          </h3>
          <p className="mb-2 leading-relaxed">
            To use the App, you&apos;ll need to create an account with accurate
            information. You agree to:
          </p>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>
              Provide truthful, accurate, current, and complete information
            </li>
            <li>Keep your information up to date</li>
            <li>Protect your password and maintain account security</li>
            <li>Not share your account with others</li>
            <li>Accept responsibility for all activity under your account</li>
            <li>Notify us immediately of any unauthorized use</li>
          </ul>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            One Account Only
          </h3>
          <p className="mb-4 leading-relaxed">
            You may only have one account unless we give you written permission
            for more.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Account Suspension and Termination
          </h3>
          <p className="mb-8 leading-relaxed">
            We reserve the right to suspend or terminate your account at any
            time if you violate these Terms, for any risk to the platform, or
            for any other reason. We&apos;re not liable for any consequences of
            termination.
          </p>

          <hr className="my-8 border-t border-neutral-200" />

          {/* 4. Rules of Use */}
          <h2 className="mb-4 text-xl font-bold text-[#336699]">
            4. Rules of Use
          </h2>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            What You CAN&apos;T Do
          </h3>
          <p className="mb-4 leading-relaxed">You agree NOT to:</p>
          <h4 className="mb-2 mt-4 text-base font-semibold text-[#336699]">
            General Prohibitions:
          </h4>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>Violate any laws or regulations</li>
            <li>Post false, misleading, or fraudulent information</li>
            <li>Harass, threaten, or abuse other users</li>
            <li>Impersonate anyone else</li>
            <li>Misrepresent your identity or services</li>
            <li>Use the App if you&apos;re under 18</li>
          </ul>
          <h4 className="mb-2 mt-4 text-base font-semibold text-[#336699]">
            Platform Integrity:
          </h4>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>
              Try to bypass the App to avoid paying fees or circumvent platform
              features
            </li>
            <li>Use bots, scrapers, or automated tools</li>
            <li>Hack, interfere with, or disrupt the App</li>
            <li>Access areas of the App you&apos;re not authorized to use</li>
            <li>Reverse engineer any part of the App</li>
          </ul>
          <h4 className="mb-2 mt-4 text-base font-semibold text-[#336699]">
            Content Violations:
          </h4>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>
              Post content that infringes copyrights or other intellectual
              property rights
            </li>
            <li>
              Post offensive, discriminatory, illegal, harmful, or malicious
              content
            </li>
            <li>
              Share other users&apos; personal information without permission
            </li>
            <li>Manipulate reviews or ratings</li>
            <li>Upload misleading or deceptive content</li>
          </ul>
          <h4 className="mb-2 mt-4 text-base font-semibold text-[#336699]">
            Enforcement
          </h4>
          <p className="mb-8 leading-relaxed">
            We may remove content or restrict access at our sole discretion
            without notice.
          </p>

          <hr className="my-8 border-t border-neutral-200" />

          {/* 5. For Service Professionals */}
          <h2 className="mb-4 text-xl font-bold text-[#336699]">
            5. For Service Professionals
          </h2>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Your Promises and Representations
          </h3>
          <p className="mb-2 leading-relaxed">
            By registering as a Pro, you represent and warrant that:
          </p>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>
              You have all required licenses, permits, certifications, and
              credentials
            </li>
            <li>You carry appropriate liability insurance</li>
            <li>You&apos;ll comply with all applicable laws and regulations</li>
            <li>The information you provide is accurate and complete</li>
            <li>
              You&apos;ll perform services in a professional and workmanlike
              manner
            </li>
          </ul>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            You&apos;re an Independent Contractor
          </h3>
          <p className="mb-2 leading-relaxed">
            You are NOT our employee, agent, or partner. You are solely
            responsible for:
          </p>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>Your own taxes and tax obligations</li>
            <li>
              Your own insurance (general liability, workers&apos; compensation,
              etc.)
            </li>
            <li>Compliance with all employment and labor laws</li>
            <li>Your business operations and legal compliance</li>
            <li>Required licenses and permits</li>
          </ul>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Leads and Inquiries
          </h3>
          <p className="mb-4 leading-relaxed">
            We&apos;ll make reasonable efforts to provide quality customer
            leads, but we don&apos;t guarantee the accuracy, validity, or
            quality of every inquiry. Check our Lead Credit Policy for
            information about eligible credits.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Reviews and Ratings
          </h3>
          <p className="mb-4 leading-relaxed">
            Customers may review your services. These reviews will be publicly
            visible. Don&apos;t attempt to manipulate, fake, or improperly
            influence reviews or ratings.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Professional Fees
          </h3>
          <p className="mb-2 leading-relaxed">You may be charged for:</p>
          <ul className="mb-8 list-disc space-y-1 pl-6 leading-relaxed">
            <li>Customer leads and inquiries</li>
            <li>Premium features or subscriptions</li>
            <li>Platform transaction fees on completed bookings</li>
            <li>Featured placement in search results</li>
            <li>Additional marketing services</li>
          </ul>
          <p className="mb-8 leading-relaxed">
            All fees will be clearly communicated before you incur them and are
            non-refundable unless required by law.
          </p>

          <hr className="my-8 border-t border-neutral-200" />

          {/* 6. For Customers */}
          <h2 className="mb-4 text-xl font-bold text-[#336699]">
            6. For Customers
          </h2>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Do Your Homework
          </h3>
          <p className="mb-2 leading-relaxed">You are solely responsible for:</p>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>Researching and vetting Pros before hiring</li>
            <li>
              Checking licenses, insurance, credentials, and references
            </li>
            <li>Verifying qualifications and experience</li>
            <li>Ensuring work complies with local permit requirements</li>
            <li>Making your own informed hiring decisions</li>
            <li>Entering into agreements with Service Professionals</li>
          </ul>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Reviews
          </h3>
          <p className="mb-2 leading-relaxed">
            You may post honest reviews based on your actual experience. Reviews
            must:
          </p>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>Be truthful and based on real experience</li>
            <li>Not be offensive, discriminatory, or defamatory</li>
            <li>Not violate anyone&apos;s rights</li>
            <li>Not be fake, misleading, or manipulated</li>
          </ul>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Be Professional
          </h3>
          <p className="mb-4 leading-relaxed">
            Treat Pros respectfully and communicate professionally. Harassment
            or abusive behavior will result in account termination.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Customer Fees
          </h3>
          <p className="mb-8 leading-relaxed">
            You will be charged a $1.99 service booking fee each time you
            initiate a service request through the App (see Section 9 for
            details).
          </p>

          <hr className="my-8 border-t border-neutral-200" />

          {/* 7. Content and Intellectual Property */}
          <h2 className="mb-4 text-xl font-bold text-[#336699]">
            7. Content and Intellectual Property
          </h2>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            We Own the App
          </h3>
          <p className="mb-4 leading-relaxed">
            Everything in the App (design, code, logos, text, images, features,
            functionality, etc.) belongs to us or our licensors and is protected
            by intellectual property laws. You can&apos;t copy, modify,
            distribute, or use any of it without permission.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Your Content
          </h3>
          <p className="mb-2 leading-relaxed">
            When you post photos, reviews, messages, or other content
            (&quot;User Content&quot;), you give us permission to use it to
            operate and promote the App.
          </p>
          <p className="mb-4 leading-relaxed">
            Specifically, you grant us a worldwide, royalty-free, non-exclusive,
            perpetual license to use, display, reproduce, modify, create
            derivative works, and distribute your content in connection with
            operating and promoting the App.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Your Promises About Content
          </h3>
          <p className="mb-2 leading-relaxed">
            You retain ownership of content you submit, but you represent and
            warrant that:
          </p>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>You own or have the necessary rights to submit User Content</li>
            <li>
              Your content doesn&apos;t violate anyone&apos;s rights (including
              intellectual property rights)
            </li>
            <li>Your content doesn&apos;t break any laws</li>
          </ul>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            We Can Remove Content
          </h3>
          <p className="mb-8 leading-relaxed">
            We can remove any content at any time for any reason, but
            we&apos;re not obligated to monitor or review everything posted by
            users.
          </p>

          <hr className="my-8 border-t border-neutral-200" />

          {/* 8. Privacy and Communications */}
          <h2 className="mb-4 text-xl font-bold text-[#336699]">
            8. Privacy and Communications
          </h2>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Privacy Policy
          </h3>
          <p className="mb-4 leading-relaxed">
            See our Privacy Policy (available in the App) for how we handle your
            personal information.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            We May Contact You
          </h3>
          <p className="mb-2 leading-relaxed">
            By using the App, you consent to receive communications from us via:
          </p>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>Service-related messages and account notifications</li>
            <li>App updates and feature announcements</li>
            <li>Marketing messages (you can opt out)</li>
          </ul>
          <p className="mb-4 leading-relaxed">
            We may send these via email, SMS, push notifications, or in-app
            messages.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Call/Message Monitoring
          </h3>
          <p className="mb-8 leading-relaxed">
            We may monitor, track, or record communications between users for
            quality assurance, fraud prevention, fee verification, and platform
            improvement purposes.
          </p>

          <hr className="my-8 border-t border-neutral-200" />

          {/* 9. Payments and Fees */}
          <h2 className="mb-4 text-xl font-bold text-[#336699]">
            9. Payments and Fees
          </h2>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Service Booking Fee
          </h3>
          <p className="mb-2 leading-relaxed">
            A $1.99 service booking fee is charged each time a Customer
            initiates a service request through the App. This mandatory
            platform fee:
          </p>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>
              Is charged per service booking (not per download or account)
            </li>
            <li>
              Applies to each new service request initiated through the
              platform
            </li>
            <li>
              Covers platform maintenance, customer support, payment
              processing, and access to the platform
            </li>
            <li>Is charged at the time of booking initiation</li>
            <li>
              Is non-refundable, regardless of whether:
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>The Pro accepts the booking</li>
                <li>The service is completed</li>
                <li>You&apos;re satisfied with the service</li>
                <li>You or the Pro cancels the booking</li>
              </ul>
            </li>
          </ul>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Service Professional Platform Fees
          </h3>
          <p className="mb-2 leading-relaxed">
            Service Professionals who use the App pay the following fees:
          </p>
          <h4 className="mb-2 mt-4 text-base font-semibold text-[#336699]">
            Platform Transaction Fee:
          </h4>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>
              A platform fee is charged on all bookings completed through the
              App
            </li>
            <li>
              The fee percentage or amount will be clearly disclosed before
              you accept a booking
            </li>
            <li>
              This fee covers platform operations, payment processing, and
              support services
            </li>
          </ul>
          <h4 className="mb-2 mt-4 text-base font-semibold text-[#336699]">
            Additional Fees May Include:
          </h4>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>Customer lead fees for inquiries</li>
            <li>Premium subscription features</li>
            <li>Featured placement in search results</li>
            <li>Additional marketing or promotional services</li>
          </ul>
          <p className="mb-4 leading-relaxed">
            All fees will be clearly communicated to you before you incur them.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Payment Processing
          </h3>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>
              The $1.99 booking fee and all platform fees are processed by our
              third-party payment processor
            </li>
            <li>
              You agree to comply with the terms and conditions of these
              payment processors
            </li>
            <li>
              Payment processing fees may apply and will be clearly disclosed
            </li>
            <li>
              You must provide and maintain valid payment information to use
              booking features
            </li>
          </ul>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Payments Between Customers and Pros
          </h3>
          <p className="mb-2 leading-relaxed">
            Payment arrangements between Customers and Service Professionals
            for actual services rendered may be:
          </p>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>
              Facilitated through the App (where we may charge a platform
              transaction fee), or
            </li>
            <li>Arranged directly between parties (outside the App)</li>
          </ul>
          <p className="mb-4 leading-relaxed">
            If payments are facilitated through the App, the platform fee will
            be deducted before funds are released to the Service Professional.
          </p>
          <p className="mb-4 leading-relaxed">
            We are not responsible for:
          </p>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>
              Disputes between Customers and Professionals regarding pricing
              or scope of work
            </li>
            <li>Refunds or chargebacks arising from services rendered</li>
            <li>
              Failures or errors caused by third-party payment processors
            </li>
          </ul>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            No Refunds
          </h3>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>
              The $1.99 service booking fee is non-refundable once a service
              request is initiated
            </li>
            <li>
              Platform fees paid by Service Professionals are non-refundable
              unless required by law
            </li>
            <li>
              Refunds for services between Customers and Pros are handled
              between those parties
            </li>
          </ul>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Failed Payments
          </h3>
          <p className="mb-4 leading-relaxed">
            If your payment method fails when initiating a booking, the
            service request will not be processed. You are responsible for
            maintaining valid payment information in your account.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Fee Changes
          </h3>
          <p className="mb-8 leading-relaxed">
            We reserve the right to change our fee structure with 30 days
            notice to all users. Continued use of the App after fee changes
            constitutes acceptance of the new fees.
          </p>

          <hr className="my-8 border-t border-neutral-200" />

          {/* 10. DISCLAIMERS */}
          <h2 className="mb-4 text-xl font-bold text-[#336699]">
            10. DISCLAIMERS - PLEASE READ CAREFULLY
          </h2>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            &quot;AS IS&quot; Service
          </h3>
          <p className="mb-2 leading-relaxed">
            THE APP IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;
            WITHOUT ANY WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. We
            don&apos;t guarantee or warrant that:
          </p>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>The App will always work perfectly or meet your requirements</li>
            <li>It will be error-free, uninterrupted, or secure</li>
            <li>Results will be accurate or reliable</li>
            <li>Defects will be corrected</li>
            <li>The App will have continuous availability or uptime</li>
          </ul>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            No Guarantee of Service Quality or Outcomes
          </h3>
          <p className="mb-2 leading-relaxed">
            WE MAKE NO REPRESENTATIONS, WARRANTIES, OR PROMISES ABOUT THE
            QUALITY, SAFETY, RELIABILITY, ACCURACY, OR ANY OTHER ASPECT OF
            SERVICES PROVIDED BY PROS. We don&apos;t:
          </p>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>Guarantee that Pros are licensed, insured, or qualified</li>
            <li>Verify the accuracy of all Pro information, profiles, or listings</li>
            <li>Endorse or recommend any specific Pro</li>
            <li>Take responsibility for services performed or their outcomes</li>
            <li>
              Warrant the truth, accuracy, or completeness of User Content,
              including reviews and ratings
            </li>
          </ul>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Use at Your Own Risk
          </h3>
          <p className="mb-2 leading-relaxed">
            You use the App and hire Pros entirely at your own risk. We&apos;re
            not responsible for:
          </p>
          <ul className="mb-8 list-disc space-y-1 pl-6 leading-relaxed">
            <li>The quality, safety, or outcomes of services provided</li>
            <li>Disputes between users</li>
            <li>Injuries, death, or property damage</li>
            <li>Fraud, misconduct, or criminal acts by users</li>
            <li>Content posted by users</li>
            <li>
              Accuracy of listings, profiles, or representations
            </li>
          </ul>

          <hr className="my-8 border-t border-neutral-200" />

          {/* 11. LIMITATION OF LIABILITY */}
          <h2 className="mb-4 text-xl font-bold text-[#336699]">
            11. LIMITATION OF LIABILITY
          </h2>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Maximum Liability
          </h3>
          <p className="mb-4 leading-relaxed">
            TO THE FULLEST EXTENT ALLOWED BY LAW: Our total liability to you
            for anything related to the App or these Terms will not exceed the
            total amount you paid us in the past 12 months.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            What We&apos;re Not Liable For
          </h3>
          <p className="mb-2 leading-relaxed">WE ARE NOT LIABLE FOR:</p>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>
              Indirect, incidental, special, consequential, or punitive damages
            </li>
            <li>Lost profits, revenue, or business opportunities</li>
            <li>Lost data or information</li>
            <li>Business interruption or downtime</li>
            <li>
              Personal injury, death, or property damage related to services
            </li>
            <li>Actions or omissions of Pros or Customers</li>
            <li>Unauthorized access to your account</li>
            <li>Errors, omissions, or inaccuracies in the App</li>
            <li>The actions or omissions of other users</li>
          </ul>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            State Law Variations
          </h3>
          <p className="mb-8 leading-relaxed">
            Some jurisdictions don&apos;t allow the exclusion or limitation of
            certain warranties or liabilities, so the above limitations may not
            apply to you to the extent prohibited by applicable law.
          </p>

          <hr className="my-8 border-t border-neutral-200" />

          {/* 12. Indemnification */}
          <h2 className="mb-4 text-xl font-bold text-[#336699]">
            12. Your Responsibility to Us (Indemnification)
          </h2>
          <p className="mb-4 leading-relaxed">
            You agree to defend, indemnify, and hold harmless the Company
            (including our officers, directors, employees, agents, and
            affiliates) from and against any and all claims, lawsuits, damages,
            losses, liabilities, costs, and expenses (including reasonable
            attorneys&apos; fees) arising from or related to:
          </p>
          <ul className="mb-8 list-disc space-y-1 pl-6 leading-relaxed">
            <li>Your use of the App</li>
            <li>Services you provide or receive through the App</li>
            <li>Your violation of these Terms</li>
            <li>
              Your violation of others&apos; rights (including intellectual
              property, privacy, or other rights)
            </li>
            <li>Content you post or submit</li>
            <li>Your interactions with other users</li>
          </ul>

          <hr className="my-8 border-t border-neutral-200" />

          {/* 13. DISPUTE RESOLUTION */}
          <h2 className="mb-4 text-xl font-bold text-[#336699]">
            13. DISPUTE RESOLUTION - IMPORTANT
          </h2>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Binding Arbitration
          </h3>
          <p className="mb-2 leading-relaxed">
            PLEASE READ THIS CAREFULLY - IT AFFECTS YOUR LEGAL RIGHTS.
          </p>
          <p className="mb-2 leading-relaxed">
            Any dispute, claim, or controversy arising out of or relating to
            these Terms or your use of the App must be resolved through binding
            arbitration, not in court, except for:
          </p>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>Small claims court cases (under $10,000)</li>
            <li>Disputes about intellectual property rights</li>
            <li>
              Injunctive or equitable relief to prevent infringement or
              misappropriation
            </li>
          </ul>
          <p className="mb-4 leading-relaxed">
            Arbitration will be conducted by a single arbitrator in accordance
            with the rules of the American Arbitration Association (AAA) in
            [YOUR CITY, STATE].
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            NO CLASS ACTIONS
          </h3>
          <p className="mb-4 leading-relaxed">
            YOU WAIVE THE RIGHT TO PARTICIPATE IN CLASS ACTION LAWSUITS OR
            CLASS-WIDE ARBITRATION. You can only bring claims against us
            individually, not as part of any class, consolidated, or
            representative proceeding.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Arbitration Costs
          </h3>
          <p className="mb-4 leading-relaxed">
            Each party will bear its own costs of arbitration unless otherwise
            awarded by the arbitrator.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Opt-Out Option
          </h3>
          <p className="mb-4 leading-relaxed">
            You may opt out of this arbitration provision by sending written
            notice to [YOUR ADDRESS] within 30 days of accepting these Terms.
            Opting out will not affect other terms.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Governing Law
          </h3>
          <p className="mb-8 leading-relaxed">
            These Terms are governed by and construed in accordance with the
            laws of the State of [YOUR STATE], without regard to conflict of
            law principles.
          </p>

          <hr className="my-8 border-t border-neutral-200" />

          {/* 14. Other Important Terms */}
          <h2 className="mb-4 text-xl font-bold text-[#336699]">
            14. Other Important Terms
          </h2>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Termination
          </h3>
          <p className="mb-2 leading-relaxed">
            Either you or we can terminate your account at any time. Upon
            termination:
          </p>
          <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed">
            <li>Your right to use the App ends immediately</li>
            <li>
              Certain sections of these Terms survive (including liability
              limitations, arbitration, indemnification, and intellectual
              property provisions)
            </li>
            <li>We&apos;re not liable for any consequences of termination</li>
          </ul>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Third-Party Services and Links
          </h3>
          <p className="mb-4 leading-relaxed">
            The App may link to or integrate with third-party websites,
            services, or content that we don&apos;t own or control. We&apos;re
            not responsible for their content, policies, privacy practices, or
            actions.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Complete Agreement
          </h3>
          <p className="mb-4 leading-relaxed">
            These Terms and our Privacy Policy constitute the complete
            agreement between us regarding the App and supersede any prior
            agreements.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Assignment
          </h3>
          <p className="mb-4 leading-relaxed">
            You can&apos;t transfer or assign your rights under these Terms
            without our prior written consent. We can transfer or assign ours
            without restriction.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            No Waiver
          </h3>
          <p className="mb-4 leading-relaxed">
            If we don&apos;t enforce a provision of these Terms, that
            doesn&apos;t mean we waive the right to enforce it later or waive
            any other provision.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Severability
          </h3>
          <p className="mb-4 leading-relaxed">
            If any part of these Terms is found to be invalid, illegal, or
            unenforceable, the rest remains in full force and effect.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Force Majeure
          </h3>
          <p className="mb-4 leading-relaxed">
            We&apos;re not liable for any failure or delay in performance due
            to circumstances beyond our reasonable control, including acts of
            God, war, terrorism, riots, natural disasters, network failures,
            strikes, or government actions.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Electronic Communications
          </h3>
          <p className="mb-8 leading-relaxed">
            You agree that all agreements, notices, disclosures, and
            communications we provide electronically satisfy any legal
            requirement that such communications be in writing.
          </p>

          <hr className="my-8 border-t border-neutral-200" />

          {/* 15. Copyright Complaints */}
          <h2 className="mb-4 text-xl font-bold text-[#336699]">
            15. Copyright Complaints (DMCA)
          </h2>
          <p className="mb-2 leading-relaxed">
            If you believe content on the App infringes your copyright,
            contact us at [DMCA EMAIL] with:
          </p>
          <ul className="mb-8 list-disc space-y-1 pl-6 leading-relaxed">
            <li>Identification and description of the copyrighted work</li>
            <li>Location of the infringing content in the App</li>
            <li>Your contact information</li>
            <li>
              A statement that you have a good faith belief that the use is
              unauthorized
            </li>
            <li>A statement of accuracy under penalty of perjury</li>
            <li>Your physical or electronic signature</li>
          </ul>

          <hr className="my-8 border-t border-neutral-200" />

          {/* 16. Special State Provisions */}
          <h2 className="mb-4 text-xl font-bold text-[#336699]">
            16. Special State Provisions
          </h2>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            California Users
          </h3>
          <p className="mb-4 leading-relaxed">
            California residents have additional rights under the California
            Consumer Privacy Act (CCPA) and other California laws. See our
            Privacy Policy for details.
          </p>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[#336699]">
            Other States
          </h3>
          <p className="mb-8 leading-relaxed">
            Additional state-specific terms may apply depending on your
            location. We will comply with applicable state consumer protection
            laws.
          </p>

          <hr className="my-8 border-t border-neutral-200" />

          {/* 17. Contact Us */}
          <h2 className="mb-4 text-xl font-bold text-[#336699]">
            17. Contact Us
          </h2>
          <p className="mb-2 leading-relaxed">
            Questions about these Terms?
          </p>
          <p className="mb-2 leading-relaxed">
            📧 Email: admin@trigonaconnect.com
          </p>
          <p className="mb-8 leading-relaxed">
            Company Information: Trigonaconnect LLC
          </p>

          <hr className="my-8 border-t border-neutral-200" />

          {/* Acknowledgment */}
          <h2 className="mb-4 text-xl font-bold text-[#336699]">
            Acknowledgment
          </h2>
          <p className="mb-4 leading-relaxed">
            BY CLICKING &quot;I AGREE,&quot; CREATING AN ACCOUNT, OR USING
            THIS APP, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE
            TO BE BOUND BY THESE TERMS OF SERVICE.
          </p>
          <p className="mb-2 leading-relaxed">
            You also acknowledge that you understand:
          </p>
          <ul className="mb-8 list-disc space-y-1 pl-6 leading-relaxed">
            <li>The $1.99 service booking fee is non-refundable</li>
            <li>
              Service professionals are independent contractors, not our
              employees
            </li>
            <li>We don&apos;t guarantee the quality or outcomes of any services</li>
            <li>Disputes will be resolved through binding arbitration</li>
            <li>You waive the right to participate in class actions</li>
          </ul>

          <p className="text-center text-sm text-neutral-600">
            Last Updated: January 11, 2026
          </p>
        </div>
      </article>
    </main>
  );
}
