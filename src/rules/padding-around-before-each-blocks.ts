
import { get_filename } from '../utils/msc';
import { PaddingType, StatementType, createPaddingRule } from '../utils/padding';

export const RULE_NAME = get_filename(import.meta.url)

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
];

export default createPaddingRule(
  RULE_NAME,
  'Enforce padding around `beforeEach` blocks',
  config,
);
