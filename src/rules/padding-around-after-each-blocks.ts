import { Config, PaddingType, StatementType, createPaddingRule } from "../utils/padding";
import { getFilename } from "../utils/msc";

export const RULE_NAME = getFilename(import.meta.url)

export const config: Config[] = [
  {
    paddingType: PaddingType.Always,
    prevStatementType: StatementType.Any,
    nextStatementType: StatementType.AfterEachToken
  },
  {
    paddingType: PaddingType.Always,
    prevStatementType: StatementType.AfterEachToken,
    nextStatementType: StatementType.Any
  }
]

export default createPaddingRule(RULE_NAME, 'Enforce padding around `afterEach` blocks', config)
