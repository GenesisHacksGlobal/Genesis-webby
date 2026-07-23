/**
 * Central Event Store & Management Service
 * Syncs events to LocalStorage and triggers real-time updates across the app.
 */

import { eventDatabase } from '@shared/data/eventDatabase';

const STORAGE_KEY = 'genesis_events_db';
const EVENT_UPDATE_SIGNAL = 'genesis_events_updated';

// Helper to check if string is URL
const isUrl = (s) => s && (s.startsWith('http://') || s.startsWith('https://'));

// Category Image Presets
const CAT_IMAGES = {
  hackathon: [
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',
  ],
  workshop: [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop',
  ],
  meetup: [
    'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop',
  ],
};

function getCategoryPreset(category, idx = 0) {
  const c = (category || '').toLowerCase();
  const pool = c.includes('hack') || c.includes('clash') || c.includes('code')
    ? CAT_IMAGES.hackathon
    : c.includes('work') || c.includes('boot')
    ? CAT_IMAGES.workshop
    : CAT_IMAGES.meetup;
  return pool[idx % pool.length];
}

// Initial seed events list
const SEED_EVENTS = [
  {
    id: 'evt-upcoming-01',
    title: 'No Agenda Meetup 2.0',
    subtitle: 'Hosted by Genesis Community',
    kicker: 'Edition · July 2026',
    date: '25 July 2026',
    time: '10:00 AM – 4:00 PM IST',
    location: 'Thoughtworks Office, Gurugram, HR',
    city: 'Gurugram',
    category: 'Meetup',
    status: 'upcoming', // 'upcoming' or 'past'
    mode: 'In-Person',
    attendees: '300+',
    sponsors: 'ID8{DEVHUB}, Reskill, TON',
    blurb: "Opportunities don't come to the best. They come to those who stand out. Six hours, one room, real briefs — no slides.",
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
    luma: 'https://luma.com/6nxec8uw?tk=Cw5Fsi',
    hosts: 'Genesis Team & Community',
    prizePool: '₹1,00,000',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-upcoming-02',
    title: 'Genesis Web3 HackSprint',
    subtitle: 'Cross-Chain Decentralized Hackathon',
    kicker: 'Edition · August 2026',
    date: '15-16 August 2026',
    time: '9:00 AM – 9:00 PM IST',
    location: 'Microsoft Office, Noida, UP',
    city: 'Noida',
    category: 'Hackathon',
    status: 'upcoming',
    mode: 'Hybrid',
    attendees: '500+',
    sponsors: 'Wormhole, Stellar, Azure',
    blurb: 'Build high-octane decentralized applications, cross-chain messaging solutions, and AI-infused web3 protocols.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop',
    luma: 'https://luma.com/6nxec8uw?tk=Cw5Fsi',
    hosts: 'Genesis DevRel',
    prizePool: '$10,000',
    createdAt: new Date().toISOString(),
  },
  ...eventDatabase
    .filter((e) => e.title && e.date && e.location && !e.title.startsWith('http'))
    .map((e, i) => {
      const yr = (e.date?.match(/20\d\d/) || [])[0] || (i % 2 === 0 ? '2024' : '2025');
      const parts = (e.location || '').split(',');
      const city = parts.length > 1 ? parts[parts.length - 1].trim() : (e.location || 'India');
      return {
        id: `evt-${e.id || i + 1}`,
        title: e.title,
        subtitle: e.sponsors && e.sponsors !== '-' ? `Sponsored by ${e.sponsors}` : 'Genesis Official Event',
        kicker: `Edition · ${yr}`,
        date: e.date,
        time: '10:00 AM – 5:00 PM IST',
        location: e.location,
        city,
        year: yr,
        category: e.category || 'Meetup',
        status: 'past', // Default seeded database items are past archive records
        mode: 'In-Person',
        attendees: e.attendees || '150+',
        sponsors: e.sponsors || 'Genesis Community',
        blurb: `${e.title} hosted at ${e.location}. Bringing together builders, designers, and engineers for high-impact collaboration.`,
        image: getCategoryPreset(e.category, i),
        luma: isUrl(e.media) ? e.media : 'https://luma.com/6nxec8uw?tk=Cw5Fsi',
        hosts: 'Genesis Community',
        prizePool: '-',
        createdAt: new Date().toISOString(),
      };
    }),
];

export const eventService = {
  /**
   * Fetch all events (merged from LocalStorage + Seed Data)
   */
  getEvents() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored events:', e);
    }
    // Save initial seed events if storage empty
    this.saveAll(SEED_EVENTS);
    return SEED_EVENTS;
  },

  /**
   * Save array of events to LocalStorage
   */
  saveAll(events) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      window.dispatchEvent(new Event(EVENT_UPDATE_SIGNAL));
    } catch (e) {
      console.error('Error saving events to storage:', e);
    }
  },

  /**
   * Get list of Upcoming Events
   */
  getUpcomingEvents() {
    return this.getEvents().filter((e) => e.status === 'upcoming');
  },

  /**
   * Get list of Past Events
   */
  getPastEvents() {
    return this.getEvents().filter((e) => e.status === 'past');
  },

  /**
   * Add a new Event
   */
  addEvent(eventData) {
    const events = this.getEvents();
    const newId = `evt-${Date.now()}`;
    const formattedEvent = {
      id: newId,
      title: eventData.title || 'Untitled Event',
      subtitle: eventData.subtitle || 'Genesis Official Event',
      kicker: eventData.kicker || `Edition · ${new Date().getFullYear()}`,
      date: eventData.date || 'TBA',
      time: eventData.time || '10:00 AM – 5:00 PM IST',
      location: eventData.location || 'Online',
      city: eventData.city || 'India',
      category: eventData.category || 'Meetup',
      status: eventData.status || 'upcoming', // 'upcoming' or 'past'
      mode: eventData.mode || 'In-Person',
      attendees: eventData.attendees || '100+',
      sponsors: eventData.sponsors || 'Genesis',
      blurb: eventData.blurb || 'Event description coming soon.',
      image: eventData.image || getCategoryPreset(eventData.category),
      luma: eventData.luma || 'https://luma.com/6nxec8uw?tk=Cw5Fsi',
      hosts: eventData.hosts || 'Genesis Team',
      prizePool: eventData.prizePool || '-',
      createdAt: new Date().toISOString(),
    };

    const updated = [formattedEvent, ...events];
    this.saveAll(updated);
    return formattedEvent;
  },

  /**
   * Update an existing Event
   */
  updateEvent(id, updatedFields) {
    const events = this.getEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) return null;

    const updatedEvent = {
      ...events[index],
      ...updatedFields,
      updatedAt: new Date().toISOString(),
    };

    events[index] = updatedEvent;
    this.saveAll(events);
    return updatedEvent;
  },

  /**
   * Toggle status between 'upcoming' and 'past'
   */
  toggleStatus(id) {
    const events = this.getEvents();
    const target = events.find((e) => e.id === id);
    if (target) {
      const newStatus = target.status === 'upcoming' ? 'past' : 'upcoming';
      return this.updateEvent(id, { status: newStatus });
    }
    return null;
  },

  /**
   * Delete an Event by ID
   */
  deleteEvent(id) {
    const events = this.getEvents();
    const filtered = events.filter((e) => e.id !== id);
    this.saveAll(filtered);
  },

  /**
   * Reset database back to default seed state
   */
  resetToDefaults() {
    this.saveAll(SEED_EVENTS);
    return SEED_EVENTS;
  },

  /**
   * Subscribe to real-time event updates across open components
   */
  subscribe(callback) {
    const handler = () => callback(this.getEvents());
    window.addEventListener(EVENT_UPDATE_SIGNAL, handler);
    return () => window.removeEventListener(EVENT_UPDATE_SIGNAL, handler);
  },
};
