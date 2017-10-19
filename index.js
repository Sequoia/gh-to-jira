const { json } = require('micro');
const jira = require('./jiraside.js');

module.exports = async (req, res) => {
  const body = await json(req);
  console.log(body);
  const action = getTransition(body);
  if(action){
    console.log('ACTION IDENTIFIED!!!');
    console.log(action);
    return await action.transition(action.issueKey)
  }else{
    console.log('NO ACTION IDENTIFIED');
    return 'no action identified';
  }
}

function getTransition(event){
  if(reviewRequested(event)){ return reviewRequested(event) }
  if(revisionRequested(event)){ return revisionRequested(event) }
  if(approved(event)){ return approved(event) }
  if(merged(event)){ return merged(event) }
  
  return null;
}

//branch name MUST be ticket number/key (e.g. CORE-273)
function reviewRequested(event){
  if(event.action === "review_requested"){
    return {
      transition : jira.requestReview,
      issueKey: event.pull_request.head.ref
    }
  }
  return null;
}

//branch name MUST be ticket number/key (e.g. CORE-273)
function revisionRequested(event){
  if(event.action === "submitted" && event.review && event.review.state === "changes_requested"){
    return {
      transition : jira.requestRevisions,
      issueKey: event.pull_request.head.ref
    }
  }
  return null;
}

//branch name MUST be ticket number/key (e.g. CORE-273)
function approved(event){
  if(event.action === "submitted" && event.review && event.review.state === "approved"){
    return {
      transition : jira.approve,
      issueKey: event.pull_request.head.ref
    }
  }
  return null;
}

//branch name MUST be ticket number/key (e.g. CORE-273)
function merged(event){
  if(event.action === "closed" && event.pull_request && event.pull_request.merged === true){
      return {
          transition : jira.finishWork,
          issueKey: event.pull_request.head.ref
      }
  }
  return null;
}