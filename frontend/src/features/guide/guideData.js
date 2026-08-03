/**
 * Hackathon Organizer Guide Data Store
 * Modeled after MLH Guide (https://guide.mlh.com/) adapted for Genesis community standards.
 */

export const GUIDE_CATEGORIES = [
  {
    id: "introduction",
    title: "Introduction",
    icon: "BookOpen",
    articles: [
      {
        slug: "overview",
        title: "Overview",
        desc: "Welcome to the ultimate Hackathon Organizer Guide",
        readTime: "3 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "A comprehensive manual for organizing world-class hackathons",
          heroText: "Whether you are hosting a 100-person campus event or a 1,000+ hacker flagship conference, this guide provides proven frameworks, checklists, and operational playbooks to turn your vision into an unforgettable experience.",
          sections: [
            {
              id: "what-is-this-guide",
              title: "What is this guide?",
              text: "Organizing a hackathon can be daunting. There are dozens of moving pieces: venue security, sponsor relations, catering, hardware labs, judging algorithms, and hacker safety. This guide consolidates years of organizer knowledge into an accessible, step-by-step handbook.",
              callout: {
                type: "tip",
                title: "Pro Tip",
                text: "Bookmark this guide and share it with your co-organizers during your initial kickoff meeting!"
              }
            },
            {
              id: "how-to-use-it",
              title: "How to use this guide",
              text: "You can read this guide end-to-end if you are planning your very first event, or jump directly to specific modules using the left navigation or Ctrl+K search.",
              checklist: [
                { id: "step-1", text: "Bookmark the Master Organizer Checklist under Resources", checked: false },
                { id: "step-2", text: "Assign functional team leads (Logistics, Tech, Sponsorship, Marketing)", checked: false },
                { id: "step-3", text: "Review the Hackathon Timeline (6-month operational calendar)", checked: false }
              ]
            }
          ]
        }
      },
      {
        slug: "what-is-a-hackathon",
        title: "What is a Hackathon?",
        desc: "An introduction to the spirit of invention marathons",
        readTime: "4 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "An invention marathon where passion meets rapid prototyping",
          heroText: "A hackathon is best described as an 'invention marathon'. Anyone with an interest in technology, design, or problem-solving comes together to learn, build, and share their creations over the course of 24–48 hours in a welcoming atmosphere.",
          videoEmbed: {
            title: "Genesis Presents: What is a Hackathon?",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            caption: "Watch our 3-minute overview video on the hacker mindset."
          },
          sections: [
            {
              id: "the-core-philosophy",
              title: "The Core Philosophy",
              text: "Hackathons are not about winning prize money or writing production-grade enterprise software. They are about empowering participants to push their creative boundaries, experiment with fresh tech stacks, and bond with like-minded builders."
            },
            {
              id: "who-attends",
              title: "Who attends hackathons?",
              text: "You don't need to be a Computer Science major or a veteran developer! Great teams combine programmers, UI/UX designers, hardware tinkerers, project strategists, and domain specialists.",
              callout: {
                type: "note",
                title: "Inclusivity First",
                text: "Over 40% of hackers at Genesis community events are first-time participants. Designing workshops and beginner tracks is crucial for community growth."
              }
            }
          ]
        }
      },
      {
        slug: "what-is-genesis-mlh",
        title: "What is Genesis & MLH?",
        desc: "Understanding hacker movement ecosystems",
        readTime: "3 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Building platforms for the next generation of creators",
          heroText: "Major League Hacking (MLH) and Genesis India form the backbone of the student developer ecosystem—supporting hundreds of events and over 100,000 hackers globally each year.",
          sections: [
            {
              id: "ecosystem-support",
              title: "Ecosystem Support",
              text: "We assist organizer teams by providing mentorship, hardware lab kits, domain vouchers, judging software integration, and sponsorship connections."
            }
          ]
        }
      },
      {
        slug: "genesis-hackcon",
        title: "Genesis Hackcon",
        desc: "The premier conference for hackathon organizers",
        readTime: "3 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Connecting organizers, sharing playbooks, and elevating hacker culture",
          heroText: "Genesis Hackcon is the annual conference for community leaders, student organizers, and hacker advocates. Learn best practices, swap organizing stories, and attend operational workshops.",
          sections: [
            {
              id: "why-attend",
              title: "Why Attend Hackcon?",
              text: "Connect with over 300 veteran organizers from top universities and tech communities. Gain insights into sponsor negotiation, conflict resolution, and venue management."
            }
          ]
        }
      },
      {
        slug: "community-values",
        title: "Community Values",
        desc: "Safety, inclusion, and the hacker code of conduct",
        readTime: "5 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Fostering a safe, welcoming, and empowering environment for all",
          heroText: "Every Genesis-supported hackathon must strictly enforce a robust Code of Conduct. Harassment-free experiences for everyone regardless of gender, sexual orientation, disability, ethnicity, or background are non-negotiable.",
          sections: [
            {
              id: "code-of-conduct",
              title: "Enforcing the Code of Conduct",
              text: "Ensure your website links clearly to your Code of Conduct, display physical posters at venue check-in, and designate an Incident Response Lead on your team available 24/7.",
              callout: {
                type: "warning",
                title: "Mandatory Safety Requirement",
                text: "Always provide an anonymous report form and a direct emergency phone number during the event!"
              }
            }
          ]
        }
      }
    ]
  },
  {
    id: "event-types",
    title: "Event Types",
    icon: "Layers",
    articles: [
      {
        slug: "digital-events",
        title: "Digital Events",
        desc: "Hosting virtual and online hackathons",
        readTime: "5 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Connecting global hackers across time zones",
          heroText: "Digital hackathons break geographical barriers, allowing hackers worldwide to collaborate online through Discord, video streams, and digital helpdesks.",
          sections: [
            {
              id: "digital-stack",
              title: "Recommended Digital Tech Stack",
              text: "Use Discord for real-time team matching and voice channels, YouTube/Twitch for keynotes and ceremonies, and Devpost/HackCulture for project submissions."
            },
            {
              id: "engagement",
              title: "Keeping Digital Engagement High",
              text: "Virtual fatigue is real! Host frequent 15-minute mini-events (Trivia, Gaming sessions, Quiz nights) and establish active mentor voice channels."
            }
          ]
        }
      },
      {
        slug: "in-person-events",
        title: "In-Person Events",
        desc: "The magic of 24-48 hour physical gatherings",
        readTime: "6 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Creating immersive, high-energy venue environments",
          heroText: "There is nothing quite like the electric atmosphere of hundreds of hackers in a single space sharing pizza at 2 AM while shipping software together.",
          sections: [
            {
              id: "venue-essentials",
              title: "Venue Essentials",
              text: "Ensure 24/7 building access, reliable gigabit Wi-Fi, 1 outlet per hacker minimum, gender-neutral restrooms, and quiet sleeping areas."
            }
          ]
        }
      },
      {
        slug: "hybrid-events",
        title: "Hybrid Events",
        desc: "Combining physical venues with online participation",
        readTime: "4 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "The best of both worlds with dual submission tracks",
          heroText: "Hybrid hackathons allow local participants to hack in person while remote participants submit and present virtually.",
          sections: [
            {
              id: "fairness",
              title: "Ensuring Judging Fairness",
              text: "Run separate judging queues or virtual video rooms to ensure remote teams receive equal evaluation time compared to floor expo tables."
            }
          ]
        }
      }
    ]
  },
  {
    id: "general-information",
    title: "General Information",
    icon: "Calendar",
    articles: [
      {
        slug: "hackathon-timeline",
        title: "Hackathon Timeline",
        desc: "The 6-month operational master roadmap",
        readTime: "8 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "From initial concept to post-event wrapup",
          heroText: "Planning a successful event requires a structured timeline. Here is the standard 24-week countdown followed by top organizing committees.",
          sections: [
            {
              id: "timeline-breakdown",
              title: "Phase-by-Phase Roadmap",
              text: "Follow this checklist to stay on schedule without last-minute panic.",
              checklist: [
                { id: "m6", text: "Month 6: Form organizing core team & set event date goals", checked: false },
                { id: "m5", text: "Month 5: Finalize budget & launch sponsorship prospectus", checked: false },
                { id: "m4", text: "Month 4: Secure venue contract & launch teaser website", checked: false },
                { id: "m3", text: "Month 3: Open hacker applications & launch marketing campaign", checked: false },
                { id: "m2", text: "Month 2: Confirm sponsors, judges, keynotes, and swag orders", checked: false },
                { id: "m1", text: "Month 1: Send RSVPs, finalize catering, print badges & signage", checked: false },
                { id: "w1", text: "Week 1: Packing run, AV dry run, mentor briefing", checked: false }
              ]
            }
          ]
        }
      },
      {
        slug: "finding-date-and-purpose",
        title: "Finding the Date & Purpose",
        desc: "Avoiding scheduling conflicts and defining your theme",
        readTime: "4 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Strategic scheduling for maximum attendance",
          heroText: "Choosing the wrong date can destroy attendance. Cross-check university exam schedules, major holidays, and competing regional tech events before locking in your date.",
          sections: [
            {
              id: "date-checklist",
              title: "Date Selection Checklist",
              text: "Check academic calendars for midterms and finals, national holidays, local weather patterns, and major tech conference dates."
            }
          ]
        }
      },
      {
        slug: "build-leadership-team",
        title: "Build Your Leadership Team",
        desc: "Structuring functional organizing committees",
        readTime: "5 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Empowering team leads with clear ownership",
          heroText: "A great hackathon is built by a tight-knit team. Divide responsibilities into clear domains with single points of contact (DRI).",
          sections: [
            {
              id: "core-roles",
              title: "Core Organizing Domains",
              text: "1. Lead Director (Overall vision & sync)\n2. Logistics Director (Venue, catering, AV, security)\n3. Sponsorship Lead (Funding, partner relations)\n4. Tech & Web Lead (Platform, registration system, Wi-Fi)\n5. Marketing & Design Lead (Socials, branding, swag)\n6. Hacker Experience Lead (Mentors, mini-events, judging)"
            }
          ]
        }
      },
      {
        slug: "locking-down-a-venue",
        title: "Locking Down a Venue",
        desc: "Facility requirements, contracts, and power setup",
        readTime: "6 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Finding and securing the perfect home for your event",
          heroText: "Your venue sets the tone for the entire event. Ensure your space has 24/7 access approvals, HVAC ventilation, and robust electrical infrastructure.",
          sections: [
            {
              id: "power-network",
              title: "Power & Gigabit Networking",
              text: "Never assume a normal classroom can power 50 laptops per outlet bank! Work with venue facility engineers to deploy distribution boxes (distro boxes) and multi-circuit drop cables.",
              callout: {
                type: "important",
                title: "Power Rule of Thumb",
                text: "Calculate 150W per hacker. A 300-person hackathon needs approximately 45,000 Watts of continuous power distribution!"
              }
            }
          ]
        }
      },
      {
        slug: "hackathon-budgeting",
        title: "Hackathon Budgeting",
        desc: "Financial planning, line items, and reserve funds",
        readTime: "7 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Balancing revenue and expenses with complete transparency",
          heroText: "A healthy budget ensures you never run out of food, swag, or emergency reserves.",
          sections: [
            {
              id: "budget-breakdown",
              title: "Standard Expense Allocations",
              text: "- Food & Beverage: 40-45%\n- Swag & Shirts: 15-20%\n- Travel & Logistics: 15%\n- Prizes & Hardware: 10%\n- Audio/Visual & Security: 10%\n- Emergency Reserve: 5-10%"
            }
          ]
        }
      }
    ]
  },
  {
    id: "getting-sponsorship",
    title: "Getting Sponsorship",
    icon: "DollarSign",
    articles: [
      {
        slug: "sponsorship-overview",
        title: "Sponsorship Overview",
        desc: "Fundraising strategy and tier structures",
        readTime: "6 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Connecting corporate partners with top developer talent",
          heroText: "Sponsors fund your event to recruit top talent, drive developer adoption of their APIs/SDKs, and build brand affinity among student creators.",
          sections: [
            {
              id: "value-props",
              title: "What Sponsors Care About",
              text: "Tailor your pitch to what company representatives care about: HR teams want resumes and interview access; Developer Relations teams want API usage and project submissions."
            }
          ]
        }
      },
      {
        slug: "prospectus-creation",
        title: "Prospectus Creation",
        desc: "Designing a high-converting sponsorship deck",
        readTime: "5 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Crafting a clean, compelling 3-page proposal",
          heroText: "Your sponsorship deck is your first impression. Keep it crisp, visually stunning, and focused on past metrics.",
          sections: [
            {
              id: "deck-structure",
              title: "Essential Deck Sections",
              text: "1. Cover & Vision\n2. Key Demographics & Past Statistics (Hackers count, schools, diversity, projects built)\n3. Tier Comparison Table (Title, Gold, Silver, Bronze)\n4. Custom Add-ons (Meal sponsorship, Hardware lab, Lounge naming)\n5. Contact & Payment Info"
            }
          ]
        }
      },
      {
        slug: "pitching-sponsors",
        title: "Pitching Sponsors",
        desc: "Outreach campaigns, follow-ups, and closing contracts",
        readTime: "6 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Turning cold emails into long-term community partnerships",
          heroText: "Start your outreach 4 to 6 months in advance. Target University Recruiter and Developer Advocate titles on LinkedIn.",
          sections: [
            {
              id: "outreach-tips",
              title: "Outreach Best Practices",
              text: "Keep initial cold emails under 150 words. Highlight your expected hacker headcount, university reach, and unique track opportunities."
            }
          ]
        }
      }
    ]
  },
  {
    id: "hackathon-website",
    title: "Hackathon Website",
    icon: "Globe",
    articles: [
      {
        slug: "accessible-design",
        title: "Making an Accessible Design",
        desc: "WCAG compliance, mobile UX, and high contrast",
        readTime: "4 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Designing for every hacker on all screen sizes",
          heroText: "Your website is the front door of your event. Ensure proper color contrast, ARIA tags, screen reader support, and keyboard navigability.",
          sections: [
            {
              id: "accessibility-rules",
              title: "Accessibility Checklist",
              text: "Maintain minimum 4.5:1 text contrast ratio, provide alt text on all images, ensure all buttons have accessible labels, and support keyboard tab navigation."
            }
          ]
        }
      },
      {
        slug: "placeholder-website",
        title: "Placeholder Website",
        desc: "Launching a high-converting teaser page early",
        readTime: "3 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Capturing early emails before registrations open",
          heroText: "Do not wait until your full site is ready! Launch a sleek single-page teaser with an email waitlist form 5 months before your event.",
          sections: [
            {
              id: "teaser-elements",
              title: "Teaser Elements",
              text: "Hero headline, tentative date and city, email newsletter subscribe form, sponsor outreach contact link."
            }
          ]
        }
      },
      {
        slug: "main-website",
        title: "Main Website",
        desc: "Full schedule, FAQs, sponsor grid, and application flow",
        readTime: "5 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "The central hub for hackers, mentors, and sponsors",
          heroText: "Your main website should answer every question a participant might ask within 2 clicks.",
          sections: [
            {
              id: "essential-sections",
              title: "Essential Sections",
              text: "- Hero Section & Register CTA\n- About & Mission Statement\n- Schedule & Tracks\n- Prizes & Sponsor Logos\n- FAQ Accordion\n- Code of Conduct & Footers"
            }
          ]
        }
      },
      {
        slug: "marketing-your-event",
        title: "Marketing Your Event",
        desc: "Social campaigns, campus ambassadors, and posters",
        readTime: "5 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Spreading the word across tech communities",
          heroText: "Combine online social momentum with physical campus ambassador programs for maximum application numbers.",
          sections: [
            {
              id: "ambassador-program",
              title: "Campus Ambassador Playbook",
              text: "Recruit student leads at neighboring universities to distribute flyers, post on class Discord servers, and host info sessions."
            }
          ]
        }
      }
    ]
  },
  {
    id: "event-logistics",
    title: "Event Logistics",
    icon: "Truck",
    articles: [
      {
        slug: "managing-registrations",
        title: "Managing Registrations",
        desc: "Applications, ticketing, RSVPs, and check-in flows",
        readTime: "5 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Streamlining application reviews and attendance confirmation",
          heroText: "Over-book registrations by 20-30% to account for standard drop-off rates on event day.",
          sections: [
            {
              id: "rsvp-strategy",
              title: "RSVP Strategy",
              text: "Send acceptance notifications in waves. Require hackers to confirm RSVPs 7 days before the event so waitlisted applicants can be promoted."
            }
          ]
        }
      },
      {
        slug: "judging-and-submissions",
        title: "Judging & Submissions",
        desc: "Expo style judging, scoring rubrics, and platforms",
        readTime: "7 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Fair, transparent, and efficient project evaluations",
          heroText: "Expo-style (science fair) judging is superior to stage presentations for large hackathons—allowing every team to demo their project multiple times to judges.",
          sections: [
            {
              id: "rubric-standards",
              title: "Standard Judging Rubric",
              text: "1. Technical Complexity (25%)\n2. Design & User Experience (25%)\n3. Originality & Innovation (25%)\n4. Utility & Impact (25%)"
            }
          ]
        }
      },
      {
        slug: "hackathon-scheduling",
        title: "Hackathon Scheduling",
        desc: "Crafting a high-energy 24-36 hour agenda",
        readTime: "5 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Balancing hacking time, workshops, and rest",
          heroText: "Ensure long uninterrupted hacking blocks while weaving in fun mini-events and technical workshops.",
          sections: [
            {
              id: "sample-schedule",
              title: "Sample 24-Hour Agenda",
              text: "Day 1 09:00 AM - Check-in & Breakfast\nDay 1 11:00 AM - Opening Ceremony\nDay 1 12:00 PM - Hacking Begins & Team Building\nDay 1 01:30 PM - Lunch & Sponsor Workshops\nDay 1 07:00 PM - Dinner\nDay 1 10:00 PM - Cup Stacking Mini-Event\nDay 2 00:00 AM - Midnight Pizza & Gaming\nDay 2 08:00 AM - Breakfast\nDay 2 12:00 PM - Hacking Ends & Submissions Due\nDay 2 01:00 PM - Science Fair Judging Expo\nDay 2 04:00 PM - Closing Ceremony & Awards"
            }
          ]
        }
      },
      {
        slug: "mentorship",
        title: "Mentorship",
        desc: "Onboarding and organizing technical mentors",
        readTime: "4 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Empowering hackers with expert technical guidance",
          heroText: "Mentors are the unsung heroes of hackathons. Recruit senior engineers, alumni, and sponsor advocates to help stuck hackers debug issues.",
          sections: [
            {
              id: "mentor-queue",
              title: "Help Desk Ticketing",
              text: "Use a dedicated Discord ticket bot or web app where hackers specify their table number, tech stack, and issue description for instant mentor dispatch."
            }
          ]
        }
      },
      {
        slug: "day-of-logistics",
        title: "Day-of Logistics & Hacker Experience",
        desc: "On-site operations, meals, swag, and emergency response",
        readTime: "6 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Keeping the energy high and operations flawless",
          heroText: "Detail your run-of-show minute by minute. Assign walkie-talkies or dedicated Slack emergency channels to core staff.",
          sections: [
            {
              id: "hacker-delight",
              title: "Hacker Experience Essentials",
              text: "Keep water stations full, maintain clean restrooms, hand out snacks every 4 hours, and provide earplugs/sleeping masks in designated rest areas."
            }
          ]
        }
      },
      {
        slug: "after-the-event",
        title: "After the Event",
        desc: "Post-mortems, metrics, winner follow-ups, and thank-yous",
        readTime: "4 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Closing the loop and building community momentum",
          heroText: "Your work is not done when the closing ceremony ends! Send thank-you notes to sponsors, process prize payouts promptly, and host a team retrospective.",
          sections: [
            {
              id: "post-event-checklist",
              title: "Post-Event Checklist",
              text: "Send attendee survey, publish winner project showcase, distribute tax receipts to sponsors, process reimbursements, and write an internal retrospective document."
            }
          ]
        }
      }
    ]
  },
  {
    id: "hardware-guide",
    title: "Hardware Hackathon Guide",
    icon: "Cpu",
    articles: [
      {
        slug: "hardware-intro",
        title: "Hardware Introduction",
        desc: "Why host hardware & IoT hackathons?",
        readTime: "5 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Combining physical electronics with software intelligence",
          heroText: "Hardware hackathons allow participants to build physical gadgets, robotics, wearables, and smart home IoT systems using microcontrollers and sensors.",
          sections: [
            {
              id: "unique-aspects",
              title: "What Makes Hardware Special",
              text: "Hardware hackers need physical workbenches, soldering stations, component check-out counters, 3D printers, and safety gear."
            }
          ]
        }
      },
      {
        slug: "hardware-labs-resources",
        title: "Hardware Labs & Setup",
        desc: "Equipment inventories, component check-out, and safety",
        readTime: "7 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Setting up a safe and fully equipped hardware lab",
          heroText: "Provide a diverse inventory of microcontrollers (Arduino, Raspberry Pi, ESP32), sensor kits, wire strippers, breadboards, and soldering equipment.",
          sections: [
            {
              id: "safety-protocols",
              title: "Mandatory Safety Rules",
              text: "Always require safety goggles in soldering areas, provide fume extractors, maintain a first aid burn kit, and prohibit high-voltage main grid hacking without approval.",
              callout: {
                type: "warning",
                title: "Safety First",
                text: "Assign dedicated, trained hardware lab managers to monitor soldering stations at all times!"
              }
            }
          ]
        }
      }
    ]
  },
  {
    id: "organizer-resources",
    title: "Organizer Resources",
    icon: "Tool",
    articles: [
      {
        slug: "template-links",
        title: "Template Links",
        desc: "Downloadable budgets, decks, and run-of-show docs",
        readTime: "3 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Battle-tested templates ready for your event",
          heroText: "Save hundreds of hours with ready-to-use Google Docs, Sheets, and Canva templates.",
          sections: [
            {
              id: "resources-grid",
              title: "Free Downloadable Assets",
              text: "Click any resource link below to make a copy in your Google Drive:",
              resourceLinks: [
                { title: "Master Hackathon Budget Spreadsheet (Google Sheets)", url: "#" },
                { title: "Sponsorship Prospectus Deck Template (Canva/PPT)", url: "#" },
                { title: "Run-of-Show & AV Master Schedule (Google Docs)", url: "#" },
                { title: "Day-of Volunteer Shift Roster (Google Sheets)", url: "#" },
                { title: "Emergency Incident Log & Report Form", url: "#" }
              ]
            }
          ]
        }
      },
      {
        slug: "host-exciting-mini-events",
        title: "Host Exciting Mini-Events",
        desc: "Cup stacking, Slides Karaoke, Esports, and trivia ideas",
        readTime: "4 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Unforgettable side activities to recharge hackers",
          heroText: "Mini-events break up intense coding sessions, relieve stress, and create fun memories.",
          sections: [
            {
              id: "popular-activities",
              title: "Top 5 Crowd Favorites",
              text: "1. Cup Stacking Challenge (Fastest team to build a 50-cup pyramid)\n2. Slides Karaoke (Hackers present random 5-slide decks they've never seen before)\n3. Midnight Cupcake Decorating\n4. Smash Bros / Valorant Tournament\n5. Tech Trivia & Meme Contest"
            }
          ]
        }
      },
      {
        slug: "software-for-hackathons",
        title: "Software for Hackathons",
        desc: "The recommended organizing tech stack",
        readTime: "4 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Tools that automate your operations",
          heroText: "Leverage software to automate ticketing, team matching, Discord moderation, and submission management.",
          sections: [
            {
              id: "stack-recommendations",
              title: "Recommended Tools",
              text: "- Project Submissions: Devpost / HackCulture\n- Community & Chat: Discord / Slack\n- Registration & Ticketing: Genesis Portal / Luma / Eventbrite\n- Mentorship: HelpQueue / Discord Ticket Bot\n- Live Stream: OBS Studio + YouTube Live"
            }
          ]
        }
      },
      {
        slug: "contributors",
        title: "Contributors",
        desc: "Acknowledgements and community maintainers",
        readTime: "2 min read",
        lastUpdated: "August 2026",
        content: {
          subtitle: "Built by organizers, for organizers",
          heroText: "This guide is maintained by the Genesis India Organizers Network and community contributors across the world.",
          sections: [
            {
              id: "contribute-back",
              title: "Want to contribute?",
              text: "Have a playbook, template, or operational guide to add? Submit a pull request on GitHub or contact the Genesis core team!"
            }
          ]
        }
      }
    ]
  }
];

/** Helper to flatten all articles for global search */
export const ALL_GUIDE_ARTICLES = GUIDE_CATEGORIES.flatMap((cat) =>
  cat.articles.map((art) => ({
    ...art,
    categoryId: cat.id,
    categoryTitle: cat.title
  }))
);

/** Helper to find an article by category and slug */
export function getGuideArticle(catId, slug) {
  const category = GUIDE_CATEGORIES.find((c) => c.id === catId);
  if (!category) return null;
  const article = category.articles.find((a) => a.slug === slug);
  if (!article) return null;
  return { article, category };
}

/** Helper to find adjacent (prev/next) articles */
export function getAdjacentArticles(catId, slug) {
  const flattened = ALL_GUIDE_ARTICLES;
  const currentIndex = flattened.findIndex(
    (item) => item.categoryId === catId && item.slug === slug
  );
  if (currentIndex === -1) return { prev: null, next: null };
  const prev = currentIndex > 0 ? flattened[currentIndex - 1] : null;
  const next = currentIndex < flattened.length - 1 ? flattened[currentIndex + 1] : null;
  return { prev, next };
}
