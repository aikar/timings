Aikar's Minecraft Timings Viewer
=======

This is the system behind <http://timings.aikar.co/> that processes timing reports.
This code base is primarily targeting Timings v2, currently released for PaperSpigot and SpongeForge.

It is unknown when it will be added to Spigot, so we suggest moving to PaperSpigot! [Learn More and Get PaperSpigot here](https://paper.readthedocs.org/en/paper-1.8/)

If you can think of something to improve the system please feel free to PR it.
 

Contributing
======

The main thing holding up Timings v2 in Spigot is this Web UI for it! I don't have time to focus on it, so any help to get it close to usable for general public would be appreciated!

Current Active Contributors:
  - Aikar - Project Owner
  - DemonWav
  - willies952002

Want to contribute? Join #aikar Spigot IRC ([join here](https://irc.spi.gt/iris/?channels=#aikar)), 
and let me know what your interested in working on so we don't have people working on the same thing.

We're currently in the middle of migrating the JS code to Dart. So hold off before working on any JS code.

Setting Up Environment
=====
You need A webserver such as Apache or Nginx, and PHP 5.6.
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
>custom_security="../security/security.php"  
>dev_id=ae6cfe033ca541f39a0fc52c3b51b2e1

Current Priorities
=====

Updating the web UI to include plugin data, per-timings (v1 style) data, config viewing, "chunk/region" reports, is a top priority.

Also anything to make the web UI LOOK better is needed. Current idea is to use Polymer UI components.

JavaScript and UI
======
We are using JSX and React (Well, will be using React) for front end development.
Original plans for Dart were scrapped.

Timings File Format
======
The timings v2 file format is not designed for public use. It is highly condensed and meant to be specially known how to parse it.

While the overall structure of the file is now done, we are still planning future additions to the data dump.

We ask that instead of trying to parse this file for your needs, to instead PR the change to this project instead so
everyone can benefit from it.

This file format is proprietary and may change without notice. 

License
======
The project is licensed under MIT as I'm a "I don't care" type of person usually, but I'd really prefer if clones did not start up for no good reason.

Remember: [when to fork](http://jamesdixon.wordpress.com/forking-protocol-why-when-and-how-to-fork-an-open-source-project/).

I'm totally open to any reasonable improvement. So if you think it can be better, talk to me on Spigot or Esper IRC and PR :)

If I disappear from Minecraft, then please keep this tool alive!
