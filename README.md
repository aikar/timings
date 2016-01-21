Aikar's Minecraft Timings Viewer
=======

This is the system behind <http://timings.aikar.co/> that processes timing reports.
This code base is primarily targeting Timings v2, currently in development for Spigot.

If you can think of something to improve the system please feel free to PR it.

This project intends to support Sponge in the future too, or any project implementing the "Aikar Timings System" starting with v2. 

Contributing
======

The main thing holding up Timings v2 in Spigot is this Web UI for it! I don't have time to focus on it, so any help to get it close to usable for general public would be appreciated!

Current Active Contributors:
  - Aikar (Main of course)
  - DemonWav
  - willies952002

Want to contribute? Contact me on Spigot IRC, and let me know what your interested in working on so we don't have people working on the same thing.
Were considering movin the rendering aspect of the system to be done purely in JS so that may change soon.

Setting Up Environment
=====
You need a LAMP/MAMP/WAMP stack, check out folder, copy config.ini to config.dev.ini and edit to your needs.

You'll also need NodeJS v4 (first release after io.js merger)

Windows and Mac users may need to "npm rebuild" but i'm unsure if the binary based deps are needed or not.

To compile static resources and monitor them for changes, simply run `gulp` and control + c to abort watching.
Gulp will monitor all files for changes and recompile the css/js for you.


Timings File Format
======
This file format is still subject to rapid change, so please do not try to parse any preview I've given for production use!

License
======
The project is licensed under MIT as I'm a "I don't care" type of person usually, but I'd really prefer if clones did not start up for no good reason.

Remember: [when to fork](http://jamesdixon.wordpress.com/forking-protocol-why-when-and-how-to-fork-an-open-source-project/).

I'm totally open to any reasonable improvement. So if you think it can be better, talk to me on Spigot or Esper IRC and PR :)

If I disappear from Minecraft, then please keep this tool alive!
