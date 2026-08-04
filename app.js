const express = require("express");
const client = require("prom-client");

const app = express();

const PORT = process.env.PORT || 3000;


/*
  Enable default Node.js metrics:
  - CPU usage
  - Memory usage
  - Event loop
*/
client.collectDefaultMetrics();


/*
  Custom HTTP request counter
*/
const httpRequestCounter = new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status"]
});


/*
  Home endpoint
*/
app.get("/", (req, res) => {

    httpRequestCounter.inc({
        method: req.method,
        route: "/",
        status: 200
    });


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
            <li>Prometheus & Grafana</li>
        </ul>
    `);
});


/*
  Prometheus metrics endpoint
*/
app.get("/metrics", async (req, res) => {

    res.setHeader(
        "Content-Type",
        client.register.contentType
    );

    res.end(
        await client.register.metrics()
    );
});


app.listen(PORT, () => {

    console.log(
        `Application running on port ${PORT}`
    );

});