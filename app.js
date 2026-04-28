import {
  buildGeneratedAnswer,
  buildSearchBox,
  buildSearchEngine,
} from 'https://static.cloud.coveo.com/headless/v3/headless.esm.js';

const agentId = 'YOUR_AGENT_ID_HERE';

const engine = buildSearchEngine({
  configuration: {
    accessToken: 'YOUR_API_KEY_HERE',
    environment: 'dev | prod',
    organizationId: 'YOUR_ORGANIZATION_ID_HERE',
    search: {
      pipeline: 'YOUR_PIPELINE_HERE',
      searchHub: 'YOUR_SEARCH_HUB_HERE',
    },
    analytics: {
      apiBaseUrl: 'https://analyticsdev.cloud.coveo.com/analytics/v1/',
      analyticsMode: 'legacy',
    },
  },
});

const searchBox = buildSearchBox(engine);
const generatedAnswer = buildGeneratedAnswer(engine, {
  agentId,
});

const form = document.getElementById('query-form');
const followupForm = document.getElementById('followup-form');
const input = document.getElementById('query-input');
const followupInput = document.getElementById('followup-input');
const answerText = document.getElementById('answer-text');
const followupAnswerText = document.getElementById('followup-answer-text');
const statusText = document.getElementById('status-text');

const render = () => {
  const searchBoxState = searchBox.state;
  const answerState = generatedAnswer.state;

  input.value = searchBoxState.value;

  if (answerState.isLoading) {
    statusText.textContent = 'Generating answer...';
  } else if (answerState.error) {
    statusText.textContent = `Error: ${answerState.error.message || 'Unable to generate answer'}`;
  } else if (answerState.cannotAnswer) {
    statusText.textContent = 'No answer generated for this query.';
  } else if (answerState.answer) {
    statusText.textContent = 'Answer ready.';
  } else {
    statusText.textContent = 'Ready.';
  }

  const answer = answerState.answer || '';
  answerText.textContent = answer || 'No answer yet.';

  const followUpAnswers = answerState.followUpAnswers?.followUpAnswers || [];
  const latestFollowUpAnswer = followUpAnswers[followUpAnswers.length - 1];
  followupAnswerText.textContent = latestFollowUpAnswer?.answer || 'No follow-up answer yet.';
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  searchBox.submit();
});

input.addEventListener('input', (event) => {
  searchBox.updateText(event.target.value);
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    searchBox.clear();
  }
});

followupForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const followUpQuestion = followupInput.value.trim();

  if (!followUpQuestion) {
    return;
  }

  generatedAnswer.askFollowUp(followUpQuestion);
  followupInput.value = '';
});

searchBox.subscribe(render);
generatedAnswer.subscribe(render);

render();
