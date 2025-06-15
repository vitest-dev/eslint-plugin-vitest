import {
  Config,
  PaddingType,
  StatementType,
  createPaddingRule,
} from '../utils/padding'

export const RULE_NAME = 'padding-around-after-each-blocks'

export const config: Config[] = [
  {
    paddingType: PaddingType.Always,
    prevStatementType: StatementType.Any,
    nextStatementType: StatementType.AfterEachToken,
  },
  {
    paddingType: PaddingType.Always,
    prevStatementType: StatementType.AfterEachToken,
    nextStatementType: StatementType.Any,
  },
]

export default createPaddingRule(
  RULE_NAME,
  'Enforce padding around `afterEach` blocks',
  config,
)
