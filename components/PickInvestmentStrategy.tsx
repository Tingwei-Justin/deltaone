/* This example requires Tailwind CSS v2.0+ */
import { RadioGroup } from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";

import PortfolioChoice from "./PortfolioChoice";

export interface Plan {
  name: string;
  hedge: string;
  disk: string;
  price: string;
}

const plans: Plan[] = [
  {
    name: "Low Risk",
    hedge: "100% Hedged",
    disk: "$1.2M Invested",
    price: "1% APR",
  },
  {
    name: "Medium Risk",
    hedge: "50% Hedged",
    disk: "$0.8M Invested",
    price: "1.2% APR",
  },
  {
    name: "High Risk",
    hedge: "25% Hedged",
    disk: "$0.8M Invested",
    price: "1.5% APR",
  },
  {
    name: "Let’s Fucking Go!",
    hedge: "Long Only ",
    disk: "$0.8M Invested",
    price: "2% APR",
  },
];

export interface PickInvestmentStrategyProps {
  selectedInvestmentStrategy?: Plan;
  setInvestmentStrategy: Dispatch<SetStateAction<Plan | undefined>>;
}
export default function PickInvestmentStrategy({
  selectedInvestmentStrategy,
  setInvestmentStrategy,
}: PickInvestmentStrategyProps) {

  return (
    <RadioGroup
      value={selectedInvestmentStrategy}
      onChange={setInvestmentStrategy}
    >
      <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
      <div className="space-y-4">
        {plans.map((plan) => (
          <PortfolioChoice plan={plan} checked={false} />
        ))}
      </div>
    </RadioGroup>
  );
}
