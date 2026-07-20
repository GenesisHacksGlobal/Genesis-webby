import React from 'react';

const DEFAULT_MEMBERS = [
  // Leadership
  { name: 'Aryan Sharma', role: 'Founder & CEO', dept: 'Leadership', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { name: 'Priya Nair', role: 'Chief Technology Officer', dept: 'Leadership', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80' },
  { name: 'Rahul Verma', role: 'Head of Events', dept: 'Leadership', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { name: 'Sneha Kapoor', role: 'Lead Designer', dept: 'Leadership', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80' },

  // Engineering
  { name: 'Karan Mehta', role: 'Backend Engineer', dept: 'Engineering', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
  { name: 'Varun Singh', role: 'Frontend Engineer', dept: 'Engineering', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80' },
  { name: 'Rohan Bhat', role: 'AI & ML Lead', dept: 'Engineering', avatar: 'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=400&auto=format&fit=crop&q=80' },
  { name: 'Ankit Dubey', role: 'DevRel Engineer', dept: 'Engineering', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80' },

  // Operations & Design
  { name: 'Dev Malhotra', role: 'Community Lead', dept: 'Operations & Design', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80' },
  { name: 'Meera Joshi', role: 'Workshop Coordinator', dept: 'Operations & Design', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
  { name: 'Tanya Gupta', role: 'Brand Strategist', dept: 'Operations & Design', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80' },
  { name: 'Ishita Sen', role: 'Legal & Compliance', dept: 'Operations & Design', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80' },

  // Growth & Marketing
  { name: 'Aisha Patel', role: 'Partnerships Director', dept: 'Growth & Marketing', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { name: 'Nisha Rao', role: 'Content & Media Lead', dept: 'Growth & Marketing', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80' },
  { name: 'Sahil Khanna', role: 'Growth Hacker', dept: 'Growth & Marketing', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80' },
  { name: 'Pooja Iyer', role: 'Web3 Evangelist', dept: 'Growth & Marketing', avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=400&auto=format&fit=crop&q=80' },
];

export default function TeamSection({ members = DEFAULT_MEMBERS, title = "Our team" }) {
  // Group members by department
  const depts = [...new Set(members.map(m => m.dept || 'General'))];

  return (
    <section className="py-12 md:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {title && (
          <div className="mb-12 border-b border-white/10 pb-6 flex items-end justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand)]">GENESIS DIRECTORY</span>
              <h2 className="text-4xl font-display uppercase tracking-tight text-white md:text-5xl mt-1">{title}</h2>
            </div>
            <span className="font-mono text-xs text-white/30">{members.length} MEMBERS</span>
          </div>
        )}

        <div className="space-y-12">
          {depts.map((deptName) => {
            const deptMembers = members.filter(m => (m.dept || 'General') === deptName);
            return (
              <div key={deptName} className="space-y-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-mono uppercase tracking-wider text-white/90 font-medium">{deptName}</h3>
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="font-mono text-[11px] text-[var(--brand)]">{deptMembers.length}</span>
                </div>

                <div className="grid grid-cols-2 gap-6 md:grid-cols-4 pt-2">
                  {deptMembers.map((member, index) => (
                    <div key={index} className="group flex flex-col items-start p-3 rounded-2xl transition-all duration-300 hover:bg-white/[0.03] border border-transparent hover:border-white/10">
                      <div className="bg-white/5 size-20 rounded-full border border-white/15 p-0.5 shadow-lg overflow-hidden group-hover:scale-105 group-hover:border-[var(--brand)] transition-all">
                        <img
                          className="aspect-square size-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          src={member.avatar}
                          alt={member.name}
                          height="460"
                          width="460"
                          loading="lazy"
                        />
                      </div>
                      <span className="mt-3 block text-sm font-sans font-medium text-white group-hover:text-[var(--heading)] transition-colors">
                        {member.name}
                      </span>
                      <span className="text-white/40 block text-xs font-mono mt-0.5">
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
