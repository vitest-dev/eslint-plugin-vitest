import { Config, PaddingType, StatementType, createPaddingRule } from "../utils/padding";
import { get_filename } from "../utils/msc";

export const RULE_NAME = get_filename(import.meta.url)

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
