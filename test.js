const HAC = require('./index');
const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');

const api = new HAC();

(async () => {
    const rl = readline.createInterface({ input, output });

    try {
        const username = await rl.question('Username: ');
        const password = await rl.question('Password: ');
        rl.close();

        await api.login(username, password);
        const grades = await api.getGrades();
        
        if (grades.length === 0) {
            console.log('No data returned.');
        } else {
            console.table(grades);
        }

    } catch (error) {
        console.error(error.message);
    }
})();