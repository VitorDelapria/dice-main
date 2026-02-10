import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import albedo from "./albedo.png";
import normal from "./normal.png";
import mask from "./mask.png";
import { gltfTexture } from "../../helpers/gltfTexture";

// Cores do brilho (ajuste se quiser mudar o tom do reflexo)
const sheenColor = new THREE.Color("#174d67"); // Azulado metálico
const attenuationColor = new THREE.Color(43 / 255, 1, 115 / 255); // Esverdeado interno

export function AssimiMaterial(
  props: JSX.IntrinsicElements["meshPhysicalMaterial"]
) {
  // Carrega as texturas
  const [albedoMap, maskMap, normalMap] = useTexture(
    [albedo, mask, normal],
    (textures) => gltfTexture(textures, ["SRGB", "LINEAR", "LINEAR"])
  );

  return (
    <meshPhysicalMaterial
      // 1. REMOVI O color="red".
      // Se quiser garantir que a cor seja fiel à imagem, use white:
      color="white" 
      
      map={albedoMap}
      sheenColor={sheenColor}
      sheen={1}
      roughness={0.3} // 0 = Espelho, 1 = Fosco
      metalness={0.5} // Aumentei um pouco para parecer mais tecnológico/metal
      normalMap={normalMap}
      
      // DICA DE DESIGN "ASSIMILAÇÃO":
      // Se você quiser o dado SÓLIDO (metal/plástico), mude transmission para 0.
      // Se você quiser VIDRO (transparente), deixe em 1.
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