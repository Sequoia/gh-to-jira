var Promise = require('bluebird');
var JiraClient = require('jira-connector');
const TRANSITIONS = require('./transitions.js');

module.exports = {
    finishWork,
    requestReview,
    requestRevisions,
    approve
}

var jira = new JiraClient( {
    host: 'eventmobi.atlassian.net',
    basic_auth: {
        username: process.env.JIRA_USER,
        password: process.env.JIRA_PW
    }
});

var issue = Promise.promisifyAll(jira.issue);

function finishWork(issueKey){
    return doTransition(issueKey, TRANSITIONS.FINISH_WORK);
}

function requestReview(issueKey){
    return doTransition(issueKey, TRANSITIONS.REQUEST_REVIEW);
}

function requestRevisions(issueKey){
    return doTransition(issueKey, TRANSITIONS.REQUEST_REVISIONS);
}

function approve(issueKey){
    return doTransition(issueKey, TRANSITIONS.APPROVE);
}

/**
 * 
 * @param {string} issueKey 
 * @param {string} transition 
 * @return {Promise}
 */
function doTransition(issueKey, transition){
    return issue.transitionIssue({
        issueKey,
        transition
    });
}


// async function run(){
//     let result;
//     try{
//         result = await finishWork('SS-1');
//     }catch(e){
//         console.error("ERROR");
//         console.error(e);
//     }
//     console.log(result);
//     console.log('SUCCESS');
// }