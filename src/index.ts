import assertionType, {RULE_NAME as assertionTypeName} from "./rules/assertion-type";
import lowerCaseTitle, {RULE_NAME as lowerCaseTitleName} from "./rules/lower-case-title";
import maxNestedDescribe, {RULE_NAME as maxNestedDescribeName} from "./rules/max-nested-describe";
import noConditionalInTest, {RULE_NAME as noConditionalInTestName} from "./rules/no-conditional-in-tests";
import noIdenticalTitle, {RULE_NAME as noIdenticalTitleName} from "./rules/no-identical-title";
import noSkippedTests, {RULE_NAME as noSkippedTestsName} from "./rules/no-skipped-tests";

export default {
  rules: {
    [noSkippedTestsName]: noSkippedTests,
    [lowerCaseTitleName]: lowerCaseTitle,
    [assertionTypeName]: assertionType,
    [maxNestedDescribeName]: maxNestedDescribe,
    [noIdenticalTitleName]: noIdenticalTitle,
    [noConditionalInTestName]: noConditionalInTest,
  },
};
