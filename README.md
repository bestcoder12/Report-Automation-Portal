# This is a Report Automating Web Portal
## It uses React, Node.js, nginx and MySQL and deployment on Ubuntu Server

The portal on the client side is a single page application and uses react-router packages to enable such navigations.

On the frontend it also uses role-based routing according to the given role to the user.

The report automation portal takes the excel files as input and calculates and displays the output tables in the client side in the form of a table.

The portal also manages user session using express-session package and MySQL store.

The inputs reports stored by the portal are:
- OLT Monthly
- OLT Network Provider
- ONT Network Provider
- ONT Unknown
- ONT Mismatch
- ONT Ticket

The reports it currently processes as outputs, are
- OLT-Status
- ONT-Status

* Note: The code does not include .env file for the required environment variables.
It has to be added separately as per system configuration *

The coding style followed in this project is that of Airbnb style of javascript and prettier for code formatting.