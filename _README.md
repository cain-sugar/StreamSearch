# Stream Search
> Find streaming services that have your favorite movies.

## Team

  - __Product Owner__: Jon Mohone
  - __Scrum Master__: Ryan McCarty
  - __Development Team Members__: Kaelyn Chresfield, Toni Duplantis

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

>
```javascript
const usernameInDb = async (username) => {
  const user = await User.findOne({ where: { user_name: username } });
  return user; 
};
```
>returns the user's username.

## Requirements

- Node 0.10.x
- angular 1.7.7
- axios 0.18.0
- bcrypt 3.0.4
- body-parser 1.18.3
- express 4.16.4
- express-session 1.15.6
- materialize-css 1.0.0-rc.2
- mysql 2.16.0
- sequelize 4.42.0

## Development

### Installing Dependencies

Download the dependencies from within the root directory:
```bash
sudo npm install -g bower
npm install
bower install
```

To start mySQL from within the bash terminal
```bash
mysql -u root
```

To start nodemon from within the bash terminal
```bash
npm start
```
### Roadmap

View the project roadmap [here](PROJECT-ROADMAP.md)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
