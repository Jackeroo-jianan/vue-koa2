/**
 * 
 */

const log4js = require('log4js')

//log4js级别
const levels = {
    'trace':log4js.levels.TRACE,
    'debug':log4js.levels.DEBUG,
    'info':log4js.levels.INFO,
    'warn':log4js.levels.WARN,
    'error':log4js.levels.ERROR,
    'fatal':log4js.levels.FATAL,
}

log4js.configure({
    //日志输出方式
    appenders:{
        out:{type:'console'},//输出到控制台
        fileInfo:{
            type:'file',
            filename:'logs/fileout.log'
        },
        errorMessage:{
            type:'dateFile',
            filename:'logs/error/',
            pattern:'yyyy-MM-dd.log',//文件格式
            alwaysIncludePattern:true //文件名：filename + pattern
        }
    },

    categories:{
        default:{appenders:['out'],level:'debug'},
        info:{appenders:['fileInfo'],level:'info'},
        errors:{appenders:['errorMessage'],level:'error'},
    }
})

//导出日志函数

exports.debug = (content)=>{
    let logger = log4js.getLogger();
    logger.level = levels.debug;
    logger.debug(content)
}

exports.info = (content)=>{
    let logger = log4js.getLogger('default');
    logger.level = levels.info;
    logger.info(content)
}

exports.error = (content)=>{
    let logger = log4js.getLogger('errors');
    logger.level = levels.error;
    logger.error(content)
}
