status quo ante:
 - most popular keymaps shown in the app already have widespread support in downloadable KLC files
 - those files often have usufully customized AltGr layers
 - thumb letter keymaps can't be implemented with just KLC
 - but one service we can provide to the world by exporting KLC export from this app is for the wide-hand keymaps that vary the US ANSI layout:
    - qwerty wide & qwpr wide
 - another, less important service is to provide KLC keymaps for other keymaps shown in the app. Maybe someone wants to experiment with any of my Cozy or TopNine variants? (Ah, it's uncomfortable to even think about that, but let's try to ignore that and just go for the simple solution.)


solution approach:
 - read the existing US ANSI base file, keep the header and footer.
 - change the locale-name, define a meaningful naming pattern with abbrev for each keymap and -w or something as suffix for the wide variant
 - swap entire keys (keep the scancod in the first colum and swap the content of remaining columns)

Let's see if this spec is enough for the AI to do it. I'll probably need to give some pointers on where to put the UI for it and some things like that...

