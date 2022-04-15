import assertionType from "./rules/assertion-type";
import lowerCaseTitle from "./rules/lower-case-title";
import maxNestedDescribe from "./rules/max-nested-describe";
import noConditionalInTest from "./rules/no-conditional-in-tests";
import noIdenticalTitle from "./rules/no-identical-title";
import noSkippedTests from "./rules/no-skipped-tests";

export default {
  rules: {
    "no-skip-test": noSkippedTests,
    "lower-case-title": lowerCaseTitle,
    "assertion-type": assertionType,
    "max-nested-describe": maxNestedDescribe,
    "no-idential-title": noIdenticalTitle,
    "no-conditional-in-test": noConditionalInTest,
  },
};
