# Bookclub Server

Describes the code standards & flow for the server side code.

## Getting Started

Type the following command to run the program:

    $ npm start

## Notable Tech Used

These technologies are used very heavily and will be useful to have some familiarity with.

- Typescript
- mongoose (and thus, mongo)
- express

### Code Structure

- `config`: Configuration settings (pulled from shared)
- `lib`: Code used by, but not necessarily related to, the current project. Also contains files that "wrap" their module (ie. the rest of the codebase would never need to include the actual 3rd-party module, because the lib file includes it and configures it for the rest of the codebase)
- `middleware`: Middleware functions for express. Mostly related to authentication.
- `routes`: Express routes - also contains, inline, what many apps would consider the controllers
- `schemas`: Database schemas
- `services`: Domain-specific helpers (that _can_ retain state)
- `sockets`: Currently not used
- `utils`: Domain-independent helpers (that _cannot_ retain state)