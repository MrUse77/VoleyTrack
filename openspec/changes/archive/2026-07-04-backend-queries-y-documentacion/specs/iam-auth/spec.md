# IAM Auth Specification

## Purpose

Baseline specification for existing authentication endpoints in the IAM bounded context. Covers user registration (planillero, admin, invitado) and login.

## Requirements

### Requirement: Registrar Planillero

The system SHALL create a new user with role PLANILLERO. The request SHALL include name, email, and password. The password SHALL be hashed before storage using bcrypt.

| Field | Type | Required |
|-------|------|----------|
| name | string | Yes |
| email | string (email format) | Yes |
| password | string (min 8 chars) | Yes |

#### Scenario: Successful registration

- GIVEN a valid request with name, email, and password
- WHEN a POST request is made to `/user/register/planillero`
- THEN the system SHALL create a user with role PLANILLERO
- AND the password SHALL be stored hashed

#### Scenario: Duplicate email

- GIVEN a user already exists with email `test@example.com`
- WHEN a POST request is made to `/user/register/planillero` with the same email
- THEN the response SHALL be 400 Bad Request

#### Scenario: Invalid data

- GIVEN a request missing required fields or with invalid email format
- WHEN a POST request is made to `/user/register/planillero`
- THEN the response SHALL be 400 Bad Request

### Requirement: Registrar Admin

The system SHALL create a new user with role ADMIN. The request SHALL include name, email, and password.

| Field | Type | Required |
|-------|------|----------|
| name | string | Yes |
| email | string (email format) | Yes |
| password | string (min 8 chars) | Yes |

#### Scenario: Successful admin registration

- GIVEN a valid request with name, email, and password
- WHEN a POST request is made to `/user/register/admin`
- THEN the system SHALL create a user with role ADMIN

#### Scenario: Duplicate email

- GIVEN a user already exists with the provided email
- WHEN a POST request is made to `/user/register/admin`
- THEN the response SHALL be 400 Bad Request

### Requirement: Registrar Invitado

The system SHALL create a new user with role INVITADO. The request SHALL include name, email, and password.

#### Scenario: Successful guest registration

- GIVEN a valid request with name, email, and password
- WHEN a POST request is made to `/user/register/invitado`
- THEN the system SHALL create a user with role INVITADO

#### Scenario: Duplicate email

- GIVEN a user already exists with the provided email
- WHEN a POST request is made to `/user/register/invitado`
- THEN the response SHALL be 400 Bad Request

### Requirement: Iniciar Sesion

The system SHALL authenticate a user by email and password. On success, the system SHALL return a JWT access token. On failure, the system SHALL return an error response.

| Field | Type | Required |
|-------|------|----------|
| email | string | Yes |
| password | string | Yes |

#### Scenario: Successful login

- GIVEN a registered user with email `user@test.com` and password `valid123`
- WHEN a POST request is made to `/user/login` with matching credentials
- THEN the response SHALL include a JWT `access_token`

#### Scenario: Wrong password

- GIVEN a registered user with password `correct123`
- WHEN a POST request is made to `/user/login` with password `wrong456`
- THEN the response SHALL be 400 Bad Request

#### Scenario: Non-existent user

- GIVEN no user exists with email `ghost@test.com`
- WHEN a POST request is made to `/user/login`
- THEN the response SHALL be 400 Bad Request
