import { Clouds, Cloud } from "@react-three/drei";

export default function CloudBackground() {
  return (
    <group renderOrder={10}>
      <Clouds frustumCulled={true}>
        <Cloud
          position={[-12, 1.9, -14]}
          scale={0.66}
          segments={44}
          bounds={[12, 4, 4]}
          volume={11}
          opacity={0.12}
          fade={1}
          speed={0.95}
          color="#fff3e9"
        />

        <Cloud
          position={[-8, 1.2, -7]}
          scale={0.24}
          segments={36}
          bounds={[10, 3.5, 3.5]}
          volume={7}
          opacity={0.16}
          fade={1}
          speed={0.045}
          color="#fff3e9"
        />

        <Cloud
          position={[-10, 1.6, -2]}
          scale={0.33}
          segments={32}
          bounds={[9, 3.2, 3.2]}
          volume={6}
          opacity={0.22}
          fade={1}
          speed={0.04}
          color="#ffffffff"
        />
      </Clouds>
    </group>
  );
}
