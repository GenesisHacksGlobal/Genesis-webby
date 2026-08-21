import { LANDING } from "@shared/constants/testIds";

/**
 * Mega-menu destinations are standalone routes only — never home-section scrolls.
 */
export const NAV_MENUS = [
  {
    id: "about",
    label: "About",
    testid: LANDING.navAbout,
    layout: "split-3-2",
    columns: [
      {
        category: "Overview/",
        items: [
          {
            title: "About Genesis",
            desc: "Who we are and what we build",
            kind: "route",
            target: "/about",
            testid: LANDING.navAbout,
          },
          {
            title: "Our Values",
            desc: "What we stand for as a community",
            kind: "route",
            target: "/values",
            testid: LANDING.navLoop,
          },
          {
            title: "Meet the Team",
            desc: "The builders behind Genesis",
            kind: "route",
            target: "/team",
            testid: LANDING.navTeam,
          },
          {
            title: "Events",
            desc: "Meetups, hackathons, and gatherings",
            kind: "route",
            target: "/events",
            testid: LANDING.navEvents,
          },
          {
            title: "Organizer Guide",
            desc: "Master playbooks, budgets & checklists",
            kind: "route",
            target: "/guide",
          },
        ],
      },
      {
        category: "Connect/",
        major: true,
        items: [
          {
            title: "Contact Us",
            desc: "Reach the Genesis team",
            kind: "route",
            target: "/contact",
            testid: LANDING.navContact,
          },
          {
            title: "Partner / Collaborate",
            desc: "Sponsor or co-host with us",
            kind: "route",
            target: "/partner",
          },
          {
            title: "Work at Genesis",
            desc: "Join the crew — roles and collabs",
            kind: "route",
            target: "/careers",
          },
        ],
      },
    ],
  },
  {
    id: "events",
    label: "Events",
    testid: LANDING.navEvents,
    columns: [
      {
        category: "Upcoming/",
        items: [
          {
            title: "Hackers Occupied Pune",
            desc: "Live Countdown Timer & 43-Slot Event Schedule",
            kind: "route",
            target: "/events/hackers-occupied-pune",
          },
          {
            title: "Headline event",
            desc: "Next offline gathering — RSVP open",
            kind: "route",
            target: "/events",
          },
        ],
      },
      {
        category: "Programme/",
        items: [
          {
            title: "Full events",
            desc: "Browse the complete programme",
            kind: "route",
            target: "/events",
            testid: LANDING.navEvents,
          },
          {
            title: "Past editions",
            desc: "Hackathons and meetups archive",
            kind: "route",
            target: "/events",
          },
        ],
      },
      {
        category: "Archive/",
        items: [
          {
            title: "Meetups & hackathons",
            desc: "Beyond the Code, Supernova, and more",
            kind: "route",
            target: "/events",
          },
        ],
      },
      {
        category: "Join/",
        items: [
          {
            title: "Register Now",
            desc: "Register for Hackers Occupied Pune on HackCulture",
            external: true,
            target: "https://hackculture.io/hackathons/hackers-occupied-pune",
          },
        ],
      },
    ],
  },
  {
    id: "gallery",
    label: "Gallery",
    testid: LANDING.navGallery,
    columns: [
      {
        category: "Capture/",
        items: [
          {
            title: "Infinite field",
            desc: "Immersive WebGL gallery",
            kind: "route",
            target: "/gallery",
          },
        ],
      },
      {
        category: "Moments/",
        items: [
          {
            title: "Community frames",
            desc: "Stills from meetups and builds",
            kind: "route",
            target: "/gallery",
          },
        ],
      },
      {
        category: "On site/",
        items: [
          {
            title: "Event stills",
            desc: "Photos from the programme",
            kind: "route",
            target: "/gallery",
          },
        ],
      },
      {
        category: "Share/",
        items: [
          {
            title: "Contact",
            desc: "Send photos or collab ideas",
            kind: "route",
            target: "/contact",
          },
        ],
      },
    ],
  },
  {
    id: "community",
    label: "Community",
    testid: LANDING.navContact,
    columns: [
      {
        category: "Talk/",
        items: [
          {
            title: "Contact Us",
            desc: "Message the Genesis crew",
            kind: "route",
            target: "/contact",
            testid: LANDING.navContact,
          },
          {
            title: "Partner / Collaborate",
            desc: "Sponsorship & campus chapter inquiries",
            kind: "route",
            target: "/partner",
          },
        ],
      },
      {
        category: "Gather/",
        items: [
          {
            title: "Events",
            desc: "Show up IRL — hackathons & meetups",
            kind: "route",
            target: "/events",
          },
          {
            title: "Work at Genesis",
            desc: "Join our team & builder collective",
            kind: "route",
            target: "/careers",
          },
        ],
      },
      {
        category: "Story/",
        items: [
          {
            title: "About",
            desc: "Builders across India",
            kind: "route",
            target: "/about",
          },
          {
            title: "Our Values",
            desc: "How we keep momentum",
            kind: "route",
            target: "/values",
          },
          {
            title: "Team Directory",
            desc: "Meet the organizers & leads",
            kind: "route",
            target: "/team",
          },
        ],
      },
      {
        category: "Media & Resources/",
        items: [
          {
            title: "Organizer Guide",
            desc: "Hackathon playbooks & toolkits",
            kind: "route",
            target: "/guide",
          },
          {
            title: "Gallery",
            desc: "See the community in motion",
            kind: "route",
            target: "/gallery",
          },
        ],
      },
    ],
  },
  {
    id: "partner",
    label: "Partner",
    testid: "nav-partner",
    columns: [
      {
        category: "Collaborate/",
        items: [
          {
            title: "Member Event Application",
            desc: "Join the Genesis Hackathon Season & unlock benefits",
            kind: "route",
            target: "/event-membership",
          },
          {
            title: "Partner With Us",
            desc: "Submit sponsorship or campus proposals",
            kind: "route",
            target: "/partner",
          },
        ],
      },
      {
        category: "Join Us/",
        items: [
          {
            title: "Work With Us",
            desc: "Apply to join team or contribute",
            kind: "route",
            target: "/careers",
          },
        ],
      },
      {
        category: "Reach Out/",
        items: [
          {
            title: "Contact Us",
            desc: "Direct messages and support",
            kind: "route",
            target: "/contact",
          },
        ],
      },
    ],
  },
];
