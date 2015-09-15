#!/usr/bin/env bash
#
# Bash completion for Gulp tasks. (http://gulpjs.com/)
#
# Most of this is lifted from a Fabric bash completion script written by Konsantin Bakulin:
# https://github.com/kbakulin/fabric-completion/blob/master/fabric-completion.bash
#
# (c) 2014 Scott Ivey. All of my changes are provided under the same MIT-style license as
# Konstantin's original script, which you can find below.
#
#
#### Copyright (C) 2011 by Konstantin Bakulin

####  Permission is hereby granted, free of charge, to any person obtaining a copy
####  of this software and associated documentation files (the "Software"), to deal
####  in the Software without restriction, including without limitation the rights
####  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
####  copies of the Software, and to permit persons to whom the Software is
####  furnished to do so, subject to the following conditions:

####  The above copyright notice and this permission notice shall be included in
####  all copies or substantial portions of the Software.

####  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
####  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
####  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
####  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
####  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
####  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
####  THE SOFTWARE.

####  Thanks to:
####  - Adam Vandenberg,
####    https://github.com/adamv/dotfiles/blob/master/completion_scripts/fab_completion.bash

####  - Enrico Batista da Luz,
####    https://github.com/ricobl/dotfiles/blob/master/bin/fab_bash_completion



# Disable to turn off caching of tab completion results.
# If turned off, a gulp task will need to be executed each time tab completion is needed.
# This will result in a noticeable lag.
export GULP_COMPLETION_CACHE_TASKS=true

# File name where tasks cache will be stored (in current dir).
export GULP_COMPLETION_CACHED_TASKS_FILENAME=".gulp_tasks~"


# Set command to get time of last file modification as seconds since Epoch
case $(uname) in
    Darwin|FreeBSD)
        __GULP_COMPLETION_MTIME_COMMAND="stat -f '%m'"
        ;;
    *)
        __GULP_COMPLETION_MTIME_COMMAND="stat -c '%Y'"
        ;;
esac


#
# Get epoch time of last update to completion cache
#
function __gulp_cache_mtime() {
    $__GULP_COMPLETION_MTIME_COMMAND \
        $GULP_COMPLETION_CACHED_TASKS_FILENAME | xargs -n 1 expr
}


# Get epoch time of last change to gulpfile.js or gulp/**/*.(js|coffee)
function __gulp_gulpfile_mtime() {
    local f="gulpfile"
    local fdir="gulp"
    if [[ -e "${f}.js" ]]; then
        $__GULP_COMPLETION_MTIME_COMMAND "${f}.js" | xargs -n 1 expr
    else
        # Suppose that it's a fabfile dir
        find $fdir/**/*.\(js|coffee\) -exec $__GULP_COMPLETION_MTIME_COMMAND {} + \
            | xargs -n 1 expr | sort -nr | head -1
    fi
}


#
# Completion for "gulp" command
function __gulp_completion() {
    # Return if "gulp" command doesn't exist
    [[ -e $(which gulp 2> /dev/null) ]] || return 0

    # Variables to hold the current word and possible matches
    # see http://stackoverflow.com/questions/10528695/how-to-reset-comp-wordbreaks-without-effecting-other-completion-script
    # since colons are common for differentating e.g. dev/production gulp tasks, not allowing colons to wordbreak is important
    local cur
    _get_comp_words_by_ref -n : cur

    local opts=()

    local echo_gulp_tasks="gulp _bash-completion-helper --silent"

    # Generate possible matches and store them in variable "opts"
    case "$cur" in
        -*)
            if [[ -z "$__GULP_COMPLETION_LONG_OPT" ]]; then
                export __GULP_COMPLETION_LONG_OPT=$(
                    ${echo_gulp_tasks} | sort -u)
            fi
            opts="$__GULP_COMPLETION_LONG_OPT"
            ;;

        *)

            # If "fabfile.py" or "fabfile" dir with "__init__.py" file exists
            local f="gulpfile"
            local fd="gulp"
            if [[ -e "${f}.js" || (-d "$fd" && -e "$fd/*.(coffee|js)") ]]; then
                # Build a list of the available tasks
                if $GULP_COMPLETION_CACHE_TASKS; then
                    # If use cache
                    if [[ ! -s $GULP_COMPLETION_CACHED_TASKS_FILENAME ||
                          $(__gulp_gulpfile_mtime) -gt $(__gulp_cache_mtime) ]]
                    then
                        $echo_gulp_tasks > $GULP_COMPLETION_CACHED_TASKS_FILENAME \
                            2> /dev/null
                    fi
                    opts=$(cat $GULP_COMPLETION_CACHED_TASKS_FILENAME)
                else
                    # Without cache
                    opts=$(${echo_gulp_tasks} 2> /dev/null)
                fi
            fi
            ;;

    esac

    # Set possible completions
    COMPREPLY=($(compgen -W "$opts" -- $cur))
    __ltrim_colon_completions "$cur"

}
complete -o default -o nospace -F __gulp_completion gulp
