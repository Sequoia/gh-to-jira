const event = require('./PR_merged.json');
//branch name MUST be ticket number/key (e.g. CORE-273)
function merged(event){
    if(event.action === "closed" && event.pull_request && event.pull_request.merged === true){
        return {
            transition : "jira.finishWork",
            issueKey: event.pull_request.head.ref
        }
    }
    return null;
}
console.log(merged(event));