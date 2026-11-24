import Image from "next/image";
import { u } from "@/lib/lenis";
import { TEAM } from "@/lib/team";

// Figma "Group 826": six rows 474 high, one every 680, photo 374 x 469; rows alternate sides (photo left, then right).
const ROW_H = 474;
const STEP = 680;

/** Figma About: the team in more detail. Position the wrapper at design y 3125 (this block is relative to it). */
export function TeamBios() {
  return (
    <ol>
      {/* the order in Figma: Bidisha, Sam, Anshu, Debosrita, Somani, Rika = the deck order */}
      {TEAM.map((m, i) => {
        const photoLeft = i % 2 === 0;
        return (
          <li key={m.name} id={`team-${i}`} className="absolute text-white" style={{ left: u(85), top: u(i * STEP), width: u(1269), height: u(ROW_H) }}>
            <Image
              src={m.photo}
              alt={m.name}
              width={748}
              height={938}
              className="absolute top-0 object-cover"
              style={{ left: u(photoLeft ? 0 : 895), width: u(374), height: u(469), borderRadius: u(11) }}
            />
            <div className="absolute flex h-full flex-col justify-between" style={{ left: u(photoLeft ? 497 : 0), width: u(772) }}>
              <h3 style={{ fontSize: u(40), lineHeight: "normal" }}>
                <span className="font-medium">{m.name}</span>
                <br />
                <span style={{ fontWeight: 300 }}>{m.role}</span>
              </h3>
              <div className="space-y-[1em]" style={{ fontSize: u(21.6), fontWeight: 300, lineHeight: "normal" }}>
                {m.bio.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
