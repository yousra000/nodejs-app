const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send(`
        <h1>GitOps Demo</h1>
        <h2>Welcome to Yousra's DevOps Project 🚀</h2>
        <p>Application deployed using:</p>

        <ul>
            <li>Terraform</li>
            <li>AWS EKS</li>
            <li>Docker</li>
            <li>Jenkins</li>
            <li>Amazon ECR</li>
            <li>Argo CD</li>
            <li>Kubernetes</li>
        </ul>
    `);
});

app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
});