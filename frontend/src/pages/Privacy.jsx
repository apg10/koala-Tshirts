export default function Privacy() {
  return (
    <div className="prose max-w-3xl mx-auto px-6 py-12">
      <h1>Privacy Policy</h1>
      <p>
        Koala T-Shirts respects your privacy and handles personal information in
        accordance with the Australian Privacy Principles (APPs) under the Privacy Act 1988 (Cth).
      </p>

      <h2>What we collect</h2>
      <p>
        We may collect your name, contact details, delivery address, order details,
        and payment confirmation metadata (payments are processed by our payment provider).
      </p>

      <h2>How we use your information</h2>
      <p>
        To fulfil orders, process payments, provide customer support, communicate about your order,
        and improve our services. We do not sell personal information.
      </p>

      <h2>Storage & security</h2>
      <p>
        We take reasonable steps to protect personal information from misuse, interference, loss,
        unauthorised access, modification or disclosure.
      </p>

      <h2>Cookies</h2>
      <p>
        We use essential and analytics cookies to operate the website and understand usage.
      </p>

      <h2>Access & correction</h2>
      <p>
        You may request access to, or correction of, your personal information by contacting us.
      </p>

      <h2>Overseas disclosure</h2>
      <p>
        Our service providers may store data in other countries. Where this occurs, we take reasonable
        steps to ensure appropriate safeguards are in place.
      </p>

      <h2>Complaints</h2>
      <p>
        If you have concerns about how we handle your information, contact us. If unresolved,
        you may contact the Office of the Australian Information Commissioner (OAIC).
      </p>

      <h2>Contact</h2>
      <p>Email: privacy@koalatees.example</p>

      <p>Last updated: {new Date().toLocaleDateString()}</p>
    </div>
  );
}
