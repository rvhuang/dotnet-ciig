# Contributing to dotnet-ciig

Please send pull requests or open issues in this repository. 

### About _questions.json_

* The `answer` field indicates whether the interfaces field is whitelisting or blacklisting.
* The `interfaces` field is case-sensitive.
* The `description` field supports Markdown syntax. The content is translated to HTML by [marked](https://www.npmjs.com/package/marked). All URLs are opened in new window.
* The `questionType` indicates whether the question is for **Questionnaire** (0) or **CheckList** (1). Currently `description` field is unused in check list mode.

### About _main.ts_

* The code will be built to _main.js_ which will be commited to _gh-pages_ and referred by _index.html_.
* The `InterfaceInfo` class represents supported collection interface types in the project. 

### About _faq.md_ and _about.md_ 

* The two files will also be shown in _index.html_, which are also translated to HTML by [marked](https://www.npmjs.com/package/marked). 

