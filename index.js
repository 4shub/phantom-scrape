const express = require('express')
const app = express()
const phantom = require('phantom');


const renderPage = async (url) => {
    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.on('onResourceRequested', function(requestData) {
        console.info('Requesting', requestData.url);
    });

    const status = await page.open(url);
    const content = await page.property('content');

    await instance.exit();

    return content;
}

app.get('/scrape', (req, res) => {
    const { url = false } = req.query;

    if(url) {
        return renderPage(url).then(content => {
            res.status(200).send(content);
        }).catch(() => {
            res.status(500);
        });
    }

    return res.send('send a url!')
})

app.listen(9423, () => console.log('Example app listening on port 9423!'))
