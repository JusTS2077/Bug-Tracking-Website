![image](https://github.com/user-attachments/assets/a217ba9c-9a6d-470e-9df5-653a2d1e3a2c)# BugTracker – Full Stack Bug Tracking Web App

A custom-built bug and issue tracking system developed during my internship at [Company Name], designed to replace the company’s existing paid tool (MantisBT) with a free, secure, and scalable in-house alternative.

## Features

- Issue Tracking – Report, view, and manage software bugs and issues
- Project & Tag Filtering – Organize issues by project, tag, and status
- Role-Based Access Control – Admin, Developer, and User roles
- JWT Authentication – Secure login & session handling
- Timestamps – Automatic date logging for activity tracking
- Dashboard Overview – Summarized issue count by project & status (optional)

## Tech Stack

- Frontend: Angular
- Backend: Node.js with Express
- Database: PostgreSQL
- Authentication: JSON Web Tokens (JWT)
- Styling: CSS with SCSS

## Screenshots

# Login Page
The accounts are created by the admin beforehand. Every time someone tries to log in, a JWT token is created to verify if the user account exists. If the authentication fails, the user is redirected back to the login page. A user group check is also done to see which all sections should be visible to the user.
![image](https://github.com/user-attachments/assets/bd26f343-eac6-4e05-83ea-cfc7ff897a39)

# Report Issue Section
You're redirected here right after logging in. Here, you can select the project name, tag, status and priority from a drop-down menu. The options in the drop-down menu are added by the administrator. The issue can be assigned only to users who have access to that particular project. You can then add a title and description for the issue, along with an "Upload File" button to upload screenshots or PDFs or documents related to the issue.
![image](https://github.com/user-attachments/assets/d54dad1c-1cc3-42e3-b27b-0250ccbc57ae)

# View Issues Section
This section is for viewing all the reported issues. Only the admin can view all the projects. Other users can only see issues that are linked to the project that they have access to. There are various filters to filter out the issues like by project name, by the name of a particular user it is assigned to, a particular date period, tag, status or priority. You can even combine these filters according to your needs. The issues are displayed in a tabular format. Each issue has an Expand button, Toggle button and a Comment button.
- The Expand button is used to show a more detailed version of the issue.
- The Toggle button is used to toggle the status of the issue, so that users can know which all issues are resolved(Users can't edit a disabled issue)
- The Comment button allows users to add a comment under any issue so that other users related to the project know the status of the issue. 
![image](https://github.com/user-attachments/assets/6189db76-02ab-419c-9c4f-0c25bc4a16d0)
![image](https://github.com/user-attachments/assets/cc82d116-16df-44f6-bbb8-444a94150fbc)
The second image shows only the projects assigned to "Jus2079" since I used to filter to show only the issues assigned to that user.

# Manage Section (Admin Only)
This section is only visible to the administrators. It is used to manage projects, tags, statuses, priorities users and user group permissions. The existing records of each are shown in a tabular format where you can delete, edit or toggle each record.
- Project: The admin can create, edit or delete projects. "Add Project" opens a pop up form where you can name the project and add a description for the project. 
  ![image](https://github.com/user-attachments/assets/f671c51e-4501-4823-b968-d377ba8bd965)
  ![image](https://github.com/user-attachments/assets/4cf37e93-90e1-4be2-8d79-4658b7596c71)
  
- User: The admin can create, edit or delete users. "Add User" opens a pop-up form where you can give the user a username, add their first name and last name, give them a password, their e-mail and their            department. The password is stored as hash using bcrypt which is later decrypted during login. You can also add them to a user group which decides the permission they will have while using the website.
  ![image](https://github.com/user-attachments/assets/ade99fae-a947-4522-b095-6ef311c4fd57)
  ![image](https://github.com/user-attachments/assets/fefdb2d1-9703-4bb1-93da-3dde31485271)

- User Groups: The admin can create, edit or delete user groups. The table shows the permissions of each group. All users registered belong to a user group that the admin will decide. "Add user group" opens up a    pop up form where you can give a name for the user group and choose the permissions for the group. "Update Permissions" allows the admin to edit the permissions of the existing user group.
  ![image](https://github.com/user-attachments/assets/373b3b40-4c7f-43b3-9f4c-0155be04c15f)
  ![image](https://github.com/user-attachments/assets/437230a0-4ed5-4e38-8360-cb9d370c9427)
  ![image](https://github.com/user-attachments/assets/558d01ff-5907-4428-8484-edade8815714)
  
-Tag(Similar to how Project section is)
  ![image](https://github.com/user-attachments/assets/c9b20ba0-039d-4473-95f5-7e5e0d7536fc)
  
-Status(Similar to how Project section is)
  ![image](https://github.com/user-attachments/assets/8c468f79-2b7e-44b8-84ee-5707c8d5819d)
  
-Priority(Similar to how Project section is)
 ![image](https://github.com/user-attachments/assets/61b75e44-d798-4089-a87f-ecb0583c9660)

