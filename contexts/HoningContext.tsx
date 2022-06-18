import { useTheme } from "@emotion/react";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import {
  expected_value,
  fillInOptions,
  HoningOptions,
} from "../utils/honing-calculations";
import supabase from "../utils/supabase";

type State = {
  honingData: EquipmentUpgradeData[];
  getHoningByLvl: (
    tier: SetTier,
    type: SetType,
    level: number
  ) => EquipmentUpgradeData | undefined;
  getAvgCost: (
    honingLvl: EquipmentUpgradeData,
    honingRate?: number | undefined
  ) => UpgradeCostData;
  getAvgCostByLvl: (
    tier: SetTier,
    type: SetType,
    level: number
  ) => UpgradeCostData | undefined;
  getGearScore: (tier: SetTier, level: number, type?: SetType) => number;
};

type HoningProviderProps = {
  children: React.ReactNode;
};

export type SetTier = "t1 302" | "t2 802" | "t3 1302" | "t3 1340" | "t3 relic";
export type SetType = "weapon" | "armor";

export type StrongholdResearchBuffs = {
  initial_shards_reduction_rate: number;
  increased_success_rate: number;
};

export type StrongholdBuff = Record<SetTier, StrongholdResearchBuffs>;

export type EquipmentUpgradeData = {
  set_tier: SetTier;
  set_type: SetType;

  ilvl: number;
  lvl: number;

  initial_success_rate: number;
  initial_shards: number;

  trial_destructions: number;
  trial_fusion_mat: number;
  trial_gold: number;
  trial_guardians: number;
  trial_leapstones: number;
  trial_shards: number;
  trial_silver: number;
};

export type UpgradeCost = {
  shard: number;
  destruction: number;
  guardian: number;
  leapstone: number;
  fusion: number;
  gold: number;
  silver: number;
};

export type UpgradeCostData = {
  expectedValue: number;
  costs: UpgradeCost;
  honingLvl: EquipmentUpgradeData;
};

const t: StrongholdBuff = {
  "t1 302": { initial_shards_reduction_rate: 0.2, increased_success_rate: 0.2 },
  "t2 802": { initial_shards_reduction_rate: 0.2, increased_success_rate: 0.2 },
  "t3 1302": {
    initial_shards_reduction_rate: 0.2,
    increased_success_rate: 0.1,
  },
  "t3 1340": { initial_shards_reduction_rate: 0, increased_success_rate: 0 },
  "t3 relic": { initial_shards_reduction_rate: 0, increased_success_rate: 0 },
};

const HoningStateContext = createContext<State | undefined>(undefined);

const HoningStateProvider = ({ children }: HoningProviderProps) => {
  const [honingData, setHoningData] = useState<EquipmentUpgradeData[]>([]);

  const [strongHoldResearch, setStrongHoldResearch] =
    useState<keyof StrongholdBuff>();

  const getHoningByLvl = (tier: SetTier, type: SetType, level: number) => {
    return honingData.find(
      ({ set_tier, set_type, lvl }) =>
        set_tier === tier && set_type === type && lvl === level
    );
  };

  const getGearScore = (tier: SetTier, level: number, type?: SetType) =>
    getHoningByLvl(tier, type ?? "weapon", level)?.ilvl ?? 0;

  const getHoningByILvl = (tier: SetTier, type: SetType, level: number) => {};

  const getAvgCost = (
    honingLvl: EquipmentUpgradeData,
    honingRate?: number,
    options?: Partial<HoningOptions>
  ): UpgradeCostData => {
    const opts = fillInOptions(options);

    const ev = expected_value(
      honingRate ?? honingLvl.initial_success_rate,
      opts
    );

    return {
      expectedValue: ev,
      honingLvl,
      costs: {
        shard:
          ev * honingLvl.trial_shards +
          honingLvl.initial_shards * (1 + opts.stronghold_research_exp_rate),
        destruction: ev * honingLvl.trial_destructions,
        guardian: ev * honingLvl.trial_guardians,
        leapstone: ev * honingLvl.trial_leapstones,
        fusion: ev * honingLvl.trial_fusion_mat,
        gold: ev * honingLvl.trial_gold,
        silver: ev * honingLvl.trial_silver,
      },
    };
  };

  const getAvgCostByLvl = (tier: SetTier, type: SetType, level: number) => {
    const upgradeLevelData = getHoningByLvl(tier, type, level);
    if (upgradeLevelData) return getAvgCost(upgradeLevelData);
  };

  useEffect(() => {
    const fetchHoningData = async () => {
      let { data, error } = await supabase.from("honing_data").select("*");

      if (data) {
        const dataSanitized: EquipmentUpgradeData[] = data.map((row) => {
          return {
            set_tier: row.set_tier ?? "t1 302",
            set_type: row.set_type ?? "weapon",

            ilvl: row.ilvl ?? 0,
            lvl: row.lvl ?? 0,

            initial_success_rate: row.initial_success_rate ?? 0,
            initial_shards: row.initial_shards ?? 0,

            trial_destructions: row.trial_destructions ?? 0,
            trial_fusion_mat: row.trial_fusion_mat ?? 0,
            trial_gold: row.trial_gold ?? 0,
            trial_guardians: row.trial_guardians ?? 0,
            trial_leapstones: row.trial_leapstones ?? 0,
            trial_shards: row.trial_shards ?? 0,
            trial_silver: row.trial_silver ?? 0,
          };
        });
        setHoningData(dataSanitized);
      }
      console.log({ data });
    };

    fetchHoningData();
  }, []);

  return (
    <HoningStateContext.Provider
      value={{
        honingData,
        getHoningByLvl,
        getAvgCost,
        getAvgCostByLvl,
        getGearScore,
      }}
    >
      {children}
    </HoningStateContext.Provider>
  );
};

const useHoningState = () => {
  const context = useContext(HoningStateContext);
  if (context === undefined)
    throw new Error("useHoningState must be used within a HoningStateProvider");
  return context;
};

export { HoningStateProvider, useHoningState };
