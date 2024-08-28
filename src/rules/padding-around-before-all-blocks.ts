import { Config, PaddingType, StatementType, createPaddingRule } from "../utils/padding";

export const RULE_NAME = 'padding-around-before-all-blocks'

export const config: Config[] = [
  {
    paddingType: PaddingType.Always,
    prevStatementType: StatementType.Any,
    nextStatementType: StatementType.BeforeAllToken
  },
  {
    paddingType: PaddingType.Always,
    prevStatementType: StatementType.BeforeAllToken,
    nextStatementType: StatementType.Any
  }
]

export default createPaddingRule(RULE_NAME, 'Enforce padding around `beforeAll` blocks', config)
