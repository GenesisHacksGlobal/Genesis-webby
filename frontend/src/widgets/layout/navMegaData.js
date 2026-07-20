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
            title: "Events",
            desc: "Meetups, hackathons, and gatherings",
            kind: "route",
            target: "/events",
            testid: LANDING.navEvents,
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
            title: "Reserve seat",
            desc: "Confirm your spot for the next session",
            kind: "route",
            target: "/events",
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
            title: "Contact",
            desc: "Message the Genesis crew",
            kind: "route",
            target: "/contact",
            testid: LANDING.navContact,
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
            title: "Reserve seat",
            desc: "Lock in the next session",
            kind: "route",
            target: "/events",
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
        ],
      },
      {
        category: "Media/",
        items: [
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
];
