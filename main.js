const http = require("http");
const xml = require("fast-xml-parser");
const fs = require("node:fs");
const parser = new xml.XMLParser();
const builder = new xml.XMLBuilder({ format: true });
const server = http.createServer((req, res) => {
    const xmldata = fs.readFileSync("data.xml", "utf-8");
    const obj = parser.parse(xmldata);
    const filteredIncome = obj.indicators.banksincexp.filter(item => item.txten == 'Income, total');
    const filteredExpences = obj.indicators.banksincexp.filter(item => item.txten == 'Expenses, total');
    const incomeTitle = filteredIncome.map(item => item.txt);
    const incomeValue = filteredIncome.map(item => item.value);
    const expencesTitle = filteredExpences.map(item => item.txt);
    const expencesValue = filteredExpences.map(item => item.value);
    const xmlObj = {
        data: {
            indicators: [
                {
                    text: incomeTitle,
                    value: incomeValue
                },
                {
                    text: expencesTitle,
                    value: expencesValue
                }
            ]
        }
    };
    const ActualXml = builder.build(xmlObj);
    res.setHeader('Content-Type', 'application/xml');
    res.end(ActualXml);
});
const port = 8000;
server.listen(port, () => {
    console.log(`Сервер працює на порту ${port}`);
});




