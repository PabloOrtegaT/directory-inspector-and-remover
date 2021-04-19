const fs = require('fs');
const chalk = require('chalk');
const prompt = require('prompt');

const processArgs = process.argv[2];
const directoryToDelete = `${__dirname}\\${process.argv[3]}`;
var files = 0;
var directories = 0;

const argumentConsole = processArgs == undefined ? `${__dirname}/` : `${processArgs}/`;

function showDirectory(argumentConsole){
    fs.readdirSync(argumentConsole).forEach(file => {
        let statSync = fs.statSync(`${argumentConsole}${file}`);
        statSync.isDirectory() == false ? 
            console.log(`-file: ${file} -size: ${statSync.size} bytes -date: ${statSync.mtime.getDate()}/${statSync.mtime.getUTCMonth()} ${statSync.mtime.getHours()}:${statSync.mtime.getMinutes()}` ) : 
            console.log(chalk.blue(`${file}/`));
      });
}

function deleteDirectory(directoryToDelete){

    if(fs.readdirSync(directoryToDelete).length > 0){
        
        countFilesAndDirectories(directoryToDelete);
        console.log(`Files to remove: ${files}, Directories to remove: ${directories}`);
        console.log('Since directory is not empty, do you want to continue? [Y/n]');

        prompt.get(['confirmation'], function (err, result) {
            if (err) { return onErr(err); }
            if(result.confirmation == 'Y' || result.confirmation == 'y'){
                fs.rmdirSync(directoryToDelete, { recursive: true });
                console.log(`Successfully removed ${files} files and ${directories} directories!`);
            }
            else{
                console.log(`No actions were performed.`);
            }
        });

    } else{
        fs.rmdirSync(directoryToDelete, { recursive: true });
            console.log(`Successfully removed ${directoryToDelete} directory`);
    }

}

function countFilesAndDirectories(directoryToDelete){
    if(fs.readdirSync(`${directoryToDelete}\\`).length > 0){
        fs.readdirSync(`${directoryToDelete}\\`).forEach(file => {
            let statSync = fs.statSync(`${`${directoryToDelete}\\`}${file}`);
            if(statSync.isDirectory()){
                console.log(chalk.blue(`Directory to remove ${file}/`));
                directories++;
                countFilesAndDirectories(`${directoryToDelete}\\${file}`);
            }else{
                console.log(`file to remove -file: ${file} -size: ${statSync.size} bytes` )
                files++;
            }
        });
    }
}

if(process.argv[2] == 'delete'){
    try {
        deleteDirectory(directoryToDelete);
    } catch (err) {
        console.error(`Error while deleting ${directoryToDelete}.`);
    }
}else{
    try{
    showDirectory(argumentConsole)
    }catch(e){
        console.log(e);
}}
