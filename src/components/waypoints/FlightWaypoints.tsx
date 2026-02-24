import type React from "react";
import type { Vector3Tuple, Group } from "three";
import WaypointBeacon from "./WaypointBeacon";

export type WaypointDefinition = {
  id: "windmill" | "postbox" | "laptop" | "loungechair";
  title: string;
  message: string;

  targetPosition: Vector3Tuple;
  beaconOffset: Vector3Tuple;
  triggerRadius: number;
};

const WAYPOINTS: WaypointDefinition[] = [
  {
    id: "windmill",
    title: "Roots in the Netherlands 🌷",
    message:
      "I grew up in the Netherlands and studied Hospitality Management, which taught me how to stay organised, read people, and keep things running smoothly.\n\nAt the same time, I was building small websites in Microsoft FrontPage out of pure curiosity. Nothing fancy, I just liked seeing ideas turn into something real on screen.\n\nI didn’t think of it as a career back then. It was just something I genuinely enjoyed doing.",
    targetPosition: [-2.6, -0.15, -1.5],
    beaconOffset: [0, 1.6, 0],
    triggerRadius: 1.25,
  },
  {
    id: "postbox",
    title: "Moving to London at 19 🇬🇧",
    message:
      "I moved to London at nineteen for an internship and ended up staying, working in restaurants and progressing into management roles.\n\nOperating in high pressure environments taught me to prioritise quickly, make decisions with incomplete information, and take responsibility when things did not go to plan. When you are leading a shift, there is no deferring ownership. You solve the problem and keep everything moving.\n\nThat experience shaped how I approach engineering today. Calm under pressure, clear in communication, and focused on execution when it matters.",
    targetPosition: [-3.1, 0.45, 1.2],
    beaconOffset: [0, 0.95, 0],
    triggerRadius: 1.1,
  },
  {
    id: "loungechair",
    title: "Bootcamp, but make it Barcelona 🇪🇸",
    message:
      "Even while working full-time, I kept coming back to coding. Eventually I decided to take it seriously and enrolled in a full-stack development bootcamp with CodeOp in Barcelona.\n\nBalancing both wasn’t easy, but it confirmed I was heading in the right direction. I built projects, strengthened my JavaScript skills, and learned to think across the stack instead of just guessing my way through.\n\nIt felt less like a career switch and more like committing to something I’d been quietly moving toward for years.",
    targetPosition: [2.6, 0.1, 2],
    beaconOffset: [0, 1.4, 0],
    triggerRadius: 1.2,
  },
  {
    id: "laptop",
    title: "By the Sea, Building Things 💻🌊",
    message:
      "I’m based in Hove, working remotely with Bluecrest as a Frontend React Engineer.\n\nI lead and contribute to features used daily at scale, focusing on architecture, performance, and long-term maintainability. I think beyond individual components, looking at how systems fit together and how decisions age over time.\n\nI enjoy taking ownership, raising engineering standards, and helping shape thoughtful, resilient products.\n\nI hope you enjoyed the journey ✈️\nThanks for exploring.",
    targetPosition: [2.72, 0.52, -2.9],
    beaconOffset: [0, 1, 0],
    triggerRadius: 1.2,
  },
];
export type FlightWaypointsProps = {
  airplaneRef: React.RefObject<Group>;
  waypoints?: WaypointDefinition[];

  onBeaconEnter?: (payload: { title: string; message: string }) => void;
  onBeaconExit?: () => void;
};

export default function FlightWaypoints({
  airplaneRef,
  waypoints = WAYPOINTS,
  onBeaconEnter,
  onBeaconExit,
}: FlightWaypointsProps) {
  return (
    <>
      {waypoints.map((wp) => (
        <WaypointBeacon
          key={wp.id}
          airplaneRef={airplaneRef}
          title={wp.title}
          message={wp.message}
          targetPosition={wp.targetPosition}
          beaconOffset={wp.beaconOffset}
          triggerRadius={wp.triggerRadius}
          onEnter={onBeaconEnter}
          onExit={onBeaconExit}
        />
      ))}
    </>
  );
}
