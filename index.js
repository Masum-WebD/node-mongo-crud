const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId =require('mongodb').ObjectId

const cors=require('cors')
const app = express()
const port =process.env.PORT ||5000



// user:dbuser1
// password:I8h24R4ROiHUfwOA



const uri = "mongodb+srv://dbuser1:I8h24R4ROiHUfwOA@cluster0.uvhc9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const userConnection = client.db('FoodExpress').collection('user')

        //User display show
        app.get('/user', async(req,res) => {
            const query = {}
            const cursor = userConnection.find(query)
            const users= await cursor.toArray()
            res.send(users)
        })

        // user details by id
        app.get('/user/:id', async(req,res)=>{
            const id =req.params.id
            const query = {_id:Object(id)}
            const userDetails= await userConnection.findOne(query);
            res.send(userDetails)
        })
        // Update user
        app.put('/user/:id', async(req,res)=>{
            const id =req.params.id
            const updateUser = req.body
            const filter ={_id:ObjectId(id)}
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    // updateUser
                  name:updateUser.name,
                  email:updateUser.email
                },
              };
              const result = await userConnection.updateOne(filter, updateDoc, options);
              res.send(result)
        })

        //POST user: Add new user
       app.post('/user', async (req, res) =>{
           const newUser = req.body
           const result= await userConnection.insertOne(newUser);
           console.log('user: ', newUser);
           res.send(result);
       })

       // User delete
       app.delete('/user/:id', async(req,res)=>{
           const id = req.params.id
           const query ={_id:ObjectId(id)}
           const result = await userConnection.deleteOne(query);
           res.send(result)

       })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);


app.use(cors())
app.use(express.json())

app.get('/',(req,res) =>{
    res.send('Running my code CRUD server')
})

app.listen(port,()=>{
    console.log('CRUD server is running');
})