import * as THREE from "three";
import { useTexture } from "@react-three/drei";

import albedoNumerico from "./albedo2.png";
import albedoSimbolos from "./albedo_simbolos.png";
import normal from "./normal.png";
import mask from "./mask.png";
import { gltfTexture } from "../../helpers/gltfTexture";

const sheenColor = new THREE.Color("#000000");
const attenuationColor = new THREE.Color(43 / 255, 1, 115 / 255);

type CaosMaterialProps = JSX.IntrinsicElements["meshPhysicalMaterial"] & {
  variant?: "NUMERICO" | "SIMBOLOS";
};

export function CaosMaterial({ variant = "NUMERICO", ...props }: CaosMaterialProps) {
  const [mapNumerico, mapSimbolos, maskMap, normalMap] = useTexture(
    [albedoNumerico, albedoSimbolos, mask, normal],
    (textures) => gltfTexture(textures, ["SRGB", "SRGB", "LINEAR", "LINEAR"])
  );

  const finalAlbedo = variant === "SIMBOLOS" ? mapSimbolos : mapNumerico;

  return (
    <meshPhysicalMaterial
      color="white"
      map={finalAlbedo}
      
      sheenColor={sheenColor}
      sheen={0.1}

      roughness={0.3}

      metalness={0.5}

      normalMap={normalMap}
      transmission={0}
      transmissionMap={maskMap}
      thickness={2}
      
      envMapIntensity={1}

      attenuationColor={attenuationColor}
      attenuationDistance={0.1}
      {...props}
    />
  );
}