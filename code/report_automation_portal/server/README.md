# Server-side or backend of Report Automation portal

The backend uses express framework for creating the endpoints or APIs through which the user can communicate with the server and database.

The database of choice is MySQL and the database handles the user information and session store which stores the relevant information related to the session of the user.

The reports are stored in the uploads directory using the multer package of javascript and they are renamed for storage and their path stored on the database.

