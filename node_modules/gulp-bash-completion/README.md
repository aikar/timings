# Gulp Bash Completion

## Simple Usage

You have to do two things:
- Add `gulp-bash-completion` to your `package.json`, require it somewhere in your gulpfile, and pass gulp into it.

```javascript
    var gulp = require('gulp');
    require('gulp-bash-completion')(gulp);
```

- Copy `gulp-completion.bash` somewhere and source it in your shell.

## More Usage
You can pass in an options object as the second argument to `gulp-bash-completion`'s exported function.  This only takes one option at the moment, `filter`.  It's used to filter tasks out of tab completion.
The default filter hides task names with a leading underscore, as well as the task added by `gulp-bash-completion` itself.

```javascript
    var gulp = require('gulp');
    require('gulp-bash-completion')(gulp, {
        filter: function(taskName) {
            if (!(taskName === 'smurf')) {
                return true;
            }
        }
    });
```

## Notes

- The bash script creates a cache file `.gulp_tasks~` in the same directory as your gulpfile.  Add it to any relevant .ignore files.
- Sometimes all the whitespace in Python makes me feel cold and empty.
