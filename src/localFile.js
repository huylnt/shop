import { resolveResource } from '@tauri-apps/api/path'
import { writeTextFile, readTextFile } from '@tauri-apps/api/fs'

const readFile = async (fileName) => {
     const resourcePath = await resolveResource('UserPreferences/'.concat(fileName))
     const content = await readTextFile(resourcePath)
     console.log("Inside route.txt: ", content)
     return content
}

const writeData = async (fileName, content) => {
     const resourcePath = await resolveResource('UserPreferences/'.concat(fileName))
     const response = await writeTextFile(resourcePath, content)
}

export { readFile, writeData }