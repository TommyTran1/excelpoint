Workflow Transition Extra
====

Workflow Transition Extra is a submodule for [workflow][1]. It allows you to re-filter which user in roles can change 
workflow state. For now, it's getting allowed user from [entityreference][2] field attach to same bundle with workflow 
field.

This module can be extend for difference kind of users filter:

- [ ] filter by specify user
- [ ] filter by other field type

## 1. Install

- Install as normal Drupal module

## 2. Usage

- Enable module workflow_transition_extra
- Edit workflow, click Transitions Extra tab
- Select entityreference field contain users referenece
- Save

[1]: https://www.drupal.org/project/workflow
[2]: https://www.drupal.org/project/entityreference
