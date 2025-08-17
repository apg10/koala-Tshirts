import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ firstName:"", lastName:"", email:"", question:"" });

  const onChange = (e)=> setForm(prev=>({ ...prev, [e.target.name]: e.target.value }));
  const onSubmit = (e)=> { e.preventDefault(); alert("Thanks! (Demo form)"); };

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-2">Contact</h1>
        <p className="text-gray-600">We’d love to hear from you.</p>
      </header>

      <section className="page-wrapper grid md:grid-cols-2 gap-8">
        {/* Address + Phone + Map */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Our Office</h2>
          <p>ACBI – 416-418 Pitt St, Haymarket NSW 2000, Australia</p>
          <p>Phone: +61 2 9264 4438</p>
          <iframe
            title="ACBI Map"
            className="w-full h-64 rounded-xl border"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=ACBI%20416-418%20Pitt%20St%2C%20Haymarket%20NSW%202000%2C%20Australia&output=embed"
          />
        </div>

        {/* Form (first, last, email, question) */}
        <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First name</label>
              <input required name="firstName" value={form.firstName} onChange={onChange} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last name</label>
              <input required name="lastName" value={form.lastName} onChange={onChange} className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input required type="email" name="email" value={form.email} onChange={onChange} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Question</label>
            <textarea required name="question" rows={4} value={form.question} onChange={onChange} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold">Send</button>
        </form>
      </section>
    </div>
  );
}
