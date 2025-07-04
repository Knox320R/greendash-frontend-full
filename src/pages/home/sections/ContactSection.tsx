import React from 'react';
import { motion } from 'framer-motion';

interface ContactSectionProps {
  isAuthenticated: boolean;
  supportEmail?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({ isAuthenticated, supportEmail }) => (
  <section className="py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-700 mb-8 bg-gradient-to-b from-gray-50 to-white">Contact Us</h2>
        <p className="text-lg text-gray-500">Have questions or want to get in touch? Fill out the form below and our team will respond promptly.</p>
      </div>
      <form className="bg-white rounded-md shadow-lg p-8 space-y-6">
        <div>
          <label htmlFor="contact-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <motion.input
            id="contact-title"
            name="title"
            type="text"
            required
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500 shadow-sm"
            placeholder="Message Title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <motion.textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500 shadow-sm resize-none"
            placeholder="How can we help you?"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className={`inline-block px-8 py-4 rounded-md bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-400/50 cursor-pointer ${!isAuthenticated ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={!isAuthenticated}
          >
            Send Message
          </button>
          {!isAuthenticated && (
            <div className="mt-2 text-sm text-red-600">You must be logged in to send a message.</div>
          )}
        </div>
      </form>
      {supportEmail && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Or email us at <a href={`mailto:${supportEmail}`} className="text-green-600 underline">{supportEmail}</a>
        </div>
      )}
    </div>
  </section>
);

export default ContactSection; 