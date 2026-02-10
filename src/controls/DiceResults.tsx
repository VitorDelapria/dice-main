import { useMemo } from "react";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Grow from "@mui/material/Grow";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import { DiceRoll } from "../types/DiceRoll";
import { Die, isDie } from "../types/Die";
import { DicePreview } from "../previews/DicePreview";

// --- IMPORTS DAS FACES (IGUAIS) ---
import lado3 from "../assets/faces_assimilacao/lado_3.png";
import lado4 from "../assets/faces_assimilacao/lado_4.png";
import lado5 from "../assets/faces_assimilacao/lado_5.png";
import lado6 from "../assets/faces_assimilacao/lado_6.png";
import lado7 from "../assets/faces_assimilacao/lado_7.png";
import lado8 from "../assets/faces_assimilacao/lado_8.png";
import lado9 from "../assets/faces_assimilacao/lado_9.png";
import lado10 from "../assets/faces_assimilacao/lado_10.png";
import lado11 from "../assets/faces_assimilacao/lado_11.png";
import lado12 from "../assets/faces_assimilacao/lado_12.png";

import caos1 from "../assets/faces_caos/lado_1.png";
import caos2 from "../assets/faces_caos/lado_2.png";
import caos3 from "../assets/faces_caos/lado_3.png";
import caos4 from "../assets/faces_caos/lado_4.png";
import caos5 from "../assets/faces_caos/lado_5.png";
import caos6 from "../assets/faces_caos/lado_6.png";

import iconJoaninha from "../assets/icons/joaninha.png";
import iconCoruja from "../assets/icons/coruja.png";
import iconCervo from "../assets/icons/cervo.png";
import iconCaosCriativo from "../assets/icons/caos_criativo.png";
import iconCaosNegativo from "../assets/icons/caos_negativo.png";
import iconEco from "../assets/icons/eco.png";

function getAssimilationContent(style: string, type: string, value: number, id?: string) {
  const isCaosSimbolo = style === "CAOS_SIMBOLOS" || (id && id.includes("SIMBOLOS"));

  if (isCaosSimbolo) {
    if (value === undefined) return null;

    switch (value) {
      case 1: return caos1;
      case 2: return caos2;
      case 3: return caos3;
      case 4: return caos4;
      case 5: return caos5;
      case 6: return caos6;
      default: return null;
    }
  }

  if (style === "ASSIMILACAO") {
    if (!["D6", "D10", "D12"].includes(type)) return null;
    if (type === "D10" && value === 0) return lado10;
    if (value <= 2) return "VAZIO";

    switch (value) {
      case 3: return lado3;
      case 4: return lado4;
      case 5: return lado5;
      case 6: return lado6;
      case 7: return lado7;
      case 8: return lado8;
      case 9: return lado9;
      case 10: return lado10;
      case 11: return lado11;
      case 12: return lado12;
      default: return null;
    }
  }
  return null;
}

function calculateStats(dice: Die[], values: Record<string, number>) {
  let stats = { 
    joaninha: 0, coruja: 0, cervo: 0,
    caosCriativo: 0, caosNegativo: 0, eco: 0 
  };

  dice.forEach((d) => {
    const val = values[d.id];
    
    if (d.style === "CAOS_SIMBOLOS") {
        console.log(`[DiceResults] ID: ${d.id} | Valor: ${val}`);
    }

    const isCaosSimbolo = d.style === "CAOS_SIMBOLOS" || (d.id && d.id.includes("SIMBOLOS"));

    if (d.style === "ASSIMILACAO") {
       let adjustedVal = val;
       if (d.type === "D10" && val === 0) adjustedVal = 10;
       switch (adjustedVal) {
          case 3: stats.coruja++; break;
          case 4: 
          case 5: stats.coruja++; stats.cervo++; break;
          case 6: stats.joaninha++; break;
          case 7: stats.joaninha += 2; break;
          case 8: stats.joaninha++; stats.cervo++; break;
          case 9: stats.joaninha++; stats.cervo++; stats.coruja++; break;
          case 10: stats.joaninha += 2; stats.coruja++; break;
          case 11: stats.joaninha++; stats.cervo += 2; stats.coruja++; break;
          case 12: stats.coruja += 2; break;
       }
    }

    if (isCaosSimbolo) {
       switch (val) {
          case 1: stats.caosNegativo++; break;
          case 4: 
          case 5: stats.eco++; break;
          case 6: stats.caosCriativo++; break;
       }
    }
  });

  return stats;
}

function StatsDisplay({ stats }: { stats: any }) {
  const renderStat = (icon: string, count: number) => {
    if (count === 0) return null;
    return (
      <Stack direction="row" alignItems="center" gap={0.5}>
        <img src={icon} style={{ width: "20px", height: "20px", objectFit: "contain" }} alt="icon" />
        <Typography variant="body1" color="white" fontWeight="bold">
          {count}
        </Typography>
      </Stack>
    );
  };

  const hasAssimilation = stats.joaninha > 0 || stats.coruja > 0 || stats.cervo > 0;
  const hasCaos = stats.caosCriativo > 0 || stats.caosNegativo > 0 || stats.eco > 0;

  if (!hasAssimilation && !hasCaos) return null;

  return (
    <Stack direction="row" gap={0.5} alignItems="center" justifyContent="center">
      {renderStat(iconJoaninha, stats.joaninha)}
      {renderStat(iconCoruja, stats.coruja)}
      {renderStat(iconCervo, stats.cervo)}
      {hasAssimilation && hasCaos && (
         <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.3)", margin: "0 4px" }} />
      )}
      {renderStat(iconCaosCriativo, stats.caosCriativo)}
      {renderStat(iconEco, stats.eco)}
      {renderStat(iconCaosNegativo, stats.caosNegativo)}
    </Stack>
  );
}

export function DiceResults({
  diceRoll,
  rollValues,
  expanded,
  onExpand,
}: {
  diceRoll: DiceRoll;
  rollValues: Record<string, number>;
  expanded: boolean;
  onExpand: (expand: boolean) => void;
}) {
  
  const numericTotal = useMemo(() => {
    const dice = diceRoll.dice.filter(isDie);
    const sum = dice.reduce((acc, d) => {
      const isSimbolo = d.style === "ASSIMILACAO" || 
                        d.style === "CAOS_SIMBOLOS" || 
                        (d.id && d.id.includes("SIMBOLOS"));

      if (isSimbolo) return acc; 
      
      let val = rollValues[d.id] || 0;
      if (d.type === "D10" && val === 0) val = 10;
      return acc + val;
    }, 0);
    return sum + (diceRoll.bonus || 0);
  }, [diceRoll, rollValues]);

  const stats = useMemo(() => {
    return calculateStats(diceRoll.dice.filter(isDie), rollValues);
  }, [diceRoll, rollValues]);

  const hasSymbols = stats.joaninha > 0 || stats.coruja > 0 || stats.cervo > 0 || 
                     stats.caosCriativo > 0 || stats.caosNegativo > 0 || stats.eco > 0;

  const hasNumericDice = diceRoll.dice.filter(isDie).some(d => {
      const isSimbolo = d.style === "ASSIMILACAO" || 
                        d.style === "CAOS_SIMBOLOS" || 
                        (d.id && d.id.includes("SIMBOLOS"));
      return !isSimbolo;
  });

  return (
    <Stack alignItems="center" maxHeight="calc(100vh - 100px)">
      <Tooltip title={expanded ? "Hide Breakdown" : "Show Breakdown"} disableInteractive>
        <Button
          sx={{ pointerEvents: "all", padding: 0.5, minWidth: "40px" }}
          onClick={() => onExpand(!expanded)}
          color="inherit"
        >
          <Stack direction="row" gap={1} alignItems="center" justifyContent="center">
            {hasNumericDice && (
               <Typography variant="h5" color="white" fontWeight="bold">{numericTotal}</Typography>
            )}
            {hasSymbols && <StatsDisplay stats={stats} />}
          </Stack>
        </Button>
      </Tooltip>
      <Grow in={expanded} mountOnEnter unmountOnExit style={{ transformOrigin: "50% 0 0" }}>
        <Stack overflow="auto" sx={{ pointerEvents: "all", width: "100%" }}>
          <DiceResultsExpanded 
             diceRoll={diceRoll} 
             rollValues={rollValues} 
             numericTotal={numericTotal}
             stats={stats}
             hasNumericDice={hasNumericDice}
          />
        </Stack>
      </Grow>
    </Stack>
  );
}

function DiceResultsExpanded({ diceRoll, rollValues, numericTotal, stats, hasNumericDice }: any) {
  const die = diceRoll.dice.filter(isDie);

  return (
    <Stack divider={<Divider />} gap={1} width="100%">
      <Stack direction="column" gap={1} justifyContent="center" width="100%">
        {die.map((d: Die) => {
          const customContent = getAssimilationContent(d.style, d.type, rollValues[d.id], d.id);
          let displayValue = rollValues[d.id];
          if (d.type === "D10" && displayValue === 0) displayValue = 10;

          const isUndefined = displayValue === undefined;

          return (
            <Stack direction="row" key={d.id} gap={1} alignItems="center" justifyContent="center">
              <DicePreview diceStyle={d.style} diceType={d.type} size="small" />
              
              {customContent === "VAZIO" ? (
                 <div style={{ width: "28px" }} />
              ) : customContent && !isUndefined ? (
                 <img src={customContent} style={{ width: "28px", height: "28px", objectFit: "contain" }} />
              ) : (
                 <Typography lineHeight="28px" color="white">
                   {isUndefined ? "?" : displayValue}
                 </Typography>
              )}
            </Stack>
          );
        })}

        <Stack direction="row" gap={2} alignItems="center" justifyContent="center" sx={{ mt: 1, pt: 1, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
           {hasNumericDice && (
             <Stack direction="row" gap={1}>
                <Typography lineHeight="28px" color="white">=</Typography>
                <Typography lineHeight="28px" color="white" fontWeight="bold">{numericTotal}</Typography>
             </Stack>
           )}
           <StatsDisplay stats={stats} />
        </Stack>
      </Stack>
    </Stack>
  );
}