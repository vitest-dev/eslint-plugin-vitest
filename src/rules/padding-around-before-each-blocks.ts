import { PaddingType, StatementType, createPaddingRule } from '../utils/padding'

const RULE_NAME = 'padding-around-before-each-blocks'

export const config = [
  {
    paddingType: PaddingType.Always,
    prevStatementType: StatementType.Any,
    nextStatementType: StatementType.BeforeEachToken,
  },
  {
    paddingType: PaddingType.Always,
    prevStatementType: StatementType.BeforeEachToken,
    nextStatementType: StatementType.Any,
  },
]

export default createPaddingRule(
  RULE_NAME,
  'Enforce padding around `beforeEach` blocks',
  config,
)
