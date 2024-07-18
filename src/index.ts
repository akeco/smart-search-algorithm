import readline from 'readline'
import { extractEntities } from './utils/extractEntities'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const promptUser = () => {
    rl.question('Enter a search term: ', async (searchTerm) => {
        try {
            const results = await extractEntities(searchTerm)
            console.log('Extracted Entities:', JSON.stringify(results, null, 2))
        } catch (error) {
            console.error('Error:', error)
        }
        promptUser() // prompt again for the next input
    })
}

promptUser()
