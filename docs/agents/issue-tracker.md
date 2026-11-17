# GitHub issue tracker

Issues and specifications for this repository live in GitHub Issues in `reelout/chiplet`. Use the `gh` CLI for issue-tracker operations.

## Issue operations

Use the `reelout/chiplet` repository for issue operations.

| Task                | Command                                                                         |
| ------------------- | ------------------------------------------------------------------------------- |
| Create              | `gh issue create --title "..." --body "..."`                                    |
| Read                | `gh issue view <number> --json number,title,body,labels,comments`               |
| List                | `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` |
| Comment             | `gh issue comment <number> --body "..."`                                        |
| Add / remove labels | `gh issue edit <number> --add-label "..."` / `--remove-label "..."`             |
| Close               | Comment with the resolution, then run `gh issue close <number>`.                |

Use heredocs for multi-line issue bodies. Add relevant `--label` and `--state` filters when listing issues.

Before creating an issue, confirm the target repository with `gh repo view --json nameWithOwner`. Create issues only in the user's repository; ask for confirmation if the target is not theirs. In a fork, `gh` may default to the upstream repository.

### Sub-issues and blockers

Use GitHub's native issue relationships where available:

- Link a child issue with `gh issue create --parent <parent> ...` or `gh issue edit <parent> --add-sub-issue <child>` (`gh` 2.94+). For older versions, use `gh api --method POST repos/<owner>/<repo>/issues/<parent>/sub_issues -F sub_issue_id=<child-db-id>`. If sub-issues are unavailable, begin the child body with `Part of #<parent>`.
- Record blockers with `gh issue create --blocked-by <number>,<number> ...` or `gh issue edit <child> --add-blocked-by <blocker>` (`gh` 2.94+). For older versions, use `gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>`. The API requires the blocker's numeric database ID, not its issue number or node ID; retrieve it with `gh api repos/<owner>/<repo>/issues/<number> --jq .id`.
- If native dependencies are unavailable, begin the child body with `Blocked by: #<number>, #<number>`. An issue is unblocked when all its blockers are closed.
- Count open blockers with `gh api repos/<owner>/<repo>/issues/<number> --jq .issue_dependencies_summary.blocked_by`. Alternatively, use `gh issue view <number> --json blockedBy` and count open entries with `--jq '[.blockedBy.nodes[] | select(.state == "OPEN")] | length'`.

## Pull requests and triage

Pull requests are **not** a request surface for triage in this repository. If that policy changes, update this setting to `yes`; `/triage` uses it to decide whether to handle external PRs like issues.

When enabled, use the `gh pr` equivalents for reading, listing, commenting, labeling, and closing PRs. For example, read with `gh pr view <number>`, review comments with `gh pr view <number> --comments`, and inspect changes with `gh pr diff <number>`. To list external PRs, use:

```sh
gh api --paginate 'repos/{owner}/{repo}/pulls?state=open' --jq '.[] | select(.author_association | IN("OWNER","MEMBER","COLLABORATOR") | not) | {number, title, author: .user.login, author_association, labels: [.labels[].name]}'
```

GitHub shares one number space across issues and PRs. To identify a reference such as `#42`, try `gh pr view 42` and, if it is not a PR, `gh issue view 42`.

When a skill asks you to publish to the issue tracker, create a GitHub issue. When it asks you to fetch a ticket, read the issue as described above.

## Wayfinder

`/wayfinder` uses one issue as a map and its child issues as tickets:

- Create the map with the `wayfinder:map` label. Its body holds Notes, Decisions-so-far, and Fog.
- Link each ticket as a sub-issue of the map. If sub-issues are unavailable, add it to a task list in the map body and start its body with `Part of #<map>`.
- Label tickets `wayfinder:<type>`, where `<type>` is `research`, `prototype`, `grilling`, or `task`.
- To find the next ticket, list the map's open children in map order. Skip tickets with an open blocker or an assignee; choose the first remaining ticket.
- Claim a ticket with `gh issue edit <number> --add-assignee @me`. This is the session's first write.
- Resolve it by posting the answer, closing the ticket, and adding a context pointer (gist and link) to the map's Decisions-so-far.
