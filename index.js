const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose'); 

const app = express();
const port = 3010;

// 1. MongoDB Connection 
const mongoURI = "mongodb+srv://choprakhushil13:1rfebIFKUYUBCiDe@cluster0.nhg4l.mongodb.net/ecom_db"; 

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));


// 2. Mongoose Schema and Model
const mySchema = new mongoose.Schema({
    name: String,
    value: Number
  
});

const MyModel = mongoose.model('MyCollection', mySchema);


app.use(express.static('static'));
app.use(express.json()); // For parsing JSON request bodies (important for POST)


app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

// 3. API Endpoints

app.post('/create', async (req, res) => {
    try {
        const newData = new MyModel(req.body);
        await newData.save();
        res.status(201).json({ message: 'Document created', data: newData });
    } catch (error) {
        res.status(500).json({ message: 'Error creating document', error: error.message });
    }
});

app.get('/read', async (req, res) => {
    try {
        const allData = await MyModel.find();
        res.status(200).json(allData);
    } catch (error) {
        res.status(500).json({ message: 'Error reading documents', error: error.message });
    }
});

// Example update endpoint (by ID)
app.put('/update/:id', async (req, res) => {
    try {
        const updatedData = await MyModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedData) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json({ message: 'Document updated', data: updatedData });
    } catch (error) {
        res.status(500).json({ message: 'Error updating document', error: error.message });
    }
});

// Example delete endpoint (by ID)
app.delete('/delete/:id', async (req, res) => {
    try {
        const deletedData = await MyModel.findByIdAndDelete(req.params.id);
        if (!deletedData) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json({ message: 'Document deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting document', error: error.message });
    }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${3010}`);
});