# App

GymPass style app

## Functional requirements

- [x] It must be possible to register a user;
- [x] It must be possible to authenticate a user;
- [x] It must be possible to get logged user profile;
- [x] It must be possible to get the number of checkins made by logged user;
- [x] It must be possible to get the checkins history of the logged user;
- [x] It must be possible to search for nearby gyms (10km);
- [x] It must be possible to search gyms by name;
- [x] It must be possible to checkin on a gym;
- [x] It must be possible to validade user checkin;
- [x] It must be possible to register a gym.

## Business rules

- [x] The user can't register with a duplicated email;
- [x] The user can't checkin twice in a day;
- [x] The user can't checkin if isn't close to the gym (100m);
- [x] The checkin can only be validated until 20 minutes after created;
- [ ] The checkin can only be validated by admins;
- [ ] Gyms can only be registred by admins.

## Non functional requirements

- [x] The user password must be encrypted;
- [x] Data must be persisted on a PostgreSQL database;
- [ ] All data lists must be paginated with 20 items per page;
- [ ] The user must be identified by a JWT (JSON Web Token)
