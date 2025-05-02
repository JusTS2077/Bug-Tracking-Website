const express = require('express');
const cors = require('cors');
const pool = require('./connection');
const multer = require('multer');
const fs = require('fs');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({storage});

/*
*====================================================================
*        []   | LOGIN CODE WITH JWT...|  []
*===================================================================*/

const jwt = require('jsonwebtoken');

function loginToken(user){
    const payload = {
        user:user.usernm,
        firstnm:user.firstname,
        lastnm:user.lastname,
        email:user.email,
        role:user.role
    };

    const secret = process.env.JWT_SECRET || "yoursecretkey";

    const options = {
        expiresIn:'1h'
    };

    return jwt.sign(payload,secret,options);
}

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        return res.sendStatus(401);
    }

    jwt.verify(token,process.env.JWT_SECRET || "yoursecretkey",(err,user)=>{
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
}

app.get('/protected-data',authenticateToken,(req,res)=>{
    res.json({message:"This is protected",user:req.user});
});

app.post("/login",async(req,res)=>{

    try{
        const {user,password} = req.body;

        const query = await pool.query(`select * from users where usernm=$1 AND status_id=1`,[user]);

        if(!(query.rowCount>0)){
            return res.status(401).json({message:"Invalid username or password"});
        }   

        const result = query.rows;

        const isMatch = await bcrypt.compare(password,result[0].password);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = loginToken(result[0]);

        return res.json({token});
    }
    catch(err){
        console.error("Error: ",err);
        return res.status(500).json({message:"Error while trying to login"});
    }
})


/**********************************************************************************
* *================================================================================***
    * * FROM HERE ON IT'S JUST API ENDPOINTS FOR ALL THE CRUD OPERATIONS.....       
* *================================================================================***/

//add user
app.post('/add-user',async(req,res)=>{
    try{
        const {usernm,password,email,firstname,lastname,projects,role,department} = req.body;
        const hashedpaswd = await bcrypt.hash(password,10);
        console.log(await req.body);
        const insert = await pool.query("insert into users(usernm,password,email,firstname,lastname,projects,role,department) values($1,$2,$3,$4,$5,$6,$7,$8)",
            [usernm,hashedpaswd,email,firstname,lastname,projects,role,department]);
        console.log("Succesfully inserted: ",insert.rows[0]);
        res.json(insert.rows[0]);
    }
    catch(err){
        console.error("User insertion error: ",err);
        res.status(500).json({message:'Error while trying to insert user data into Database' });
    }
});

app.post('/add-group',async(req,res)=>{
    try{
        const {groupnm,perms} = req.body;
        const insert_group = await pool.query("insert into access_level(access_name) values($1) returning id",[groupnm]);
        const group_id = insert_group.rows[0].id;
        const insertPermsPromises = perms.map(perm => {
            return pool.query(
              "INSERT INTO group_perms (group_id, perms_id) VALUES ($1, $2)",
              [group_id, perm]
            );
        });
    await Promise.all(insertPermsPromises);

    res.status(200).json({ message: "Group and permissions added successfully." });
    } 
    catch (err) {
        console.error("Error inserting group and perms:", err);
        res.status(500).json({ error: "Something went wrong." });
    }
})

//add tag
app.post('/add-tag', async(req,res)=>{
    try{
        const {tagname,tagremarks} = req.body;
        const insert = await pool.query("insert into tag(name,remarks) values($1,$2)",[tagname,tagremarks])
    }
    catch(err){
        console.log("Error: ",err);
        return res.status(500).json({message:'Error while trying to insert data into Database'});
    }
});

//add status
app.post('/add-status',async (req,res)=>{
    try{
        const {statusname,statusremarks} = req.body;
        const insert = await pool.query("insert into status(name,remarks) values($1,$2)",[statusname,statusremarks]);
    }
    catch(err){
        console.log("Error: ",err);
        return res.status(500).json({message:'Error while trying to insert data into Database'});
    }
});


//add project
app.post('/add-project',async (req,res)=>{
    try{
        const {projectname,projectremarks} = req.body;
        const insert = await pool.query("insert into project(name,remarks) values($1,$2)",[projectname,projectremarks])
    }
    catch(err){
        console.log("Error: ",err);
        return res.status(500).json({message:'Error while trying to insert data into Database'});
    }
});


//*add priority
app.post('/add-priority',async (req,res)=>{
    try{
        const {priorityname,priorityremarks} = req.body;
        const insert = await pool.query("insert into priority(name,remarks) values($1,$2)",[priorityname,priorityremarks]);
    }
    catch(error){
        console.log("Error: ",error);
        return res.status(500).json({message:'Error while trying to insert data into Database'});
    }
});

//*add issue
app.post('/add-issue', upload.array('files'), async (req, res) => {
    try {
      const files = req.files;
      const { project, tag, status, priority, assigned_to, title, description, reported_by } = req.body;
  
      const result = await pool.query(
        `INSERT INTO issues(project, tag, status, priority, assigned_to, title, description, reported_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING issue_no`,
        [project, tag, status, priority, assigned_to, title, description, reported_by]
      );
  
      const issueId = result.rows[0].issue_no;
  
      for (const file of files) {
        await pool.query(
          `INSERT INTO issue_attachments(issue_id, file_name, file_type, file_content)
           VALUES ($1, $2, $3, $4)`,
          [issueId, file.originalname, file.mimetype, file.buffer]
        );
      }
  
      res.status(200).json({ message: 'Issue and files uploaded successfully' });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ message: "Couldn't add issue details to database" });
    }
  });

app.post('/add-comment',async(req,res)=>{
    try{
        const {user,comment,time} = req.body;
        const query = await pool.query("INSERT INTO comments(commented_by, comment_desc, commented_on) values($1,$2,$3) RETURNING 1",[user,comment,time]);
        if(query.rowCount>0){
            console.log("Inserted comment successfully");
        }
    }
    catch(err){
        console.log("Error: ",err);
        return res.status(500).send({message:"Error"+err});
    }
})
/*
*This section of code contains the API endpoints for the GET requests
*/
app.get('/users',async(req,res)=>{
    try{
        const users = await pool.query("SELECT * FROM Users where status_id IN (1,2) order by user_id");
        res.json(users.rows);
    }
    catch(err){
        console.error("Error getting user data to table: ",err);
        res.status(500).json({message:"Error while trying to get user data from Database"});
    }
});

app.get('/user-groups',async(req,res)=>{
    try{
        const users = await pool.query("SELECT * FROM access_level  where status_id IN (1,2) order by id");
        res.json(users.rows);
    }
    catch(err){
        console.error("Error getting usergroup data from table: ",err);
        res.status(500).json({message:"Error while trying to get user data from Database"});
    }
});

app.get('/perms',async(req,res)=>{
    try{
        const perms = await pool.query("SELECT * FROM permissions where status_id IN (1,2)  order by id ");
        res.json(perms.rows);
    }
    catch(err){
        console.error("Error getting permission data from table: ",err);
        res.status(500).json({message:"Error while trying to get permission data from Database"});
    }
});

app.get('/group-perms/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const perms = await pool.query("SELECT * FROM group_perms WHERE group_id=$1 AND status_id IN (1,2)  ORDER BY $1",[id]);
        res.json(perms.rows);
    }
    catch(err){
        console.error("Error getting group permission data from table: ",err);
        res.status(500).json({message:"Error while trying to get group permission data from table"});
    }
})

app.get('/tags',async(req,res)=>{
    try{
        const tags = await pool.query("SELECT * FROM tag where status_id IN (1,2) order by id");
        res.json(tags.rows);
    }
    catch(err){
        console.error("Error getting data from table: ",err);
        return res.status(500).json({message:"Error while trying to get tag data from Database"});
    }
})

app.get('/status',async(req,res)=>{
    try{
        const status = await pool.query("SELECT * FROM status where status_id IN (1,2) order by id");
        res.json(status.rows);
    }
    catch(err){
        console.error("Error getting data from table: ",err);
        return res.status(500).json({message:"Error while trying to get status data from Database"});
    }
})

app.get('/projects',async(req,res)=>{
    try{
        const projects = await pool.query("SELECT * FROM project where status_id IN (1,2) ORDER BY id");
        res.json(projects.rows);
    }
    catch(err){
        console.error("Error adding to table: ",err);
        return res.status(500).json({message:"Error while trying to get project data from Database"})
    }
})

app.get('/priorities',async(req,res)=>{
    try{
        const priorities = await pool.query("SELECT * FROM priority  where status_id IN (1,2) ORDER BY id");
        res.json(priorities.rows);
    }
    catch(err){
        console.error("Error getting data from table: ",err);
        return res.status(500).json({message:"Error while trying to get priority data from Database"})
    }
})


app.get("/issue-filter", authenticateToken, async (req, res) => {
    try {
      const { project, tag, status, priority, assigned_to, startDate, endDate } = req.query;
      const values = [];
      let idx = 1;
  
      // 🔐 Use role and username from the token
      const roleName = req.user.role;
      const username = req.user.username;
  
      // Get the group ID from access_level
      const groupIdResult = await pool.query(
        "SELECT id FROM access_level WHERE access_name = $1",
        [roleName]
      );
      const groupId = groupIdResult.rows[0]?.id;
  
      // Check project view permission (perms_id = 2)
      const permissionResult = await pool.query(
        "SELECT 1 FROM group_perms WHERE group_id = $1 AND perms_id = 2",
        [groupId]
      );
      const canViewAll = permissionResult.rows.length > 0;
  
      // Build the base query
      let query = `
      SELECT 
        i.issue_no, 
        i.project, 
        i.tag, 
        i.status, 
        i.priority, 
        i.assigned_to,
        i.reported_by,
        i.title, 
        i.description, 
        TO_CHAR(i.reported_on, 'YYYY-MM-DD HH24:MI:SS') AS formatted_reported_on,
        ia.id,
        ia.file_name,
        ia.file_type,
        ia.file_content
      FROM issues i
      LEFT JOIN issue_attachments ia ON i.issue_no = ia.issue_id
      WHERE i.status_id IN (1, 2)
    `;
  
      if (!canViewAll) {
        query += ` AND assigned_to = $${idx++}`;
        values.push(username);
      }
  
      // Apply filters
      if (project) {
        query += ` AND project = $${idx++}`;
        values.push(project);
      }
      if (tag) {
        query += ` AND tag = $${idx++}`;
        values.push(tag);
      }
      if (status) {
        query += ` AND status = $${idx++}`;
        values.push(status);
      }
      if (priority) {
        query += ` AND priority = $${idx++}`;
        values.push(priority);
      }
  
      if (assigned_to && canViewAll) {
        query += ` AND assigned_to = $${idx++}`;
        values.push(assigned_to);
      }
  
      if (startDate) {
        query += ` AND reported_on >= $${idx++}`;
        values.push(startDate);
      }
      if (endDate) {
        query += ` AND reported_on <= $${idx++}`;
        values.push(endDate);
      }
  
      query += ` ORDER BY issue_no`;
  
      const result = await pool.query(query, values);
      res.json(result.rows);
      console.log("Filtered data fetched successfully!");
    } catch (err) {
      console.error("Error filtering issues:", err);
      res.status(500).send("Internal Server Error");
    }
});

app.get("/comments",async(req,res)=>{
    try{
        const comments = await pool.query("SELECT * FROM comments");
        res.json(comments.rows);
    }
    catch(err){
        console.error("Error getting data from table: ",err);
        return res.status(500).json({message:"Error while trying to get comments from Database"})
    }
})

app.get('/download-file/:issueId/:attachmentId', (req, res) => {
    const { issueId, attachmentId } = req.params;
  
    const query = `
      SELECT file_name, file_type, file_content
      FROM issue_attachments
      WHERE issue_id = $1 AND id = $2
    `;
    
    pool.query(query, [issueId, attachmentId], (err, result) => {
      if (err) {
        return res.status(500).send('Error fetching file');
      }
  
      const attachment = result.rows[0];
      if (!attachment) {
        return res.status(404).send('Attachment not found');
      }
  
      res.setHeader('Content-Type', attachment.file_type);
      res.setHeader('Content-Disposition', `attachment; filename=${attachment.file_name}`);
      
      res.send(attachment.file_content);
    });
});

app.get('/view-file/:issueId/:attachmentId', (req, res) => {
    const { issueId, attachmentId } = req.params;
  
    // Parse the issueId and attachmentId as integers
    const parsedIssueId = parseInt(issueId, 10);
    const parsedAttachmentId = parseInt(attachmentId, 10);
  
    // Validate that the parsed values are valid integers
    if (isNaN(parsedIssueId) || isNaN(parsedAttachmentId)) {
      return res.status(400).send('Invalid issueId or attachmentId');
    }
  
    const query = `
      SELECT file_name, file_type, file_content
      FROM issue_attachments
      WHERE issue_id = $1 AND id = $2
    `;
  
    pool.query(query, [parsedIssueId, parsedAttachmentId], (err, result) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).send('Error fetching file');
      }
  
      const attachment = result.rows[0];
      console.log("Attatchment details: ",attachment);
      if (!attachment) {
        return res.status(404).send('Attachment not found');
      }
  
      // Check if file_content exists before proceeding
      if (!attachment.file_content) {
        return res.status(500).send('File content is empty or missing');
      }

      // Convert file_content to Base64 string
      const buffer = Buffer.from(attachment.file_content, 'binary');
      // Set appropriate Content-Type based on file_type
      if (attachment.file_type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      } else if (attachment.file_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      } else {
        res.setHeader('Content-Type', attachment.file_type || 'application/octet-stream');
      }
  
      res.setHeader('Content-Disposition', `inline; filename="${attachment.file_name}"`);
      res.end(buffer);
    });
});

    
  

/*
*----This section of code contains the API endpoints for the user to delete(setting status=3) entries from database------
*/

app.put("/users/:id",async(req,res)=>{
    try{
        const id = req.params.id;
        const user = await pool.query("UPDATE users SET status_id = 3 WHERE user_id = $1",[id]);
        res.json(user.rows);
    }
    catch(err){
        console.error("Error while deleting: ",err);
        return res.status(500).json({message:"Error while trying to delete user from Database"});
    }
})

app.put("/tags/:id",async(req,res)=>{
    try{
        const id = req.params.id;
        const tags = await pool.query("UPDATE tag SET status_id=3 where id=$1",[id]);
        res.json(tags.rows);
    }
    catch(err){
        console.error("Error while deleting: ",err);
        return res.status(500).json({message:"Error while trying to delete tag from Database"})
    }

})

app.put("/status/:id",async(req,res)=>{
    try{
        const id = req.params.id;
        const status = await pool.query("UPDATE status SET status_id=3 where id=$1",[id]);
        res.json(status.rows);
    }
    catch(err){
        console.error("Error while deleting: ",err);
        return res.status(500).json({message:"Error while trying to delete status from Database"})
    }
})

app.put("/projects/:id",async(req,res)=>{
    try{
        const id = req.params.id;
        const project = await pool.query("UPDATE project SET status_id=3 where id=$1",[id]);
        res.json(project.rows);
    }
    catch(err){
        console.error("Error while deleting: ",err);
        return res.status(500).json({message:"Error while trying to delete project from Database"})
    }
})

app.put("/priorities/:id",async(req,res)=>{
    try{
        const id = req.params.id;
        const priority = await pool.query("UPDATE priority SET status_id=3 where id=$1",[id]);
        res.json(priority.rows);
    }
    catch(err){
        console.error("Error while deleting: ",err);
        return res.status(500).json({message:"Error while trying to delete priority from Database"})
    }
})

/*
*---This section of code contains the API Endpoints for the users to modify the data in the database--
*/

app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { usernm, email, firstname, lastname, projects, role, department } = req.body;

        const result = await pool.query(
            `UPDATE users 
             SET usernm = $1, email = $2, firstname = $3, lastname = $4, projects=$5, role=$6,department = $7
             WHERE user_id = $8`,
            [usernm, email, firstname, lastname, projects, role, department, id]
        );
    res.json({ message: "User updated successfully", user: result.rows[0] });

    }
    catch(err){
        console.error("Error: ",err);
        return res.status(500).json({message:"Error while trying to update user from Database"});
    }
})

app.put("/user-groups/:id",async(req,res)=>{
    const id = parseInt(req.params.id);
    const currentPerms = await pool.query("SELECT * FROM group_perms WHERE group_id=$1",[id]);
    const selectedPerms = req.body;
    const selectedPermsSet = new Set(selectedPerms);
    const currentPermsSet = new Set(currentPerms.rows.map(row=>row.perms_id));  
    const permissionsToAdd = Array.from(selectedPermsSet).filter(perm => !currentPermsSet.has(perm));
    const permissionsToRemove = Array.from(currentPermsSet).filter(perm => !selectedPermsSet.has(perm));
    console.log("Request body: ",req.body);
    console.log("Current permissions: ",currentPermsSet);
    console.log("selected permissions:",selectedPermsSet);
    console.log("permissions added: ",permissionsToAdd);
    console.log("permissions removed:",permissionsToRemove);  
    try{
        await pool.query("BEGIN");

        if(permissionsToRemove.length>0){
            await pool.query("UPDATE group_perms SET status_id=3 where group_id=$1 AND perms_id= ANY($2::int[])"
                ,[id,permissionsToRemove]
            );
        }

        if(permissionsToAdd.length>0){
            const insert = await pool.query(`INSERT INTO group_perms (group_id, perms_id, status_id)
                                        SELECT $1, perm_id, 1
                                        FROM unnest($2::int[]) AS perm_id
                                        WHERE NOT EXISTS (
                                        SELECT 1 FROM group_perms
                                        WHERE group_id = $1 AND perms_id = perm_id)`,[id,permissionsToAdd]);
        }

        await pool.query("COMMIT");
        console.log("Permissions updated successfully!")
        res.status(200).json({message:"Permissions updated successfully!"});
    }
    catch(err){
        await pool.query("ROLLBACK");
        console.error("Error updating permissions:", err);
        res.status(500).json({ message: 'Error updating permissions' });
    }
})

app.put("/tags/:id",async(req,res)=>{
    try{
        const id = req.params.id;
        const {name,remarks} = req.body;
        const result = await pool.query("UPDATE tag SET name = $1,remarks=$2 WHERE id = $3",[name,remarks,id]);
            res.json(result.rows);
        }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Error while trying to update tag from Database"});
    }
})

app.put("/status/:id",async(req,res)=>{
    try{
        const id = req.params.id;
        const {name,remarks} = req.body;
        const result = await pool.query("UPDATE status SET name = $1,remarks=$2 WHERE id = $3",[name,remarks,id]);
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Error while trying to update status from Database"});
    }
})

app.put("/projects/:id",async(req,res)=>{
    try{
    const id = req.params.id;
    const {name,remarks} = req.body;
    const result = await pool.query("UPDATE project SET name = $1, remarks = $2 WHERE id = $3",
        [name,remarks,id]);
    res.json(result.rows);
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Error while trying to update project from Database"});
    }
})

app.put("/priority/:id",async(req,res)=>{
    try{
        const id = req.params.id;
        const {name,remarks} = req.body;
        const result = await pool.query("UPDATE priority SET name = $1,remarks=$2 WHERE id = $3",
            [name,remarks,id]);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Error while trying to update priority from Database"});
    }
})

app.put("/issues/:issue_no", upload.single('file'), async (req, res) => {
    try {
        const issue_no = req.params.issue_no;
        const file = req.file;
        const { project, tag, status, priority, assigned_to, title, description } = req.body;

        // Log the data to check if it's being parsed correctly
        console.log("Body Data:", req.body);
        console.log("File Data:", file);

        if (!req.body) {
            return res.status(400).json({ message: "Missing data in request body" });
        }

        const updateIssue = await pool.query(
            "UPDATE issues SET project=$1, tag=$2, status=$3, priority=$4, assigned_to=$5, title=$6, description=$7 WHERE issue_no=$8",
            [project, tag, status, priority, assigned_to, title, description, issue_no]
        );

        if (file) {
            const insertAttachment = await pool.query(
                "INSERT INTO issue_attachments(issue_id, file_name, file_type, file_content) VALUES ($1, $2, $3, $4)",
                [issue_no, file.originalname, file.mimetype, file.buffer]
            );
        }

        res.json({ message: "Issue updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
});
1
  
/*
*This section contains API Endpoints for enabling or disabling users,projects,etc.(all kinds of records)
*/


app.put("/users/:id/toggle-status", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await pool.query("SELECT status_id FROM users WHERE user_id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const currentStatus = result.rows[0].status_id;
        const newStatus = currentStatus === 2 ? 1 : 2;

        const updateResult = await pool.query("UPDATE users SET status_id = $1 WHERE user_id = $2 RETURNING *", [newStatus, id]);
        res.json(updateResult.rows[0]);
    } catch (err) {
        console.error("Error while toggling status: ", err);
        return res.status(500).json({ message: "Error while toggling user status in Database" });
    }
});

app.put("/tags/:id/toggle-status",async(req,res)=>{
    try {
        const id = req.params.id;
        const result = await pool.query("SELECT status_id FROM tag WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Tag not found" });
        }

        const currentStatus = result.rows[0].status_id;
        const newStatus = currentStatus === 2 ? 1 : 2;

        const updateResult = await pool.query("UPDATE tag SET status_id = $1 WHERE id = $2 RETURNING *", [newStatus, id]);
        res.json(updateResult.rows[0]);
    } catch (err) {
        console.error("Error while toggling status: ", err);
        return res.status(500).json({ message: "Error while toggling status in Database" });
    }

});

app.put("/status/:id/toggle-status",async(req,res)=>{
    try {
        const id = req.params.id;
        const result = await pool.query("SELECT status_id FROM status WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Status not found" });
        }

        const currentStatus = result.rows[0].status_id;
        const newStatus = currentStatus === 2 ? 1 : 2;

        const updateResult = await pool.query("UPDATE status SET status_id = $1 WHERE id = $2 RETURNING *", [newStatus, id]);
        res.json(updateResult.rows[0]);
    } catch (err) {
        console.error("Error while toggling status: ", err);
        return res.status(500).json({ message: "Error while toggling status in Database" });
    }
})

app.put("/projects/:id/toggle-status",async(req,res)=>{
    try {
        const id = req.params.id;
        const result = await pool.query("SELECT status_id FROM project WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }

        const currentStatus = result.rows[0].status_id;
        const newStatus = currentStatus === 2 ? 1 : 2;

        const updateResult = await pool.query("UPDATE project SET status_id = $1 WHERE id = $2 RETURNING *", [newStatus, id]);
        res.json(updateResult.rows[0]);
    } catch (err) {
        console.error("Error while toggling status: ", err);
        return res.status(500).json({ message: "Error while toggling status in Database" });
    }
})

app.put("/priorities/:id/toggle-status",async(req,res)=>{
    try {
        const id = req.params.id;
        const result = await pool.query("SELECT status_id FROM priority WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Priority not found" });
        }

        const currentStatus = result.rows[0].status_id;
        const newStatus = currentStatus === 2 ? 1 : 2;

        const updateResult = await pool.query("UPDATE priority SET status_id = $1 WHERE id = $2 RETURNING *", [newStatus, id]);
        res.json(updateResult.rows[0]);
    } catch (err) {
        console.error("Error while toggling status: ", err);
        return res.status(500).json({ message: "Error while toggling status in Database" });
    }
})



/*This is to start the server*/
app.listen(5000, () => {
    console.log('Server running on port 5000');
});



