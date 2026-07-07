# Transaction Management System

A full-stack application for managing financial transactions.

The main goal of this project is to practice building a complete application while exploring modern development practices, especially **code quality tools, testing workflows, and the Python ecosystem**.

The project focuses on improving the development workflow through automated checks, static analysis, testing, and maintainable project structure.


---

## Project Status

The project is currently under active development.

Implemented:

* CRUD functionality for transactions
* Frontend and backend integration
* PostgreSQL database integration
* Containerized backend development environment with Docker
* End-to-end testing with Playwright

Currently working on:

* Building a dashboard for transaction analytics
* Writing aggregation queries for statistics and reporting
* Improving backend test coverage
* Expanding CI/CD workflow
* Further improving validation and application architecture

---

## Tech Stack

### Frontend

* React (Vite)
* TypeScript
* TanStack Table
* TanStack Form / custom form validation
* Playwright for end-to-end testing

### Backend

* FastAPI
* SQLModel (ORM)
* PostgreSQL

### Development & Tooling

* Docker
* Pre-commit hooks
* Ruff
* Pyright
* ESLint
* Prettier
* Pytest
* GitHub Actions

## Code Quality & CI/CD

This project uses automated quality checks to keep the codebase consistent and maintainable.

### Pre-commit Hooks

Pre-commit hooks are used to automatically run checks before commits.

Configured checks include:

### Backend

* Ruff linting and formatting
* Pyright static type checking

### Frontend

* ESLint
* Prettier formatting
* TypeScript type checking

### General Checks

* YAML and TOML validation
* Detection of large files
* Trailing whitespace removal
* End-of-file consistency checks

Install pre-commit hooks:

```bash
pre-commit install
```

Run all checks manually:

```bash
pre-commit run --all-files
```

---

## Continuous Integration

The project uses GitHub Actions to automatically validate changes.

The CI pipeline includes:

* Running pre-commit checks
* Backend unit tests with pytest
* Frontend tests
* End-to-end testing with Playwright
* Static type checking

The workflow uses separate jobs for frontend and backend validation and runs checks only when relevant parts of the project are changed.

---

## Project Goals

The goal of this project is to gain practical experience in developing a full-stack application and improving the overall development workflow.

The main areas of focus are:

* Practicing backend development with FastAPI and PostgreSQL
* Exploring Python development tools and best practices
* Improving code quality with automated checks and static analysis
* Building testing workflows for frontend and backend
* Learning how CI/CD pipelines can support development


---

## Current Features

* Create, read, update, and delete financial transactions
* Interactive transaction table built with TanStack Table
* Backend API built with FastAPI
* PostgreSQL database integration
* Form validation
* End-to-end testing with Playwright

---

## Upcoming Dashboard

The next development stage focuses on adding a transaction analytics dashboard.

The purpose of this feature is to practice:

* Writing aggregation queries
* Processing database statistics
* Preparing backend data for visualization
* Designing data-driven user interfaces

Planned dashboard features include transaction summaries and visual analytics based on aggregated transaction data.
