# Translation

This file serves the purpose to explain the basics of translations/localization via NGX-Translate.

## Sources

One can read all about NGX-Translate on the offical website http://www.ngx-translate.com/.
The whole documentation can be found under https://github.com/ngx-translate/core .

A good recommendation for handling the locale files is BabelEdit - localization editor with support 
of multiple formats and structural view of the whole files - https://www.codeandweb.com/babeledit .

## Pre-Usage

Before using the actual translations one has to configure the angular application to support NGX-Translate.
First of all add the dependency to the angular application via 
`npm install @ngx-translate/core --save`

After that the `AppModule` has to import the `TranslateModule` from `@ngx-translate/core`. Inside
the imported `TranslateModule` one can configure the loader of the locale files - in this case we used
the standard `TranslateHttpLoader` to load the files via HTTP.
Now all the components can use the `TranslateService` from `@ngx-translate/core` to access the translations.
Inside the `AppComponent`'s constructor we set the default language (fallback) and the language to use
on start.

## Usage

### Localization file

The localization files are named after the language code, e.g. en = english, de = german. The files 
are structured as JSON with nested namespaces - a dot (.) between two ids will put it as a child of 
the previous id.

### Translate-Pipe

To use the translations inside the HTML files one should use the `translate`-Pipe provided by the
NGX-Translate library.

`<div>{{ '[IDS_SEPARATED_BY_DOT]' | translate }}</div>`

### TranslateService

To refresh default elements inside for example dropdown menus one has to use the `TranslateService`
inside typescript. Inject the `TranslateService` as a constructor parameter and use it like

`this.translate.instant('[IDS_SEPARATED_BY_DOT]')`

When using this method one also has to subscribe to the `OnLangChange` event of the `TranslateService`
to trigger refreshes of the required components to load the correct strings.

### Placeholders

NGX-Translate also supports placeholders for value replacements. To use it use `{[FREE_VARIABLE_NAME]}`
inside of translations. To replace the placeholder with a value from a variable use the `translate`-
Pipe like 

`<div>{{ '[IDS_SEPARATED_BY_DOT]' | translate:{[FREE_VARIABLE_NAME]: [VALUE]} }}</div>`
