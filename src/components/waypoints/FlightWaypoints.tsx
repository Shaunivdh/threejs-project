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
  exitRadius?: number;
};

const WAYPOINTS: WaypointDefinition[] = [
  {
    id: "windmill",
    title: "Roots in the Netherlands 🌷",
    message:
      "I grew up in the Netherlands in a small town just outside Amsterdam. My early hobbies included experimenting with very early versions of Photoshop and Microsoft FrontPage 😲 nostalgic! Nothing fancy, I just liked seeing ideas turn into something real on screen.\n\nIt was just something I genuinely enjoyed doing, my way of being creative, since I’ve never exactly been gifted with a paintbrush. I didn’t think of it as a career back then. \n\nI went on to study Hospitality Management instead, which taught me a lot of transferable skills that I still use day to day.",
    targetPosition: [-2.6, -0.15, -1.5],
    beaconOffset: [0, 1.6, 0],
    triggerRadius: 1.25,
  },
  {
    id: "postbox",
    title: "Moving to London at 19 🇬🇧",
    message:
      "At 19, I moved to London for an internship and ended up staying. I worked in restaurants and gradually progressed into management roles, leading both small and large teams and helping open new restaurants and bars.\n\nWorking in high-pressure environments taught me how to prioritise quickly, make decisions on the fly, and stay unflappable, because everything has to keep moving.\n\nThose years shaped my engineering mindset, steady under pressure, clear with people, and always moving things forward. ⚡🧠",
    targetPosition: [-3.1, 0.45, 1.2],
    beaconOffset: [0, 0.95, 0],
    triggerRadius: 1.1,
  },
  {
    id: "loungechair",
    title: "Barcelona Bootcamp! 🇪🇸",
    message:
      "Even while working full-time, I kept coming back to coding. Eventually, I decided to take it seriously and enrolled in a full-stack development bootcamp with [CodeOp](https://codeop.tech/) based in Barcelona 💻🌍\n\nBalancing both wasn’t easy, but it confirmed I was heading in the right direction. The program covered full-stack fundamentals including JavaScript ES6+, React, Node/Express, MySQL, data structures, and collaborative development using Git and Agile practices.\n\nThrough three hands-on projects: an MVP, a feature extension, and a group project. My focus shifted from curiosity to structured problem solving and production minded development 🚀",
    targetPosition: [2.6, 0.1, 2],
    beaconOffset: [0, 1.4, 0],
    triggerRadius: 1.2,
  },
  {
    id: "laptop",
    title: "By the Sea, Building Things 💻🌊",
    message:
      "Now I am based in Hove, UK, working at Bluecrest as a Frontend React Engineer.\n\nI contribute to features used daily at scale, focusing on architecture, performance, and long-term maintainability. I think beyond individual components, looking at how systems fit together and how decisions age over time.\n\nI enjoy taking ownership, raising standards, and helping shape thoughtful, resilient products.\n\nI hope you enjoyed the journey ✈️\nThanks for exploring.",
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
          exitRadius={wp.exitRadius}
          onEnter={onBeaconEnter}
          onExit={onBeaconExit}
        />
      ))}
    </>
  );
}
