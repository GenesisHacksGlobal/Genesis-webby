import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop',
];

export function AdminEventModal({ event, onSave, onClose }) {
  const isEditing = Boolean(event && event.id);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    kicker: '',
    category: 'Meetup',
    status: 'upcoming', // 'upcoming' | 'past'
    mode: 'In-Person',
    date: '',
    time: '10:00 AM – 5:00 PM IST',
    location: '',
    city: '',
    attendees: '150+',
    sponsors: '',
    blurb: '',
    image: PRESET_COVERS[0],
    luma: '',
    hosts: 'Genesis Community',
    prizePool: '',
  });

  const [imagePreview, setImagePreview] = useState(PRESET_COVERS[0]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        subtitle: event.subtitle || '',
        kicker: event.kicker || `Edition · ${new Date().getFullYear()}`,
        category: event.category || 'Meetup',
        status: event.status || 'upcoming',
        mode: event.mode || 'In-Person',
        date: event.date || '',
        time: event.time || '10:00 AM – 5:00 PM IST',
        location: event.location || '',
        city: event.city || '',
        attendees: event.attendees || '150+',
        sponsors: event.sponsors || '',
        blurb: event.blurb || '',
        image: event.image || PRESET_COVERS[0],
        luma: event.luma || '',
        hosts: event.hosts || 'Genesis Community',
        prizePool: event.prizePool || '',
      });
      setImagePreview(event.image || PRESET_COVERS[0]);
    }
  }, [event]);

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'image') {
      setImagePreview(value);
    }
  };

  // Handle File Upload (Thumbnail Base64 Conversion)
  const handleFileUpload = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Url = e.target.result;
      setFormData((prev) => ({ ...prev, image: base64Url }));
      setImagePreview(base64Url);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) {
      alert('Please fill in required fields: Event Title and Date.');
      return;
    }
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.94, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 20, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.4 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-[#0f0f15] border border-white/20 rounded-3xl overflow-hidden shadow-[0_50px_120px_rgba(0,0,0,0.9)] max-h-[90vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="px-8 py-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand)]">
              Admin Control Panel // Event Editor
            </span>
            <h2 className="font-display text-2xl text-white uppercase tracking-tight mt-0.5">
              {isEditing ? `Edit: ${event.title}` : 'Create New Event'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all bg-white/5"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6 flex-1">
          {/* Status Selection Pill Box (Upcoming vs Past) */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <label className="font-mono text-xs text-[var(--brand)] uppercase tracking-wider block font-bold">
              1. Categorize Event Status (Upcoming vs Past) *
            </label>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, status: 'upcoming' }))}
                className={`p-3 rounded-xl border font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  formData.status === 'upcoming'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Upcoming Event (Live / Open RSVP)
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, status: 'past' }))}
                className={`p-3 rounded-xl border font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  formData.status === 'past'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                    : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Past Event (Archived)
              </button>
            </div>
            <p className="text-[11px] font-sans text-white/40">
              * Selecting <strong>Upcoming</strong> automatically publishes this event to the homepage & Events page "Upcoming Events" section. Selecting <strong>Past</strong> categorizes it under "Past Events".
            </p>
          </div>

          {/* Basic Event Information */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[11px] uppercase tracking-wider text-white/60 block mb-1.5">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Supernova 3.0 Hackathon"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/12 text-sm text-white focus:outline-none focus:border-[var(--brand)] transition-colors"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase tracking-wider text-white/60 block mb-1.5">
                Subtitle / Tagline
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="e.g. 36-Hour National Developer Sprint"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/12 text-sm text-white focus:outline-none focus:border-[var(--brand)] transition-colors"
              />
            </div>
          </div>

          {/* Category & Mode & City */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-mono text-[11px] uppercase tracking-wider text-white/60 block mb-1.5">
                Category Track
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl bg-[#14141d] border border-white/12 text-sm text-white focus:outline-none focus:border-[var(--brand)]"
              >
                <option value="Hackathon">Hackathon</option>
                <option value="Meetup">Meetup</option>
                <option value="Workshop">Workshop</option>
                <option value="Bootcamp">Bootcamp</option>
                <option value="Ideathon">Ideathon</option>
              </select>
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase tracking-wider text-white/60 block mb-1.5">
                Event Mode
              </label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl bg-[#14141d] border border-white/12 text-sm text-white focus:outline-none focus:border-[var(--brand)]"
              >
                <option value="In-Person">In-Person (Offline)</option>
                <option value="Virtual">Virtual (Online)</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase tracking-wider text-white/60 block mb-1.5">
                City / Region
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Gurugram, HR"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/12 text-sm text-white focus:outline-none focus:border-[var(--brand)]"
              />
            </div>
          </div>

          {/* Dates & Venue Location */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[11px] uppercase tracking-wider text-white/60 block mb-1.5">
                Event Date *
              </label>
              <input
                type="text"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                placeholder="e.g. 25-26 August 2026"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/12 text-sm text-white focus:outline-none focus:border-[var(--brand)]"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase tracking-wider text-white/60 block mb-1.5">
                Event Timing
              </label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="e.g. 10:00 AM – 5:00 PM IST"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/12 text-sm text-white focus:outline-none focus:border-[var(--brand)]"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[11px] uppercase tracking-wider text-white/60 block mb-1.5">
              Full Location Address / Venue
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Thoughtworks Office, DLF Cyber City, Phase 2, Gurugram"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/12 text-sm text-white focus:outline-none focus:border-[var(--brand)]"
            />
          </div>

          {/* Thumbnail Image Upload Dropzone */}
          <div className="space-y-3">
            <label className="font-mono text-xs text-[var(--brand)] uppercase tracking-wider block font-bold">
              2. Event Thumbnail Image (Upload or Pick Preset) *
            </label>

            {/* Dropzone & Preview Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              {/* Image Preview Card */}
              <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-white/20 relative bg-black/60 shadow-lg">
                <img src={imagePreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur font-mono text-[9px] text-white/80">
                  Preview
                </span>
              </div>

              {/* Drag & Drop File Upload */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`sm:col-span-2 border-2 border-dashed rounded-2xl p-4 text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  dragActive ? 'border-[var(--brand)] bg-[var(--brand)]/10' : 'border-white/15 bg-white/[0.02] hover:border-white/30'
                }`}
              >
                <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs text-white font-mono">
                  Drag & Drop Image File here or{' '}
                  <label className="text-[var(--brand)] underline cursor-pointer">
                    Browse Computer
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    />
                  </label>
                </p>
                <span className="text-[10px] text-white/40 font-mono">Supports PNG, JPG, WEBP (auto-converted)</span>
              </div>
            </div>

            {/* Direct Image URL input */}
            <div>
              <span className="font-mono text-[10px] uppercase text-white/40 block mb-1">Or Paste Image URL</span>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white/80 focus:outline-none focus:border-[var(--brand)] font-mono"
              />
            </div>

            {/* Quick Presets Picker */}
            <div>
              <span className="font-mono text-[10px] uppercase text-white/40 block mb-1">Quick Select Preset Cover</span>
              <div className="flex gap-2 overflow-x-auto py-1">
                {PRESET_COVERS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, image: url }));
                      setImagePreview(url);
                    }}
                    className={`w-14 h-10 rounded-lg overflow-hidden border shrink-0 transition-transform ${
                      formData.image === url ? 'border-[var(--brand)] scale-105 ring-2 ring-[var(--brand)]/50' : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Preset ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description / Blurb */}
          <div>
            <label className="font-mono text-[11px] uppercase tracking-wider text-white/60 block mb-1.5">
              Event Description / Blurb
            </label>
            <textarea
              name="blurb"
              rows={3}
              value={formData.blurb}
              onChange={handleChange}
              placeholder="Describe the event highlight, agenda, tracks, and expected outcomes..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/12 text-sm text-white focus:outline-none focus:border-[var(--brand)]"
            />
          </div>

          {/* Registration Luma URL & Specifics */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[11px] uppercase tracking-wider text-white/60 block mb-1.5">
                Registration / Luma Link
              </label>
              <input
                type="text"
                name="luma"
                value={formData.luma}
                onChange={handleChange}
                placeholder="https://luma.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/12 text-sm text-white focus:outline-none focus:border-[var(--brand)] font-mono"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase tracking-wider text-white/60 block mb-1.5">
                Hosts / Organizing Team
              </label>
              <input
                type="text"
                name="hosts"
                value={formData.hosts}
                onChange={handleChange}
                placeholder="e.g. Genesis Community & DevRel"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/12 text-sm text-white focus:outline-none focus:border-[var(--brand)]"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="font-mono text-[11px] uppercase tracking-wider text-white/60 block mb-1.5">
                Sponsors & Partners
              </label>
              <input
                type="text"
                name="sponsors"
                value={formData.sponsors}
                onChange={handleChange}
                placeholder="e.g. Wormhole, Reskill, Azure"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/12 text-sm text-white focus:outline-none focus:border-[var(--brand)]"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase tracking-wider text-white/60 block mb-1.5">
                Attendees / Capacity
              </label>
              <input
                type="text"
                name="attendees"
                value={formData.attendees}
                onChange={handleChange}
                placeholder="e.g. 300+"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/12 text-sm text-white focus:outline-none focus:border-[var(--brand)]"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase tracking-wider text-white/60 block mb-1.5">
                Prize Pool (Optional)
              </label>
              <input
                type="text"
                name="prizePool"
                value={formData.prizePool}
                onChange={handleChange}
                placeholder="e.g. ₹50,000"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/12 text-sm text-white focus:outline-none focus:border-[var(--brand)]"
              />
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/15 text-white/70 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[var(--brand)] hover:bg-white text-black font-mono text-xs uppercase font-bold tracking-wider transition-colors shadow-[0_0_25px_rgba(196,181,253,0.4)]"
            >
              {isEditing ? 'Update Event Record' : 'Publish Event'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
