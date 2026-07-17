import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const eventLocations = [
    {
        id: "INDL",
        stateName: "Delhi",
        x: 344.1,
        y: 320.0,
        event: {
            title: "Genesis Hack NCR",
            venue: "Microsoft Gurugram / Delhi",
            date: "Aug 2025",
            description: "Six hours, real briefs, live teardowns, no slides.",
        }
    },
    {
        id: "INMH",
        stateName: "Maharashtra",
        x: 305.7,
        y: 597.9,
        event: {
            title: "Mumbai Creator Meetup",
            venue: "WeWork Labs, Mumbai",
            date: "Nov 2024",
            description: "Staged like a chapter — moody, intimate, and collaborative.",
        }
    },
    {
        id: "INKA",
        stateName: "Karnataka",
        x: 302.1,
        y: 728.1,
        event: {
            title: "Genesis Bangalore Chapter",
            venue: "Indiranagar Social, Bangalore",
            date: "Mar 2025",
            description: "Connecting 100+ designers and builders in a day of design teardowns.",
        }
    },
    {
        id: "INTN",
        stateName: "Tamil Nadu",
        x: 379.6,
        y: 835.6,
        event: {
            title: "Chennai DevFest",
            venue: "IIT Madras Research Park",
            date: "Jan 2025",
            description: "Deep dive workshops into frontend architectures and UI design.",
        }
    },
    {
        id: "INTG",
        stateName: "Telangana",
        x: 396.7,
        y: 641.9,
        event: {
            title: "Hyderabad Web3 Meetup",
            venue: "T-Hub, Hyderabad",
            date: "Dec 2024",
            description: "Hands-on product building and pitch session with investors.",
        }
    },
    {
        id: "INWB",
        stateName: "West Bengal",
        x: 637.1,
        y: 485.8,
        event: {
            title: "Kolkata Hacking Arena",
            venue: "Salt Lake Sector V, Kolkata",
            date: "Oct 2024",
            description: "Freestyle code sprint and networking event for freelancers.",
        }
    },
    {
        id: "INRJ",
        stateName: "Rajasthan",
        x: 256.7,
        y: 375.8,
        event: {
            title: "Jaipur Design Summit",
            venue: "Jaipur Club, Jaipur",
            date: "Feb 2025",
            description: "Staged event focusing on branding and creative strategy.",
        }
    },
    {
        id: "INGJ",
        stateName: "Gujarat",
        x: 199.2,
        y: 481.0,
        event: {
            title: "Ahmedabad Tech Carnival",
            venue: "DevX, Ahmedabad",
            date: "May 2025",
            description: "Genesis roundtable on the future of design tools.",
        }
    },
    {
        id: "INUP",
        stateName: "Uttar Pradesh",
        x: 438.7,
        y: 375.5,
        event: {
            title: "Samvedna UX Workshop",
            venue: "Microsoft IDC, Noida",
            date: "Sep 2025",
            description: "Hands-on UX research workshop with Sachin Verma and Umesh.",
        }
    },
    {
        id: "INKL",
        stateName: "Kerala",
        x: 325.5,
        y: 848.9,
        event: {
            title: "Kochi Dev Hack",
            venue: "Maker Village, Kochi",
            date: "Jun 2025",
            description: "Freelancer portfolio review and live collaboration sprints.",
        }
    }
];

export default function EventMap() {
    const [paths, setPaths] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(eventLocations[0]);
    const [hoveredLocation, setHoveredLocation] = useState(null);

    useEffect(() => {
        fetch("/india.svg")
            .then((res) => res.text())
            .then((data) => {
                const pathRegex = /<path d="([^"]+)" id="([^"]+)" name="([^"]+)"[^>]*>/g;
                let match;
                const parsedPaths = [];
                while ((match = pathRegex.exec(data)) !== null) {
                    parsedPaths.push({
                        d: match[1],
                        id: match[2],
                        name: match[3],
                    });
                }
                setPaths(parsedPaths);
            })
            .catch((err) => console.error("Error loading India SVG map:", err));
    }, []);

    const activeLocation = hoveredLocation || selectedLocation;

    return (
        <div className="relative mt-28 md:mt-36 border border-[var(--border)] bg-[var(--surface)] p-6 md:p-12 overflow-hidden">
            <style>{`
                .pulsate-ring {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.8;
                    }
                    50% {
                        transform: scale(1.6);
                        opacity: 0.15;
                    }
                }
            `}</style>
            
            <div className="grid lg:grid-cols-12 gap-10 items-center">
                {/* Info and display side */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="block w-10 h-px bg-[var(--text-dim)]" />
                        <span className="overline">Interactive footprint</span>
                    </div>
                    
                    <h3 className="font-display text-5xl md:text-6xl tracking-tight leading-[0.95] text-[var(--heading)]">
                        Genesis <br />
                        Across India
                    </h3>
                    
                    <p className="mt-6 text-[var(--text-dim)] leading-relaxed max-w-[42ch]">
                        Hover over any pinpoint on the map to explore details about the chapters, workshops, hackathons, and community meetups we have hosted previously.
                    </p>

                    <div className="mt-10 min-h-[160px] relative">
                        <AnimatePresence mode="wait">
                            {activeLocation && (
                                <motion.div
                                    key={activeLocation.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-6 border border-[#c4b5fd]/35 bg-[rgba(8,2,18,0.45)] shadow-[0_15px_40px_-15px_rgba(196,181,253,0.18)]"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-[#c4b5fd]/10 text-[#c4b5fd] border border-[#c4b5fd]/20">
                                            {activeLocation.stateName}
                                        </span>
                                        <span className="font-mono text-xs text-[var(--text-faint)]">
                                            {activeLocation.event.date}
                                        </span>
                                    </div>
                                    <h4 className="font-display text-2xl text-[var(--heading)]">
                                        {activeLocation.event.title}
                                    </h4>
                                    <p className="text-xs text-[var(--text-dim)] font-mono mt-1">
                                        📍 {activeLocation.event.venue}
                                    </p>
                                    <p className="text-sm text-[var(--text-dim)] mt-3 leading-relaxed">
                                        {activeLocation.event.description}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Map side */}
                <div className="lg:col-span-7 relative flex items-center justify-center">
                    <div className="w-full max-w-[620px] aspect-square relative select-none">
                        {paths.length > 0 ? (
                            <svg
                                viewBox="0 0 1000 1000"
                                className="w-full h-full"
                                style={{ transform: "translate3d(0,0,0)" }}
                            >
                                <g id="features">
                                    {paths.map((path) => {
                                        const isActiveState = activeLocation && activeLocation.id === path.id;
                                        const hasEvent = eventLocations.some((loc) => loc.id === path.id);
                                        return (
                                            <path
                                                key={path.id}
                                                d={path.d}
                                                id={path.id}
                                                name={path.name}
                                                className="transition-all duration-300"
                                                style={{
                                                    fill: isActiveState
                                                        ? "rgba(156, 51, 180, 0.18)"
                                                        : hasEvent
                                                        ? "var(--surface-2)"
                                                        : "var(--bg)",
                                                    stroke: isActiveState ? "#c4b5fd" : "var(--border)",
                                                    strokeWidth: isActiveState ? 1.5 : 0.8,
                                                }}
                                            />
                                        );
                                    })}
                                </g>

                                {/* Event Pinpoints */}
                                {eventLocations.map((loc) => {
                                    const isSelected = selectedLocation && selectedLocation.id === loc.id;
                                    const isHovered = hoveredLocation && hoveredLocation.id === loc.id;
                                    const isActive = isSelected || isHovered;
                                    return (
                                        <g
                                            key={loc.id}
                                            className="cursor-pointer"
                                            data-cursor
                                            data-cursor-label="Event"
                                            onClick={() => setSelectedLocation(loc)}
                                            onMouseEnter={() => setHoveredLocation(loc)}
                                            onMouseLeave={() => setHoveredLocation(null)}
                                        >
                                            {/* Pulsating outer aura - click through */}
                                            <circle
                                                cx={loc.x}
                                                cy={loc.y}
                                                r={isActive ? 24 : 16}
                                                fill={isActive ? "rgba(156, 51, 180, 0.25)" : "rgba(156, 51, 180, 0.08)"}
                                                className="pulsate-ring pointer-events-none"
                                                style={{
                                                    transformOrigin: `${loc.x}px ${loc.y}px`,
                                                    transition: "r 0.3s ease",
                                                }}
                                            />

                                            {/* Pin core */}
                                            <circle
                                                cx={loc.x}
                                                cy={loc.y}
                                                r={isActive ? 8 : 5}
                                                fill="#c4b5fd"
                                                className="transition-all duration-300 pointer-events-none"
                                                style={{
                                                    filter: isActive
                                                        ? "drop-shadow(0 0 8px #c4b5fd)"
                                                        : "none",
                                                }}
                                            />

                                            {/* Invisible large hover/click target */}
                                            <circle
                                                cx={loc.x}
                                                cy={loc.y}
                                                r={28}
                                                fill="transparent"
                                                className="cursor-pointer"
                                            />
                                        </g>
                                    );
                                })}
                            </svg>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-[var(--text-faint)] uppercase tracking-wider animate-pulse">
                                Loading Interactive Map...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
