const fs = require('fs')
const path = require('path')
const { getModules, getFile } = require('../../util')

module.exports = (destDir, pathToJsonApiErrors, knexFile, methods = { get: true, put: true, post: true, put: true, patch: true, delete: true }) => {
  pathToJsonApiErrors = path.resolve(destDir, pathToJsonApiErrors)
  knexFile = path.resolve(destDir, knexFile)
  const modules = getModules(destDir)

  if (modules.includes('knex') === false) throw new Error('You don\'t have knex installed.')
  if (modules.includes('express') === false) throw new Error('You don\'t have express installed.')
  if (fs.existsSync(knexFile) === false) throw new Error('Knex file does not exist.')
  
  if (fs.existsSync(pathToJsonApiErrors) === false) {
    fs.writeFileSync(pathToJsonApiErrors, fs.readFileSync(path.resolve(__dirname, './errors.js')))
  }

  
  const contents = `const express = require('express')
const errors = require('${pathToJsonApiErrors}')
const knex = require('${knexFile}')
const router = express.Router()


  `
}
