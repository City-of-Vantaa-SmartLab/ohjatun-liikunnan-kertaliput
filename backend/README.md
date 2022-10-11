# Vantaa - backend

## Prerequisites

*   Node 16

## Development

The backend is a docker service. Please refer to general installations instruction.

The API is available in `localhost:5000`

## API Calls

list of all available courses: (http://localhost:5000/api/courses).
list of all available events: (http://localhost:5000/api/events)
list of all available users: (http://localhost:5000/api/users)

## Implementation Details

The backend starts up on (localhost:5000), then connects to the postgres db on docker using sequalize.
