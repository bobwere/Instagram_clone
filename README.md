# NestJS

## 🔥 Features

- ### 🏆 Graceful Production Deployment

- ### 🧭 Unified API Response Structure

- ### ⚡ Extreme Performance Optimize

- ### 📏 Fully Integrated to Coding Quality Tools

## 📓 Commands

### Commands Description

```bash
# build the app
$ pnpm build

# format the code
$ pnpm lint

# start the app
$ pnpm start

# run in development mode
$ pnpm start:dev || pnpm dev

# build the app and run it in production mode
$ pnpm start:prod || pnpm prod

# generate Swagger JSON schema
$ pnpm swagger

# test both unit test and e2e test
$ pnpm test

# test all the e2e test
$ pnpm test:e2e

# test all the unit test
$ pnpm test:unit
```

### Running Application for Development

```bash
$ git clone <repo>

$ pnpm install

# Fill in require information in .env file
$ cp .env.example .env

# Linux / Mac users may require (allow git hook script executable)
$ chmod +x .husky -R

$ pnpm dev
```

## ⭐ Coding Quality Tools Details Description

### ESLint

It statically analyzes your code to help you detect formatting issues and find code inconsistencies, here we extend the ESLint TypeScript recommend rules, the most popular JavaScript style [Airbnb](https://github.com/airbnb/javascript), auto import sorting and shaking plugins.

```text
# Config File
├── .eslintignore
└── .eslintrc.js
```

### Prettier

Similar to ESLint, but mainly focus on auto-formatting, not the code quality. Actually, ESLint can do all the jobs that Prettier can do, but for the formatting part, Prettier does better, so we import both and achieve each of the advantages. About the conflict of the formatting part, we can import `plugin:prettier/recommended` to solve this, but keep in mind that this plugin should extend at the last.

```text
# Config File
└── .prettierrc.js
```

### Editorconfig

It defines a standard code formatting style guide among all the IDEs and editors used within a team of developers. Basically, all the rules in the Editorconfig should sync with Prettier, Editorconfig focus on newly created files, ESLint and Prettier focus on existing files.

```text
# Config File
└── .editorconfig
```

### Husky + Commitlint + Lint-staged

These tools are the wrapper of [Git Hook](https://git-scm.com/book/zh-tw/v2/Customizing-Git-Git-Hooks). Lint-staged enforces you to format your code (run `pnpm lint`) before committing, but the tools will cache the file that is already formatted to improve performance. Commitlint enforces your commit message to fit a specific format, here we extend [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0) (officially recommend setting).

```text
# Type: build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test
# Commitlint Format:

<type>[optional scope]: <description>
[optional body]
[optional footer(s)]
```

```text
# Config File for Lint-staged
└── .lintstagedrc.js

# Config File for Commitlint
└── .commitlintrc.js

# Config File for Husky
├── .husky
|   ├── commit-msg  # call Commitlint to check the commit message
|   ├── pre-commit  # call Eslint to lint the coding issue
|   └── pre-push    # call Jest to do the unit + e2e test
```

### Git Attributes

To synchronize the end-of-line of the git repository.

```text
# Config File
└── .gitattributes
```

## ⚙️ Other Configuration

### Webpack

We overwrite the default `webpack.config.js` so that the production build can bundle all required libraries in `main.js`. For the configuration, we ignored a list of the nestjs-buildin library so that we could build it without error. If you need these libraries for your development, you can comment it in the lazy imports list.

### Alias Path

Using alias path can prevent dirty relative path (e.g. ../../../), also it is easier to import files that in the deep directory (e.g. src/assets/img/testing/...).

```text
# Config File
└── tsconfig.json
```

### API Response

#### Success Response

```json
{
  "data": {
    "...": "..."
  }
}
```

#### Error Response

```json
{
  "error": {
    "code": 400,
    "message": "..."
  }
}
```

We use Google JSON guide to be the response format implemented by [filtering](https://docs.nestjs.com/exception-filters) + [interceptor](https://docs.nestjs.com/interceptors), which is the built-in feature of NestJS, to sync with the response format. All exceptions will be caught by filtering, and all normal returns will be transformed by the interceptor.

```text
# Related Directory
├── src
|   ├── exception
|   ├── filter
|   └── interceptor
```

### Environment Variables Validation

We use [Joi](https://joi.dev/) library for the validation, which is recommended by NestJS.

```text
# Config File
├── src
|   └── app.config.ts
```

### HTTP Request

Since [@nestjs/axios](https://github.com/nestjs/axios) default return [Observable](https://rxjs.dev/guide/observable), it does not fit for the common use case (Promise based), so we use a custom module to implement secondary encapsulation of native Axios library, also extract .data from the response to prevent .data.data.data... chaining.

_Reference:_

- [Author Recommandation](https://github.com/nestjs/nest/issues/2613#issuecomment-513141287)

### Pino Logger

We used [nestjs-pino](https://github.com/iamolegga/nestjs-pino) to auto-log every request metadata and response time. We also centralized Pino config in `app.config.ts` for `main.js` reuse it.

### Swagger

[@nestjs/swagger](https://github.com/nestjs/swagger) allow you to auto-generate the API document, but here we decouple the document and the service. You can run `pnpm swagger` to generate the schema and put it into [Swagger UI](https://github.com/swagger-api/swagger-ui) to host your API document as a static page. We have two examples in `app.controller.ts` to show you how to integrate the Google JSON response format. We also have a GitHub Action example to auto-update the schema and host it to the GitHub Pages. If you do not want this setup, you can just follow [NestJS official guideline](https://docs.nestjs.com/openapi/introduction) to host your document inside the service.

![Swagger UI Final Output](https://gateway.pinata.cloud/ipfs/QmWVxHGQCJsHER1HLiNpMod67Qys96xN8vULhroFWfXv7v)

### Docker Containerization

We also set up the `Dockerfile` with multi-stage builds to optimize your image size and building time. For the docker-compose config, we also included health checking.

```text
# Config File
├── depolyment
|   ├── certbot
|   ├── ci
|   └── nginx

```

### Clustering

We also configured the clustering feature for the service to improve performance. All you need to do is just config the environment variable `CLUSTERING=true`.

## ☑️ Naming Convention

`JS variable / function:` lower camel case [e.g. twoWords]

`JS global const + enum's attributes:` upper case [e.g. TWO_WORDS]

`JS class / interface / type / enum:` pascal case [e.g. TwoWords]

`Asset name (e.g. image):` kebab case [e.g. two-words]
