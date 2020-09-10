# InformeraD

InformeraD genom email.

Work in progress.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/informerad.svg)](https://npmjs.org/package/informerad)
[![Downloads/week](https://img.shields.io/npm/dw/informerad.svg)](https://npmjs.org/package/informerad)
[![License](https://img.shields.io/npm/l/informerad.svg)](https://github.com/d-sektionen/informerad/blob/master/package.json)

<!-- toc -->
* [InformeraD](#informerad)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @d-sektionen/informerad
$ informerad COMMAND
running command...
$ informerad (-v|--version|version)
@d-sektionen/informerad/1.0.0 linux-x64 node-v12.17.0
$ informerad --help [COMMAND]
USAGE
  $ informerad COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`informerad help [COMMAND]`](#informerad-help-command)
* [`informerad send`](#informerad-send)
* [`informerad setting SETTING VALUE`](#informerad-setting-setting-value)

## `informerad help [COMMAND]`

display help for informerad

```
USAGE
  $ informerad help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `informerad send`

Generates and sends an email.

```
USAGE
  $ informerad send

OPTIONS
  -h, --help                             show CLI help
  -l, --layout=newsletter|announcement   [default: newsletter] the email layout template
  -p, --preview=0|1|2|3                  type of preview, will prompt if omitted
  -r, --recipients=recipients            path to json file of recipients
  -t, --title=title                      the email title, aka subject, will prompt if omitted
  --content=content                      path to folder of mail content
  --django_backend                       retrieve recipients from the D-sektionen Django backend
  --export_recipients=export_recipients  path to json file which recipients are exported to.
  --schedule                             get prompted to schedule sending
  --test                                 enable mailgun test mode
```

_See code: [src/commands/send.ts](https://github.com/d-sektionen/informerad/blob/v1.0.0/src/commands/send.ts)_

## `informerad setting SETTING VALUE`

Command for configuring the different settings of InformeraD.

```
USAGE
  $ informerad setting SETTING VALUE

ARGUMENTS
  SETTING  mgkey: Mailgun private key.
           djangotoken: Django backend access token.
           wpkey: (Outdated) Wordpress access token.
           wpuser: (Outdated) Wordpress username for the sender.

  VALUE    The string value of the setting

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/setting.ts](https://github.com/d-sektionen/informerad/blob/v1.0.0/src/commands/setting.ts)_
<!-- commandsstop -->
