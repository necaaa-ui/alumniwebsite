const { decryptSSOToken } = require('vaave-sso-sdk');
const token = "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..gXoxGz0HuYEvplZf.eEq0NvhxAPq6bufUAYUwwLOI8UXKFNIZ5cs4ZhxEKQLUXk_sG_eLa0hi8Qn_JdcZqSbkzub4ZiphPlI-muhAZJRCtnHqczZqk7qpn4q7bvH9WjJokPeyY7WfS0j5suT0B-DOGMvMHf9Wez_1vl1LPU0yKRYg6HhRcn8uBF4Wt8CwqdZfBw.HVAVkAROQwINQMasUyN58Q";
const client_secret = "1xGzQKCekHbGLjAWqsB7vFzMJNpi+LjHscIMfeCpl5g="; 
(async()=>{const result = await decryptSSOToken(token, client_secret);


if (result.success) { 
console.log(result.details); } 
else { 
 console.error(result.message); }
})()