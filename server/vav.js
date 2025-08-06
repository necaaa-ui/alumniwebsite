const { buildSSORedirectURL } = require('vaave-sso-sdk');
const params = { client_id: "pmGbbv39yFwZfOB6", 
redirect_url: "https://your-app.example.com/dashboard", 
server_domain: "alumni.nec.edu.in" };

const result = buildSSORedirectURL(params);

if (result.success) {
console.log(result.url); } 
else {
console.error(result.message); }