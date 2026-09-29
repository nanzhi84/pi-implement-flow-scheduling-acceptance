# Isolated acceptance project

Only synthetic greeting data is used here. Implement only the assigned Ticket.
Do not change the execution contract or publisher. Preserve every existing
acceptance assertion and executable check; never delete, weaken or narrow them.
When the assigned Ticket explicitly requires new behavior, add its executable
behavior assertions before implementing that behavior. Additive coverage does
not authorize changing existing acceptance criteria.
Do not merge, approve PRs, modify main, or operate other workspaces.
Report requirement ambiguity before editing. Reviewer contexts are read-only.

For additive behavior, create executable acceptance/*.mjs files before the
implementation. The approved accept command executes these regular files in
sorted order after the original greeting assertions. Each must exit 0 and emit
one complete JSON object with exactly passed:true and a nonempty assertions
array of {name,passed:true}. Names must be unique across all assertions and
match [a-z0-9._-]{1,80}. These scripts must actually invoke and assert the
required behavior; a hardcoded success envelope is not a behavior check.
Use FLOW_RESOURCE_DIR for synthetic data. Any loopback listener must be owned
and closed inside its command; do not leave background processes running.
