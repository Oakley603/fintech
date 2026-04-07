export default async function handler(req, res) {
    const API_KEY = process.env.FIXER_API_KEY;
    const response = await fetch(
        `http://data.fixer.io/api/latest?access_key=${API_KEY}&symbols=CNY,MYR,SGD,THB`
    );
    const data = await response.json();
    res.json(data);
}