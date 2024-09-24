"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const bodyParser = require("body-parser");
const index_1 = require("./index");
const Certificate_1 = __importDefault(require("./Certificate"));
const app = express();
const PORT = process.env.PORT || 9000;
// Middleware
app.use(bodyParser.json());
// Route to add a new certificate
app.post('/certificates', (req, res) => {
    const { fileHash, courseName, userID, date } = req.body;
    if (!fileHash || !courseName || !userID || !date) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    const newCertificate = new Certificate_1.default(fileHash, courseName, userID, date);
    index_1.Chain.instance.addBlock(newCertificate);
    res.status(201).json({ message: 'Certificate added successfully.' });
});
// Route to verify a certificate
app.post('/certificates/verify', (req, res) => {
    const { fileHash, userID } = req.body;
    if (!fileHash || !userID) {
        return res.status(400).json({ error: 'fileHash and userID are required.' });
    }
    const isVerified = index_1.Chain.instance.verifyCertificate(fileHash, userID);
    res.json({ verified: isVerified });
});
app.post('/certificates/userID', (req, res) => {
    const { userID } = req.body;
    if (!userID) {
        return res.status(400).json({ error: 'userID is required.' });
    }
    const certificates = index_1.Chain.instance.getCertificatesByUserID(userID);
    res.json(certificates);
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
