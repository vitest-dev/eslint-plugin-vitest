
import { config as paddingAroundAfterAllBlocksConfig } from './padding-around-after-all-blocks';
import { config as paddingAroundAfterEachBlocksConfig } from './padding-around-after-each-blocks';
import { config as paddingAroundBeforeAllBlocksConfig } from './padding-around-before-all-blocks';
import { config as paddingAroundBeforeEachBlocksConfig } from './padding-around-before-each-blocks';
import { config as paddingAroundDescribeBlocksConfig } from './padding-around-describe-blocks';
import { config as paddingAroundExpectGroupsConfig } from './padding-around-expect-groups';
import { config as paddingAroundTestBlocksConfig } from './padding-around-test-blocks';
import { createPaddingRule } from '../utils/padding';
import { getFilename } from '../utils/msc';

export const RULE_NAME = getFilename(import.meta.url)

export default createPaddingRule(
  RULE_NAME,
  'Enforce padding around vitest functions',
  [
    ...paddingAroundAfterAllBlocksConfig,
    ...paddingAroundAfterEachBlocksConfig,
    ...paddingAroundBeforeAllBlocksConfig,
    ...paddingAroundBeforeEachBlocksConfig,
    ...paddingAroundDescribeBlocksConfig,
    ...paddingAroundExpectGroupsConfig,
    ...paddingAroundTestBlocksConfig,
  ],
);
