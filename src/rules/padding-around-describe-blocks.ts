import { getFilename } from '../utils/msc';
import { Config, PaddingType, StatementType, createPaddingRule } from '../utils/padding';

export const RULE_NAME = getFilename(import.meta.url)

export const config: Config[] = [
  {
    paddingType: PaddingType.Always,
    prevStatementType: StatementType.Any,
    nextStatementType: [
      StatementType.DescribeToken,
      StatementType.FdescribeToken,
      StatementType.XdescribeToken,
    ],
  },
  {
    paddingType: PaddingType.Always,
    prevStatementType: [
      StatementType.DescribeToken,
      StatementType.FdescribeToken,
      StatementType.XdescribeToken,
    ],
    nextStatementType: StatementType.Any,
  },
];

export default createPaddingRule(
  RULE_NAME,
  'Enforce padding around `describe` blocks',
  config,
);
