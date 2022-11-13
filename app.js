var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver');
require('dotenv').config();

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var driver = neo4j.driver("neo4j+s://4fa96371.databases.neo4j.io", neo4j.auth.basic("neo4j","h4IfkB6s5yiXtOfuUyWbZd-sR8Vz7bEGNynNffNkTQc"));  
const session1 = driver.session()
const session2 = driver.session()
const session3 = driver.session()
const session4 = driver.session()
const session5 = driver.session()


app.get('/search', function(req, res) {
    let myObj = {};
    session1
        .run("MATCH (p:person)-[rel:WIFE_TO]-(connected) WHERE p.EPIC_x='"+String(req.query.keyword)+"' RETURN connected.EPIC_x")
        .then((result)=>{
            if(result!=undefined && result.records.length!=0){
                myObj= Object.assign(myObj,{'HUSBAND':result.records[0]._fields[0]});
            }
            console.log(myObj);

            session2
                .run("MATCH (p:person)-[rel:HUSBAND_TO]-(connected) WHERE p.EPIC_x='"+String(req.query.keyword)+"' RETURN connected.EPIC_x")
                .then((result)=>{
                    if(result!=undefined && result.records.length!=0){
                        myObj= Object.assign(myObj,{'WIFE':result.records[0]._fields[0]});
                    }
                    console.log(myObj);

                    session3
                        .run("MATCH (p:person)-[rel:FATHER_TO]-(connected) WHERE p.EPIC_x='"+String(req.query.keyword)+"' RETURN connected.EPIC_x")
                        .then((result)=>{
                            console.log(result);
                            if(result!=undefined && result.records.length!=0){
                                console.log(result);
                                myObj= Object.assign(myObj,{'OFFSPRING':result.records[0]._fields[0]});
                            }
                            console.log(myObj);

                            session4
                                .run("MATCH (p:person)-[rel:OFFSPRING_TO]-(connected) WHERE p.EPIC_x='"+String(req.query.keyword)+"' RETURN connected.EPIC_x")
                                .then((result)=>{
                                    if(result!=undefined && result.records.length!=0){
                                        myObj= Object.assign(myObj,{'FATHER':result.records[0]._fields[0]});
                                    }
                                    console.log(myObj);

                                    session5
                                        .run("MATCH (p:person)-[rel:SIBLING_TO]-(connected) WHERE p.EPIC_x='"+String(req.query.keyword)+"' RETURN connected.EPIC_x")
                                        .then((result)=>{
                                            if(result!=undefined && result.records.length!=0){
                                                myObj= Object.assign(myObj,{'SIBLING':result.records[0]._fields[0]});
                                            }
                                            console.log(myObj);
                                            res.send(JSON.stringify(myObj));
                                        })
                                        .catch((error)=>{
                                            console.log(error);
                                        })
                                })
                                .catch((error)=>{
                                    console.log(error);
                                })
                        })
                        .catch((error)=>{
                            console.log(error);
                        })
                })
                .catch((error)=>{
                    console.log(error);
                })

        })
        .catch((error)=>{
            console.log(error);
        })

});


app.listen(process.env.PORT || 3000);
console.log('Server running at http://localhost:3000/');


module.exports = app;
