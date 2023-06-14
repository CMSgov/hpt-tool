# How to Contribute

We're so thankful you're considering contributing to an [open source project of
the U.S. government](https://code.gov/)! If you're unsure about anything, just
ask -- or submit the issue or pull request anyway. The worst that can happen is
you'll be politely asked to change something. We appreciate all friendly
contributions.

We encourage you to read this project's CONTRIBUTING policy (you are here), its
[LICENSE](LICENSE.md), and its [README](README.md).

## Getting Started

Looking for a starting place to contribute? Check out our issues labeled ["good first issue"](https://github.com/CMSgov/hpt-validator-tool/labels/good%20first%20issue) or ["help wanted"](https://github.com/CMSgov/hpt-validator-tool/labels/help%20wanted).

### Building the Project

```sh
npm install
```

### Workflow and Branching

We follow the [GitHub Flow Workflow](https://guides.github.com/introduction/flow/)

1.  Fork the project
1.  Check out the `main` branch
1.  Create a feature branch
1.  Write code and tests for your change
1.  From your branch, make a pull request against `cmsgov/hpt-validator-tool/main`
1.  Work with repo maintainers to get your change reviewed
1.  Wait for your change to be pulled into `cmsgov/hpt-validator-tool/main`
1.  Delete your feature branch

### Testing Conventions

We use [ava](https://github.com/avajs/ava) for tests, and any PRs should include tests to verify functionality.

### Coding Style and Linters

We're using prettier and eslint to format and lint our code. You can run the following commands to automatically fix issues

```
npm run prettier:fix
npm run lint:fix
```

### Issues

See a bug or have a suggestion for a feature? File an issue, filling out the items in our issue template.

### Pull Requests

Generally pull requests should link to existing issues, but if you have a small change feel free to submit it without creating an issue in advance.

## Documentation

We welcome improvements to the project documentation or to the existing
docs. Please file an [issue](https://github.com/CMSGov/hpt-validator-tool/issues).

## Policies

### Open Source Policy

We adhere to the [CMS Open Source
Policy](https://github.com/CMSGov/cms-open-source-policy). If you have any
questions, just [shoot us an email](mailto:opensource@cms.hhs.gov).

### Security and Responsible Disclosure Policy

The Centers for Medicare & Medicaid Services is committed to ensuring the
security of the American public by protecting their information from
unwarranted disclosure. We want security researchers to feel comfortable
reporting vulnerabilities they have discovered so we can fix them and keep our
users safe. We developed our disclosure policy to reflect our values and uphold
our sense of responsibility to security researchers who share their expertise
with us in good faith.

_Submit a vulnerability:_ Unfortunately, we cannot accept secure submissions via
email or via GitHub Issues. Please use our website to submit vulnerabilities at
[https://hhs.responsibledisclosure.com](https://hhs.responsibledisclosure.com).
HHS maintains an acknowledgements page to recognize your efforts on behalf of
the American public, but you are also welcome to submit anonymously.

Review the HHS Disclosure Policy and websites in scope:
[https://www.hhs.gov/vulnerability-disclosure-policy/index.html](https://www.hhs.gov/vulnerability-disclosure-policy/index.html).

This policy describes _what systems and types of research_ are covered under this
policy, _how to send_ us vulnerability reports, and _how long_ we ask security
researchers to wait before publicly disclosing vulnerabilities.

If you have other cybersecurity related questions, please contact us at
[csirc@hhs.gov](mailto:csirc@hhs.gov).

## Public domain

This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).

All contributions to this project will be released under the CC0 dedication. By submitting a pull request or issue, you are agreeing to comply with this waiver of copyright interest.
