# Coveo Headless Search Agent Demo

This folder contains a very small vanilla HTML and JavaScript demo for the Coveo Headless Search agent, which uses the generated-answer controller with an `agentId`.

## Initialize Headless

Before creating the Search agent, initialize the Headless engine with your Coveo credentials and search settings:

```js
const engine = buildSearchEngine({
  configuration: {
    accessToken: '...',
    environment: 'prod',
    organizationId: '...',
    search: {
      pipeline: '...',
      searchHub: '...',
    },
    analytics: {
      apiBaseUrl: 'https://analyticsdev.cloud.coveo.com/analytics/v1/',
      analyticsMode: 'legacy',
    },
  },
});
```

Relevant docs:

- [Headless usage overview](https://docs.coveo.com/en/headless/latest/reference/documents/usage/index.html)
- [Search module reference](https://docs.coveo.com/en/headless/latest/reference/modules/Search.html)

## How the Search agent is initialized

The Search agent is initialized on top of a Headless search engine with an `agentId`:

```js
const generatedAnswer = buildGeneratedAnswer(engine, {
  agentId,
});
```

Relevant docs:

- [buildGeneratedAnswer](https://docs.coveo.com/en/headless/latest/reference/functions/Search.buildGeneratedAnswer.html)
- [GeneratedAnswerProps](https://docs.coveo.com/en/headless/latest/reference/interfaces/Search.GeneratedAnswerProps.html)
- [GeneratedAnswerWithFollowUps](https://docs.coveo.com/en/headless/latest/reference/interfaces/Search.GeneratedAnswerWithFollowUps.html)

## State to read

The controller state is the main thing to inspect after a query or follow-up request.

The official reference is:

- [GeneratedAnswerWithFollowUpsState](https://docs.coveo.com/en/headless/latest/reference/interfaces/Search.GeneratedAnswerWithFollowUpsState.html)

Useful fields from that state:

- `state.answer`: the main generated answer text
- `state.answerId`: the backend answer identifier
- `state.answerContentFormat`: plain text or markdown
- `state.citations`: the source snippets attached to the answer
- `state.cannotAnswer`: whether the controller could not generate an answer
- `state.disliked`: whether the answer was disliked
- `state.expanded`: whether the answer is expanded
- `state.feedbackSubmitted`: whether feedback was submitted
- `state.fieldsToIncludeInCitations`: fields used in citations
- `state.generationSteps`: steps involved in generating the answer
- `state.isAnswerGenerated`: whether an answer was produced
- `state.isLoading`: whether the controller is still generating
- `state.isStreaming`: whether the answer is streaming in
- `state.isEnabled`: whether the controller is enabled
- `state.isVisible`: whether the answer is visible
- `state.liked`: whether the answer was liked
- `state.error`: the current error, if any
- `state.followUpAnswers`: the follow-up answer collection
- `state.responseFormat`: the desired response format

For the follow-up flow, read the follow-up answers collection from:

```js
const followUps = generatedAnswer.state.followUpAnswers.followUpAnswers;
```

`FollowUpAnswersState` has this shape:

```ts
export interface FollowUpAnswersState {
  /** The unique identifier of the follow-up answers conversation. */
  conversationId: string;
  /** The token proving the client originated the follow-up conversation. */
  conversationToken: string;
  /** Determines if the follow-up answer feature is enabled. */
  isEnabled: boolean;
  /** The follow-up answers. */
  followUpAnswers: FollowUpAnswer[];
}
```

Each item in `followUpAnswers` is a `FollowUpAnswer`, which extends the generated answer base and adds:

```ts
export interface FollowUpAnswer extends GeneratedAnswerBase {
  /** The question prompted to generate this follow-up answer. */
  question: string;
  /** Indicates if this follow-up answer is currently active. */
  isActive: boolean;
}
```

That means each follow-up item can carry its own answer text, citations, error, identifier, question, and active state.

## `askFollowUp()`

`askFollowUp(question)` submits a new question to the Search agent after the first answer is already available.

The core call is:

```js
generatedAnswer.askFollowUp('What about refunds?');
```

The method belongs to the generated-answer-with-follow-ups controller variant:

- [GeneratedAnswerWithFollowUps.askFollowUp](https://docs.coveo.com/en/headless/latest/reference/interfaces/Search.GeneratedAnswerWithFollowUps.html#askfollowup)

For the full state and method list:

- [GeneratedAnswerWithFollowUps](https://docs.coveo.com/en/headless/latest/reference/interfaces/Search.GeneratedAnswerWithFollowUps.html)

## Run it

Serve the folder with any local static server and open `index.html`.

## Demo


https://github.com/user-attachments/assets/023b5c0d-1007-4f94-89a2-f5e65a0b7a20



