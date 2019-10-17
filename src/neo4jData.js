
import {dataDetail} from "./blot/index";
const neo4j = require('neo4j-driver').v1;


class neo4jData  {
    constructor(){
        this.session = '';
        this.driver = '';
    }
    config({url,username,password}){
        const driver = neo4j.driver(url, neo4j.auth.basic(username, password));
        const session = driver.session();
        this.session = session;
        this.driver = driver;
    }
    runMatch(match){
        return  this.session.run(match)
    }
    dataDetail(records){
        return dataDetail(records)
    }
    close(){
        this.session.close();
        this.driver.close();
    }

}


export default  neo4jData;
