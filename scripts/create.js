const axios = require('axios');
const fs = require('fs');
const path = require('path');
const ora = require('ora');
const Inquirer = require('inquirer');
const { promisify } = require('util');
const config = require('./config');
let downLoadGit = promisify(require('download-git-repo'));
let ncp = promisify(require('ncp'));
let repoUrl = config('getVal', 'repo');
const MetalSmith = require('metalsmith'); // 遍历文件夹 
let { render } = require('consolidate').ejs;
render = promisify(render); // 包装渲染方法

const fetchRepoList = async () => {
    const res = await axios.get(`https://api.github.com/orgs/${repoUrl}/repos`);
    return res.data;
}

const fetchTagList = async (repo) => {
    const url = `https://api.github.com/repos/${repoUrl}/${repo}/tags`;
    const { data } = await axios.get(url);
    return data;
}

const wrapFetchAddLoading = (fn, message) => async(...args) => {
    const spinner = ora(message);
    spinner.start();
    let result =  await fn(...args);
    spinner.succeed();
    return result;
}

const download = async (repo, tag) => { 
    const downloadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME': 'USERPROFILE']}/.template`;
    let api = `${repoUrl}/${repo}`; // 下载项目 
    if (tag) {
        api += `#${tag}`;
    }
    const dest = `${downloadDirectory}/${repo}`; // 将模板下载到对应的目录中 
    await downLoadGit(api, dest);
    return dest; // 返回下载目录
};

const main = async (projectName) => {
    let repos =  await wrapFetchAddLoading(fetchRepoList, 'fetching repo list')();
    repos = repos.map(item => item.name);
    const { repo } = await Inquirer.prompt({
        name : 'repo',
        type : 'list',
        message : 'please choice repo template to create project',
        choices: repos
    })
    let tags =  await wrapFetchAddLoading(fetchTagList, 'fetching tag list')(repo);
    tags = tags.map(item => item.name);
    
    //选择tag
    const { tag } = await Inquirer.prompt({
        name : 'tag', 
        type : 'list',
        message : 'please choice repo template to create project',
        choices: tags
    });

    // 下载项目
    const target = await wrapFetchAddLoading(download, 'download template')(repo, tag);
    
    if(!fs.existsSync(path.join(target, 'ask.js'))){
        //拷贝文件
        copy(target, projectName);
    }else{
        renderEjs(target, projectName)
    }
}
module.exports = main;
/**
 * path.resolve()  当前执行命令的目录
 * __dirname 当前文件所在目录
 */
const copy = async (target, projectName) => {
    await ncp(target, path.join(path.resolve(), projectName));
}
// module.exports = copy;
const renderEjs = async (target, projectName) => {
    MetalSmith(__dirname)
        .source(target) //设置遍历目录
        .destination(path.resolve(projectName)) //设置目标目录
        .use(async (files, metal, done) => {
            const result = await Inquirer.prompt(require(path.join(target,
                'ask.js')));
            const data = metal.metadata();
            // 将询问的结果放到metadata中保证在下一个中间件中 可以获取到
            Object.assign(data, result);
            delete files['ask.js'];
            done();
        })
        .use((files, metal, done) => {
            try {
                const filterFiles = Object.keys(files).filter(file => {
                    return file.includes('.js') || file.includes('.json')
                })
                filterFiles.forEach( async (filename) => {
                    // 获取文件中的内容
                    let content = files[filename].contents.toString();
                    // 文件中用<% 我才需要编译
                    if(content.includes('<%')){
                        // 用数据渲染模板
                        content = await render(content, metal.metadata());
                        // 渲染好的结果替换即可
                        files[filename].contents = Buffer.from(content);
                    }
                })
            } catch (error) {
                console.log(error)
            }
            
            done();
        })
        .build((err) => {
            // if(!err){
            //     resolve();
            // }else{
            //     reject();
            // }
        })
}
// module.exports = renderEjs;