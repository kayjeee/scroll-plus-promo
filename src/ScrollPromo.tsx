import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PhoneMockup } from "./PhoneMockup";

interface CalloutConfig {
  readonly title: string;
  readonly description: string;
  readonly badge: string;
  readonly startFrame: number;
  readonly endFrame: number;
  readonly color: string;
}

const callouts: CalloutConfig[] = [
  {
    title: "School Head Office",
    description: "All-in-one institutional management and administrative portal.",
    badge: "ADMIN PORTAL",
    startFrame: 20,
    endFrame: 140,
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Student Analytics",
    description: "Real-time tracking of attendance, performance, and grades.",
    badge: "ACADEMICS",
    startFrame: 140,
    endFrame: 220,
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Fee Management",
    description: "Automated billing, invoicing, and instant payment reconciliation.",
    badge: "FINANCE",
    startFrame: 220,
    endFrame: 340,
    color: "from-amber-500 to-orange-600",
  },
];

export const ScrollPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scaled height of image is (304 / 1400) * 6000 ≈ 1303px. Phone screen viewport is ~634px high.
  // Smoothly scroll down: 0 -> -350px -> pause -> -700px
  const scrollY = interpolate(
    frame,
    [30, 150, 200, 320],
    [0, -350, -350, -700],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Entrance spring for phone mockup
  const phoneEntrance = spring({
    frame,
    fps,
    config: {
      damping: 18,
      stiffness: 80,
    },
  });

  return (
    <AbsoluteFill className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-row items-center justify-center p-12 select-none overflow-hidden font-sans">
      {/* Background glow decoration */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Center container with Phone and Callouts */}
      <div className="relative z-10 flex flex-row items-center gap-16 max-w-6xl w-full justify-center">
        {/* Phone Mockup column */}
        <div
          style={{
            transform: `scale(${phoneEntrance}) translateY(${interpolate(
              phoneEntrance,
              [0, 1],
              [40, 0]
            )}px)`,
          }}
          className="flex-shrink-0"
        >
          <PhoneMockup>
            <div
              style={{
                transform: `translateY(${scrollY}px)`,
                width: "100%",
                willChange: "transform",
              }}
            >
              <Img
                src={staticFile("schoolheadoffice scroll image.png")}
                className="w-full h-auto block"
                alt="Scroll Page"
              />
            </div>
          </PhoneMockup>
        </div>

        {/* Feature Callouts column */}
        <div className="flex flex-col gap-6 w-[420px]">
          {callouts.map((item, index) => {
            // Spring animation for entering and exiting callout card
            const enterSpring = spring({
              frame: frame - item.startFrame,
              fps,
              config: { damping: 14, stiffness: 100 },
            });

            const exitSpring = spring({
              frame: frame - item.endFrame,
              fps,
              config: { damping: 14, stiffness: 100 },
            });

            // Opacity and translation
            const isVisible = frame >= item.startFrame && frame <= item.endFrame + 15;
            if (!isVisible) return null;

            const scale = interpolate(enterSpring - exitSpring, [0, 1], [0.85, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const opacity = interpolate(enterSpring - exitSpring, [0, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const translateX = interpolate(enterSpring - exitSpring, [0, 1], [40, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={index}
                style={{
                  transform: `translateX(${translateX}px) scale(${scale})`,
                  opacity,
                }}
                className="p-6 rounded-3xl bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 shadow-xl flex flex-col gap-3"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold tracking-wider px-3 py-1 rounded-full text-white bg-gradient-to-r ${item.color} shadow-sm`}
                  >
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
