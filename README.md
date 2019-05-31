In 2015 I created this project as part of the hiring process for a prospective job.  The project
called for creating a simulated ATM with the requirement of being able to log in with an account
number and PIN entered into a keypad, selecting an option to make a withdrawl, and tracking the
account balance based on withdrawls made.

In 2019 I re-discovered this project while clearing out some old files I had stored on Dropbox.  I
was interested to see if I could get the code up and running again and took some time to dockerize
the project.  In a short amount of time I was able to create a docker configuration to replace the
mess of cumbersome instructions I wrote years ago (probably why I didn't get the job) with a
familiar workflow that's super-easy to demonstrate.

To run this project ...

```
# clone the repository
git clone git@github.com:vicgarcia/intersomethingATM.git

# change into project
cd intersomethingATM

# build the docker image
docker-compose build

# start the docker container
docker-compose up
```

The initial db contains two working account # / pin combinations :
```
account : 111222333444   pin : 1234
account : 587624387192   pin : 8361
```

