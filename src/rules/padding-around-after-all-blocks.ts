import { Config, PaddingType, StatementType, createPaddingRule } from "../utils/padding"
import { URL } from "node:url"

export const RULE_NAME = new URL('', import.meta.url).pathname

export const config: Config[] = [
  {
    paddingType: PaddingType.Always,
    prevStatementType: StatementType.Any,
    nextStatementType: StatementType.AfterAllToken
  },
  {
    paddingType: PaddingType.Always,
    prevStatementType: StatementType.AfterAllToken,
    nextStatementType: StatementType.Any
  }
]
export default createPaddingRule(RULE_NAME, 'Enforce padding around `afterAll` blocks', config)
