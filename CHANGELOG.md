# ✨ Changelog (`v3.27.0`)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Version Info

```text
This version -------- v3.27.0
Previous version ---- v3.26.4
Initial version ----- v2.1.0
Total commits ------- 2
```

## [v3.27.0] - 2026-03-04

### :arrows_counterclockwise: Changed

- voter-list-table component: Make empty voter list creation available for political assemblies

###

## [v3.26.5] - 2026-02-20

### :arrows_counterclockwise: Changed

- i18n text for SEND_ONLY_TO_HOUSEHOLDER_HINT

## [v3.26.4] - 2026-02-06

### 🔄 Changed

- derive BBT pipeline version from config

## [v3.26.3] - 2026-02-06

### 🔄 Changed

- extend CD pipeline with enhanced bug bounty publication workflow

## [v3.26.2] - 2026-01-27

### 🆕 Added

- add readonly attachment detail infos

## [v3.26.1] - 2026-01-21

### :arrows_counterclockwise: Changed

- validation of birthdate and religion in generate-manual-voting-cards componets

## [v3.26.0] - 2025-12-15

### :new: Added

- Religion Codes
  - "4": "E WR - evangelische Ausländer & Minderjährige"
  - "5": "K WR - katholische Ausländer & Minderjährige"

### :arrows_counterclockwise: Changed

- fixed setting of Religion Code to voter

## [v3.25.0] - 2025-12-09

### :new: Added

- new options  includeDomainOfInfluenceChurch and includeDomainOfInfluenceSchool in voting-card-layout-data-configuration component

## [v3.24.3] - 2025-12-04

### 🔄 Changed

- STEP_GENERATE_VOTING_CARDS.CONFIRM_MESSAGE

## [v3.24.2] - 2025-12-03

### 🔄 Changed

- fix table header alignment for filterable tables

## [v3.24.1] - 2025-12-02

### 🔄 Changed

- consider empty voter lists correctly on edit and step completion

## [v3.24.0] - 2025-12-02

### 🆕 Added

- add voter lists with empty voting cards

## [v3.23.1] - 2025-11-20

### 🔄 Changed

- update base components and angular lib

## [v3.23.0] - 2025-11-20

### 🆕 Added

- add empty voting cards per domain of influence flag

## [v3.22.4] - 2025-11-19

### 🔄 Changed

- behaviour of form elements in manual-voting-card-voter-edit component. dont's show householder flag if it's not selected for print. no validation of optional elements if not required for print.

## [v3.22.3] - 2025-11-19

### 🔄 Changed

- extend voter duplicate with street and house number

## [v3.22.2] - 2025-11-18

### 🆕 Added

- add domain of influence bfs to e-voting table

## [v3.22.1] - 2025-11-18

### 🆕 Added

- religion and isHouseholder to voter model and manual-voting-card-voter-edit component.
- new input configuration? to manage optional fields and updateReligionCode event for religion validation.

### 🔄 Changed

- disable-flag and required-flag behaviour of optional fields in manual-voting-card-voter-edit component
- read dataConfiguration and inject to generate-manual-voting-cards component.

## [v3.22.0] - 2025-11-05

### 🆕 Added

- new VOTING_CARD_SORTS: Ort, Religion, Haushalsvorstand

## [v3.21.0] - 2025-10-28

### 🆕 Added

- Input item isStistat and isPoliticalAssembly for component app-voting-card-layout-data-configuration-edit

### 🔄 Changed

- disable checkboxes person-id and date-of-birth if domainofinfluence is stitat municipality and contest is not political assemly for: manager-voting-card-dialog, layout-voting-cards-contest-manager, layout-voting-cards-political-business-attendie

## [v3.20.2] - 2025-10-22

### 🔄 Changed

- angular and base components update

## [v3.20.1] - 2025-10-01

### 🔄 Changed

- always show voter list settings tab for contest manager

## [v3.20.0] - 2025-09-25

### 🆕 Added

- add version choice and eCH-0045 v6 to e-voting export

## [v3.19.1] - 2025-09-15

### 🔄 Changed

- fix upload size limit for import files

## [v3.19.0] - 2025-08-25

### 🆕 Added

- add main voting cards domain of influence

## [v3.18.2] - 2025-08-21

### 🆕 Added

- add voting card counts

## [v3.18.1] - 2025-08-13

### 🔄 Changed

- customize pdf viewer toolbar

## [v3.18.0] - 2025-07-25

### 🆕 Added

- add voting card layout data configuration

## [v3.17.3] - 2025-07-25

### 🔄 Changed

- use pdf.js to display PDF previews

## [v3.17.2] - 2025-07-17

### 🔄 Changed

- fix voter zip code input and eCH-0045 file input

## [v3.17.1] - 2025-07-17

### 🔄 Changed

- confirm-dialog.component: make confirm button color overwritable
- generate-voting-cards.component: if cancel confirmation make app-wizard-sidebar editable again

## [v3.17.0] - 2025-07-11

### 🔄 Changed

- bump BC version

## [v3.16.0] - 2025-07-02

### 🔄 Changed

- added confirm dialog to generate-voting-card.component

## [v3.15.0] - 2025-06-23

### 🔄 Changed

- disable generate voting cards if not all political business are e-voting approved

## [v3.14.0] - 2025-06-17

### 🔄 Changed

- contest-table component: added sorting with defaultSoring as input, added filtering over all columns.

## [v3.13.2] - 2025-06-10

### 🔄 Changed

- layout-voting-cards-political-business-attendee.component: show STEP_LAYOUT_VOTING_CARDS_POLITICAL_BUSINESS_ATTENDEE.EDIT_TEMPLATE_DATE_E_VOTING_HINT if not political assembly and has e-voting

## [v3.13.1] - 2025-06-03

### 🆕 Added

- Table column deliveryToPostDeadline to contest-table

### 🔄 Changed

- used <app-print-job-states> component for printJobState to use the same colour code like in contest-overview-print-job-table component.

## [v3.13.0] - 2025-05-28

### 🆕 Added

- printJobState Column in contest-table component

## [v3.12.0] - 2025-05-28

### 🔄 Changed

- refactor dockerfile
- remove redundant file copies
- add explicit workdir in final image to avoid surprises
- consume base images from harbor proxy

### ❌ Removed

- remove entrypoint shell script since its functionality is shifted to the deployment in ops repo

### 🔒 Security

- refactor dockerfile
- using explicit nginx user instead of root for copying nginx configs and webroot

## [v3.11.2] - 2025-05-21

### 🔄 Changed

- fix electoral register evoting active date

## [v3.11.1] - 2025-05-16

### 🆕 Added

- add communal deadlines preview

## [v3.11.0] - 2025-05-05

### 🔄 Changed

- moved contest proto mapping to contest service.
- added Type Column to contest table
- added type to Cotest Model

## [v3.10.0] - 2025-05-01

### 🔄 Changed

- set domainOfInfluenceColumn in contest table component as default

## [v3.9.2] - 2025-04-28

### 🔄 Changed

- allow non-standard delivery to post deadlines

## [v3.9.1] - 2025-03-27

### 🔄 Changed

- display generating icon on voting journal export only on the current export item

## [v3.9.0] - 2025-03-27

### 🆕 Added

- add contest dates electoral register e-voting from and delivery to post

## [v3.8.0] - 2025-03-17

### 🆕 Added

- generate empty manual voting card

## [v3.7.1] - 2025-03-11

### 🔄 Changed

- fix checkable items behavior when unselecting a single checkbox when all are checked

## [v3.7.0] - 2025-03-07

### 🆕 Added

- support voting exports for single voter lists

## [v3.6.2] - 2025-03-05

### 🔄 Changed

- autocomplete fix after bc update

## [v3.6.1] - 2025-03-05

### 🔄 Changed

- fix political assembly save disabled in import dialog

## [v3.6.0] - 2025-03-04

### 🔄 Changed

- angular 19 update

## [v3.5.0] - 2025-02-28

### 🆕 Added

- domain of influence voter duplicate handling

## [v3.4.1] - 2025-02-17

### 🔄 Changed

- fix wrong event propagation by sort in voting card configuration and disable fields if readonly

## [v3.4.0] - 2025-01-28

### 🆕 Added

- send attachment only to householder

## [v3.3.0] - 2025-01-24

### 🆕 Added

- button to export e-voter table content on e-voting-domain-of-influence-table.component.

## [v3.2.1] - 2025-01-08

### 🔄 Changed

- fix electoral registration switch

## [v3.2.0] - 2025-01-07

### 🆕 Added

- add robots meta tag to instruct crawlers to not index content
- add X-Robots-Tag response header to instruct crawlers to not index content

## [v3.1.0] - 2024-12-12

### 🆕 Added

- introduced a setting to disable UI elements for electoral registration imports

## [v3.0.8] - 2024-12-06

### ❌ Removed

- remove unused political business approved field

## [v3.0.7] - 2024-12-06

### 🔄 Changed

- add additional invoice position comment

## [v3.0.6] - 2024-12-04

### 🔄 Changed

- show votingcards triggered timestamp in voting journal step hint

## [v3.0.5] - 2024-11-28

### 🔄 Changed

- introduce column max-width in voter list table

## [v3.0.4] - 2024-11-25

### 🔄 Changed

- ensure unique station on communal attachments

## [v3.0.3] - 2024-11-22

### 🔄 Changed

- show e-voting hint on voting card attendee layout

## [v3.0.2] - 2024-11-19

### 🔄 Changed

- change A6 to a standard attachment format

## [v3.0.1] - 2024-11-15

### 🔄 Changed

- add redirect to previous page in print job details

## [v3.0.0] - 2024-11-15

BREAKING CHANGE: update Angular to version 18

### 🔄 Changed

- update Angular to version 18
- migrate to new build system

## [v2.5.2] - 2024-11-14

### 🔄 Changed

- prevent print job table disabled entry click

## [v2.5.1] - 2024-10-16

### 🔄 Changed

- make contest approval revertable

## [v2.5.0] - 2024-10-08

### 🆕 Added

- voter list auto send voting cards to doi return address split

## [v2.4.2] - 2024-10-03

### 🔄 Changed

- fix logout after new tab is opened

## [v2.4.1] - 2024-09-18

### 🔄 Changed

- increase max length of attachment name and supplier

## [v2.4.0] - 2024-09-17

### 🆕 Added

- add filtering, sorting and a total row to e-voting table

## [v2.3.8] - 2024-09-12

### 🔄 Changed

- adjust attachments hint text

## [v2.3.7] - 2024-09-03

### 🔄 Changed

- migrate from gcr to harbor

## [v2.3.6] - 2024-08-28

### :arrows_counterclockwise: Changed

- update bug bounty template reference
- patch ci-cd template version, align with new defaults

## [v2.3.5] - 2024-08-14

### :arrows_counterclockwise: Changed

- refresh preview when template bricks have changed

## [v2.3.4] - 2024-08-05

### 🔄 Changed

- adjust salutation width

## [v2.3.3] - 2024-07-26

### 🔄 Changed

- voter-list-electoral-register-edit-dialog.component.html remove cancel button on step 2/2 importing voter list

## [v2.3.2] - 2024-07-19

### ❌ Removed

- remove voting card group bfs

## [v2.3.1] - 2024-07-15

### 🔄 Changed

- index.html set default language to german and disable google translation

## [v2.3.0] - 2024-07-11

### 🆕 Added

- show error message if actuality for selected stimmregister filter is not up to date

## [v2.2.2] - 2024-07-11

### 🆕 Added

- add additional print job details

## [v2.2.1] - 2024-07-09

### 🔄 Changed

- fix voter list filter autocomplete

## [v2.2.0] - 2024-07-03

### 🔄 Changed

- voter-list-upload-edit-dialog.component.html remove cancel button on step 2/2 importing voter list

## [v2.1.0] - 2024-06-14

### 🎉 Initial release for Bug Bounty
