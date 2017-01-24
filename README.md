Aikar's Minecraft Timings Viewer v2
=======

This is the system behind <https://timings.aikar.co/> that processes Timing reports.
Timings v2 requires one of the following server softwares:
  - PaperSpigot 1.8.9
  - Paper 1.9+
  - Sponge (All)
  - Neptune
  - Nukkit
 
CraftBukkit/Spigot Support is vey unlikely, but it is strongly recommended to use Paper anyways! [Learn More and Get Paper here](https://paper.emc.gs)

If you can think of something to improve the system please feel free to PR it.

Technologies: JavaScript and UI
======
We are using JSX and React for front end development.

PHP is used to post process the JSON file into a more readable format and API processing, 
but i'm open to converting that to JS and removing the PHP from the project.

If you're up for that big of a project, please coordinate with me on IRC first and keep me in the loop on progress.

Contributing
======
The biggest thing holding this project back is the need for help! 
We would absolutely love any help on this project that you can give!

Current Active Contributors:
  - Aikar - Project Owner
  - willies952002
  - Fudgie (UI)

Want to contribute? Join #aikar Spigot IRC ([join here](https://irc.spi.gt/iris/?channels=#aikar)), 
and let me know what your interested in working on so we don't have people working on the same thing.


Setting Up Environment
=====
You need A webserver such as Apache or Nginx, and PHP 5.6 or PHP 7.
Apache is preferred incase .htaccess is needed.

Check out repo, copy config.ini to config.dev.ini and edit to your needs.

You'll also need [NodeJS v6.9 LTS](https://nodejs.org/en/download/)
You also need [Yarn](https://yarnpkg.com/en/docs/install).

Run `yarn` after checking out project to install node dependencies. (This replaces `npm install`)

To compile static resources and monitor them for changes, simply run `gulp` and control + c to abort watching.
Gulp will monitor all files for changes and recompile the css/js for you.

An initial debug data file is included in the project that will automatically load for dev environments.

You may create config.dev.ini to override config options like so:

>trusted_ip="10.0.1.100"    
>dev_id=ae6cfe033ca541f39a0fc52c3b51b2e1


Timings File Format
======
The Timings v2 file format is not designed for public use. It is highly condensed and meant to be specially known how to parse it.

While the overall structure of the file is now done, we are still planning future additions to the data dump.

We ask that instead of trying to parse this file for your needs, to instead PR the change to this project instead so
everyone can benefit from it.

This file format is proprietary and may change without notice. 

License
======
Minecraft Timings (c) Daniel Ennis (Aikar) 2014-present.

Minecraft Timings is licensed [MIT](https://tldrlegal.com/license/mit-license). See [LICENSE](LICENSE)

I'd really prefer if clones did not start up for no good reason.

Remember: [when to fork](http://jamesdixon.wordpress.com/forking-protocol-why-when-and-how-to-fork-an-open-source-project/).

I'm totally open to any reasonable improvement. So if you think it can be better, talk to me on Spigot or Esper IRC and PR :)

If I disappear from Minecraft, then please keep this tool alive!
