var _ = require('lodash');

var getTasks = function(gulpRef) {
    return _.keys(gulpRef.tasks);
};

var defaultFilter = function(taskName) {
    if (taskName.indexOf('_') === 0) {
        return false;
    }
    return true;
};

module.exports = function(gulp, options) {
    options || (options = {});
    var filter = options.filter || defaultFilter;
    var COMPLETION_TASK = '_bash-completion-helper';
    gulp.task(COMPLETION_TASK, function() {
        var tasks = getTasks(gulp);
        tasks = _.filter(tasks, function(task) {
            if (task === COMPLETION_TASK) {
                return false;
            }
            return filter(task);
        });
        console.log(tasks.join('\n'));
    });
};
