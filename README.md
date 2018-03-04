# JobCoin-Mixer
Mixer for a simpler virtul currency: jobcoin.  

#Specification

1-User must provide a list of withdrawal addresses via POST from home page

2-Response from the post request includes the mixer's deposit address

3-User transfers bitcoins to the mixer's deposit address.

4-The mixer will detect user's transfer to the deposit address by watching or polling the P2P Bitcoin network.

5-The mixer will transfer the user's bitcoins from the deposit address into a big “house account” along with all the other bitcoins currently being mixed. 

6-Then, over some time the mixer will use the house account to dole out the user's bitcoins in smaller increments to the withdrawal addresses that the user provided 

![jobcoin](../master/jobcoin.png)

#How to Run the Server

To start the server, cd into the project's directory and execute the following commands:

npm install

node server.js

The app will run on localhost:3000. 

