# Bookclub Client

Describes the code standards & flow for the client side code.

## Getting Started

Type the following command to run the program:

    $ npm start

## Notable Tech Used

These technologies are used very heavily and will be useful to have some familiarity with.

- Typescript
- React
- Redux (Action/State management)
- @material-ui (a React component library that follows Material Design)
- React Router

## Patterns & Standards

These patterns & standards are used throughout the application, and will be useful to have some familiarity with.

- [BEM CSS Class Naming Conventions](http://getbem.com/)
- [CSS Class Naming Prefixes](https://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/)
- [Display & Container Components](https://www.thegreatcodeadventure.com/the-react-plus-redux-container-pattern/) (*note:* I have also implemented the following types)
    - `icons`: Display components, but specific for icons.
    - `pages`: These are like container components, but wrap an entire page, and are meant to include other container components (whereas normal container components should only include display components)
    - `hybrid`: Monstrosities that are a combination of other types of components

### Nitpicky Conventions
- on modal vs dialog: https://www.quora.com/Whats-the-difference-between-a-modal-and-dialog
- on react component function binding: https://medium.freecodecamp.org/the-best-way-to-bind-event-handlers-in-react-282db2cf1530 and https://medium.freecodecamp.org/react-binding-patterns-5-approaches-for-handling-this-92c651b5af56

### Code Structure

- `actions`: Redux actions
- `clients`: Abstractions around API endpoints
- `components`: React components
- `config`: Configuration settings (pulled from shared)
- `lib`: Code used by, but not necessarily related to, the current project
- `reducers`: Redux reducers, to generate state from actions
- `services`: Domain-specific helpers (that _can_ retain state)
- `types`: Typescript types (pulled from shared)
- `utils`: Domain-independent helpers (that _cannot_ retain state)