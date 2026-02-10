import { DiceStyle } from "../types/DiceStyle";

import { GalaxyMaterial } from "./galaxy/GalaxyMaterial";
import { GemstoneMaterial } from "./gemstone/GemstoneMaterial";
import { GlassMaterial } from "./glass/GlassMaterial";
import { IronMaterial } from "./iron/IronMaterial";
import { NebulaMaterial } from "./nebula/NebulaMaterial";
import { SunriseMaterial } from "./sunrise/SunriseMaterial";
import { SunsetMaterial } from "./sunset/SunsetMaterial";
import { WalnutMaterial } from "./walnut/WalnutMaterial";

import { AssimiMaterial } from "./assimilacao/AssimiMaterial";
import { CaosMaterial } from "./caos/CaosMaterial";

export function DiceMaterial({ 
  diceStyle, 
  dieId 
}: { 
  diceStyle: DiceStyle; 
  dieId?: string; 
}) {

  console.log("ESPIÃO DO DADO:", diceStyle, dieId);

  switch (diceStyle) {
    case "GALAXY":
      return <GalaxyMaterial />;
    case "GEMSTONE":
      return <GemstoneMaterial />;
    case "GLASS":
      return <GlassMaterial />;
    case "IRON":
      return <IronMaterial />;
    case "NEBULA":
      return <NebulaMaterial />;
    case "SUNRISE":
      return <SunriseMaterial />;
    case "SUNSET":
      return <SunsetMaterial />;
    case "WALNUT":
      return <WalnutMaterial />;
      
    case "ASSIMILACAO":
      return <AssimiMaterial />;

    case "CAOS":
      return <CaosMaterial variant="NUMERICO" />;

    case "CAOS_SIMBOLOS":
      return <CaosMaterial variant="SIMBOLOS" />;

    default:
      console.error(`Dice style ${diceStyle} not implemented`);
      return null;
  }
}