import React from "react";
import type * as THREE from "three";
import type { Vector3Tuple } from "three";
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
    title: "Windmill",
    message: "You found the windmill! 🌾",
    targetPosition: [-2.6, -0.15, -1.5],
    beaconOffset: [0, 1.6, 0],
    triggerRadius: 1.25,
  },
  {
    id: "postbox",
    title: "Postbox",
    message: "Postbox reached! 📮",
    targetPosition: [-3.1, 0.45, 1.2],
    beaconOffset: [0, 0.95, 0],
    triggerRadius: 1.1,
  },
  {
    id: "loungechair",
    title: "Lounge Chair",
    message: "Time to relax 😎",
    targetPosition: [2.6, 0.1, 2],
    beaconOffset: [0, 1.4, 0],
    triggerRadius: 1.2,
  },
  {
    id: "laptop",
    title: "Laptop",
    message: "Time to work 😎",
    targetPosition: [2.72, 0.52, -2.9],
    beaconOffset: [0, 1, 0],
    triggerRadius: 1.2,
  },
];

export type FlightWaypointsProps = {
  airplaneRef: React.RefObject<THREE.Object3D | null>;
  waypoints?: WaypointDefinition[];
};

export default function FlightWaypoints({
  airplaneRef,
  waypoints = WAYPOINTS,
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
        />
      ))}
    </>
  );
}
