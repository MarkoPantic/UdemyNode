const fs = require('fs');

const routeHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        const markup = `
        <html>
            <head>
                <title>Home route</title>
            </head>
            <body>
                <h1>Node.js server</h1>
                <p>Welcome</p>
                <form action='/create-username' method='POST'>
                    <input type='text' name='username'/>
                    <button type="submit">Register</button>
                </form>

            </body>
        </html>`;

        res.write(markup);
        return res.end();
    }
    const reqData = [];

    if (url === '/create-username' && method === 'POST') {
        req.on('data', (chunk) => {
            reqData.push(chunk)
        })
        return req.on('end', () => {
            return fs.readFile('users.txt', 'utf-8', (err, data) => {
                if (err) {
                    return console.log(err)
                }
                const parsedBody = Buffer.concat(reqData).toString().split('=')[1];
                data = data.concat(`;${parsedBody}`);
                return fs.writeFile('users.txt', data, (err) => {
                    if (err) {
                        console.log(err)
                    }
                    res.statusCode = 302;
                    res.setHeader('Location', '/users');
                    return res.end();

                    
                })
            })
        })     

        
    }

    if (url === '/users') {
        let li = null;
        fs.readFile('users.txt', 'utf-8', (err, data) => {
            if (err) {
                console.log(err)
            }
            li = data.split(';').map(user => `<li>${user}</li>`).join('');
            const markup = `
                        <html>
                            <head>
                                <title>Home route</title>
                            </head>
                            <body>
                                <ul>
                                    ${li}
                                </ul>

                            </body>
                        </html>`;
            res.write(markup);
            res.end();
        });   
    }
}

module.exports = {
    routeHandler
}