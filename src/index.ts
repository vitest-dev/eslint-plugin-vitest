import assertionType from "./rules/assertion-type"
import lowerCaseTitle from "./rules/lower-case-title"
import noSkippedTests from "./rules/no-skipped-tests"


export default {
    rules: {
        'no-skip-test': noSkippedTests,
        'lower-case-title': lowerCaseTitle,
        'assertion-type': assertionType,
    }
}
