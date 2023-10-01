# WellnessBot

## Description
Given the rise in the awareness of mental health and the importance of self-care since early in the COVID-19 pandemic, we created a website that is interactive, user-friendly, sleek, purposeful and useful. With WellnessBot users can document, track, and receive support on your wellness journey all in one place!

## Installation

Our group used the OpenAI API to fetch support for users depending on the emotional support required. We utilized the Bcrypt.js module to enable storing passwords as hashed passwords instead of plain text. Tailwind CSS framework for was used for styling. JQuery UI was used for the user interface. Dotenv was used to load environment variables from a .env file into process.env. Nodemon was used to develop a Node.js based application by automatically restarting the node application when file changes in the directory were detected. For templating languate, we utilized Handlebars. Sequelize was utilized for connecting to our databases. Finally, Express was utilized to help manage servers and routes.
express,

## Usage

The website header is displayed across the top of the home page in a gradient bar, and it includes the website's name accompanied by a robot emoji. Just below, two forms are displayed side-by-side. The form on the left is the login form for users that have already created accounts to log in. The heading 'Login' is displayed in the inside upper left hand corner of the box that contains the login form. Below the heading, two text input fields are displayed vertically where users are required to type in login credentials. Above the first input field their is the headging "E-mail" address, while the heading "Password" is displayed above the second input field their passord. Just below the password field there is a a 'Submit' button for users to submit their login credentials and login to their accounts. 
The form on the left is a signup form for new users to create accounts. There are five text input fields displayed vertically just below the heading "Signup," labeled "First Name," "Last Name," "E-Mail," "Password," and "Confirm Password," for new users to create their accounts. Below the "Confirm Password" text input field new users click a "Signup" button to create their accounts and log in. Once new users have created an account successfully, they will see a modal notifying them of a successful account creation, and they are prompted to log in using using the login form.

Once users are logged in to their account, the same gradient colored header is displayed accross the top, and it includes the site's name just like on the home page. Below the header, there are two boxes displayed horizontally. The left box takes up about 1/3 of the page. Here users will be able to see and have access to prior conversations/sessions with the WellnessBot. Each previous session will be hyperlinked for users to be able to visit the previous selected session. The previous session will be displayed on the page. n 

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.
