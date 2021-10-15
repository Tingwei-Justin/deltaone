import { RadioGroup } from "@headlessui/react";

import { classNames } from "../utils/utils";
import { Plan } from "./PickInvestmentStrategy";

export interface PortfoliOChoiceProps {
  plan?: Plan;
  checked: boolean;
}
const PortfolioChoice = ({
  plan,
  checked = false,
}: PortfoliOChoiceProps): JSX.Element => {
  return plan ? (
    <>
      <RadioGroup.Option
        key={plan.name}
        value={plan}
        className={({ active }) =>
          classNames(
            active ? "ring-1 ring-offset-2 ring-indigo-500" : "",
            "relative block rounded-lg border border-gray-300 bg-white shadow-sm px-6 py-4 cursor-pointer hover:border-gray-400 sm:flex sm:justify-between focus:outline-none"
          )
        }
      >
        {({ checked }) => (
          <>
            <div className="flex items-center">
              <div className="text-sm">
                <RadioGroup.Label as="p" className="font-medium text-gray-900">
                  {plan.name}
                </RadioGroup.Label>
                <RadioGroup.Description as="div" className="text-gray-500">
                  <p className="sm:inline">{plan.hedge}</p>{" "}
                  <span className="hidden sm:inline sm:mx-1" aria-hidden="true">
                    &middot;
                  </span>{" "}
                  <p className="sm:inline">{plan.disk}</p>
                </RadioGroup.Description>
              </div>
            </div>
            <RadioGroup.Description
              as="div"
              className="mt-2 flex text-sm sm:mt-0 sm:block sm:ml-4 sm:text-right"
            >
              <div className="font-medium text-gray-900">{plan.price}</div>
            </RadioGroup.Description>
            <div
              className={classNames(
                checked ? "border-indigo-500" : "border-transparent",
                "absolute -inset-px rounded-lg border-2 pointer-events-none"
              )}
              aria-hidden="true"
            />
          </>
        )}
      </RadioGroup.Option>
    </>
  ) : (
    <div>Please pick a plan.</div>
  );
};
export default PortfolioChoice;