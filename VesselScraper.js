const { chromium } = require('playwright');
const { google } = require('googleapis');

const fs = require('fs');

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({
        downloadPath: './csv/'
    });
    const page = await context.newPage();
   
    
    const url = 'https://savn4.gaports.com/gpa/vessel/vessel_ot.html'
    const pageCount = 2
    
    

    await page.goto(url);
    await page.waitForTimeout(3000);

    const nextButton = await page.locator('#data_next')
    const className = await nextButton.getAttribute('class');
    const hasSpecificClass = className.includes('disabled');
    let count = 0
    let rowCount = 0
    while (count!= pageCount){
        const berth = await page.locator(".sorting_2").allTextContents()
        const service = await page.locator(".sorting_2+ td").allTextContents()
        const vessel = await page.locator("td:nth-child(4)").allTextContents()
        const oceanCarrier = await page.locator("td:nth-child(5)").allTextContents()
        const eta = await page.locator(".sorting_1").allTextContents()
        const ata = await page.locator(".sorting_1+ td").allTextContents()
        const etd = await page.locator("td:nth-child(8)").allTextContents()
        const atd = await page.locator("td:nth-child(9)").allTextContents()
        const dryBegin = await page.locator("td:nth-child(11)").allTextContents()
        const reeferBegin = await page.locator("td:nth-child(12)").allTextContents()
        const endReceiveDate = await page.locator("td:nth-child(13)").allTextContents()
        const source = new Array(vessel.length).fill(url)
        const now = new Date()
        const sourceUpdate = new Array(vessel.length).fill(now.toString())
        const rows = [berth, service, vessel, oceanCarrier, eta, ata, etd, atd, dryBegin, reeferBegin, endReceiveDate, source, sourceUpdate];
        const columns = rows[0].map((_, columnIndex) => rows.map(row => row[columnIndex]));
        const csvContent = columns.map(column => column.join(',')).join('\n');
        
        // fs.writeFile('data.csv', csvContent, (err) => {
        //     if (err) {
        //         console.error('Error writing CSV file:', err);
        //     } else {
        //         console.log('CSV file created successfully:', filePath);
        //     }
        // });
        

       

        const auth = new google.auth.GoogleAuth({
            keyFile: 'credentials.json',
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const client = await auth.getClient();

        const sheets = google.sheets({ version: 'v4', auth: client });
        const spreadsheetId = '1q4ynjyby5VrY159duqvMvH3tIYwpYJfVszs5Xc8O7uw';


        await sheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "Sheet1!A:B",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: columns
            }
        })
        
        const nextButton = await page.locator('#data_next')
        const className = await nextButton.getAttribute('class');
        const hasSpecificClass = className.includes('disabled');
        count += 1
        await page.click('#data_next')
    


}
    
    await browser.close();
})();


async function writeToSheet() {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();

    const sheets = google.sheets({ version: 'v4', auth: client });
    const spreadsheetId = '1q4ynjyby5VrY159duqvMvH3tIYwpYJfVszs5Xc8O7uw';
    

    await sheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1!A:B",
        valueInputOption: "USER_ENTERED",
        resource:{
            values:[["Make a tutorial", "test"]]
        }
    })
}

// writeToSheet()