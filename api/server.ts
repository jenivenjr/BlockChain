const express = require('express');
import bodyParser = require ('body-parser');
import { Chain } from './index'; 
import Certificate from './Certificate'; 

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware
app.use(bodyParser.json());

// Route to add a new certificate
app.post('/certificates', (req:any, res: any) => {
  const { fileHash, courseName, userID, date } = req.body;

  if (!fileHash || !courseName || !userID || !date) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const newCertificate = new Certificate(fileHash, courseName, userID, date);
  Chain.instance.addBlock(newCertificate);
  res.status(201).json({ message: 'Certificate added successfully.' });
});

// Route to verify a certificate
app.post('/certificates/verify', (req:any, res:any) => {
  const { fileHash, userID } = req.body;

  if (!fileHash || !userID) {
    return res.status(400).json({ error: 'fileHash and userID are required.' });
  }

  const isVerified = Chain.instance.verifyCertificate(fileHash, userID);
  res.json({ verified: isVerified });
});


app.post('/certificates/userID', (req:any, res:any) => {
  const { userID } = req.body;
  if (!userID) {
    return res.status(400).json({ error: 'userID is required.' });
  }
  const certificates = Chain.instance.getCertificatesByUserID(userID);
  res.json(certificates);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
export default app;